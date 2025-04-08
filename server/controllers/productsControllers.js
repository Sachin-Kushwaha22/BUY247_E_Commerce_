const pool = require('../config/database');
const client = require('../config/redis');

exports.getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const cacheKey = `products_page_${page}_limit_${limit}`;

        // Check if cached data exists in Redis
        const cachedProducts = await client.get(cacheKey);
        if (cachedProducts) {
            const parsedProducts = JSON.parse(cachedProducts);
            const hasMore = parsedProducts.length < limit ? false : true;
            return res.status(200).json({
                message: 'Cached products list',
                products: parsedProducts,
                hasMore
            });
        }

        // Fetch paginated products
        const products = await pool.query(
            `SELECT * FROM products ORDER BY id ASC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        if (products.rowCount === 0) {
            return res.status(200).json({ message: 'No more products', products: [], hasMore: false });
        }

        // Cache this page for 1 hour
        await client.setex(cacheKey, 3600, JSON.stringify(products.rows));
        const hasMore = products.rowCount < limit ? false : true
        res.status(200).json({ message: 'Fetched products', products: products.rows, hasMore });
    } catch (error) {
        console.error('getProducts error', error);
        return res.status(500).json({ message: 'Server error while fetching products' });
    }
}

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const redisProductById = await client.get(`product_by_id:${id}`)
        if (redisProductById) return res.status(200).json({ message: 'Product by Id', product: JSON.parse(redisProductById) })
        const product = await pool.query(
            `select * from products where id = $1`,
            [id]
        );

        if (product.rowCount === 0) return res.status(404).json({ message: "product not found" })
        await client.setex(`product_by_id:${id}`, 3600, JSON.stringify(product.rows))
        return res.status(200).json({ message: "Successfully fetch product ", product: product.rows[0] })
    } catch (error) {
        console.log('getProductById error', error)
        res.status(500).json({ message: 'Server error during fetching product' });
    }
}

exports.getSearchedProducts = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ success: false, message: "Search term is required" });
        }

        // Step 1: Try finding exact or closely matching products
        const searchQuery = `
    SELECT * FROM products 
    WHERE to_tsvector('english', name) @@ websearch_to_tsquery($1) 
    OR name ILIKE $2
`;

        const searchResult = await pool.query(searchQuery, [name, `%${name}%`]);

        // Step 2: If no exact match is found, attempt a broader search
        if (searchResult.rows.length === 0) {
            const broadSearchQuery = `
        SELECT * FROM products 
        WHERE name ILIKE ANY (ARRAY[
            ${name.split(" ").map((_, i) => `$${i + 1}`).join(",")}
        ])
    `;

            const broadSearchResult = await pool.query(broadSearchQuery, name.split(" ").map(word => `%${word}%`));

            return res.status(200).json({
                success: true,
                products: broadSearchResult.rows
            });
        }

        // Return exact match results if found
        res.status(200).json({
            success: true,
            products: searchResult.rows
        });

    } catch (error) {
        console.log('getSearchedProducts error', error)
        res.status(500).json({ message: 'Server error during searching product' });
    }
}

exports.filterProductSearch = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, brand, sort } = req.query

        let query = `select * from products where 1=1 `;
        let values = []
        let count = 1;

        if (category) {
            query += ` and category = $${count}`;
            values.push(category)
            count++;
        }

        if (minPrice) {
            query += ` and price >= $${count}`;
            values.push(minPrice)
            count++;
        }

        if (maxPrice) {
            query += ` and price <= $${count}`;
            values.push(maxPrice)
            count++;
        }

        if (brand) {
            query += ` and brand = $${count}`;
            values.push(brand)
            count++
        }

        if (sort === 'price_asc') {
            query += ` order by price`;
        }
        else if (sort === 'price_desc') {
            query += ` order by price desc`
        }
        else if (sort === 'newest') {
            query += ` order by created_at desc`
        }

        // if(sort === 'popularity'){
        //     query += ` order by views desc`
        // }

        const filterProduct = await pool.query(query, values)

        if (filterProduct.rowCount === 0) return res.status(404).json({ message: "Product not found for specific filters" })
        return res.status(200).json({ message: 'fetched required data', products: filterProduct.rows })
    } catch (error) {
        console.log('filterProductSearch error', error)
        res.status(500).json({ message: 'Server error during searching product' });
    }
}