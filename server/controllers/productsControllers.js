const pool = require('../config/database');
const client = require('../config/redis');

exports.getProducts = async (req, res) => {
    try {
        const redisProducts = await client.get(`allProducts`)
        if (redisProducts) return res.status(200).json({ message: 'All products list', products: JSON.parse(redisProducts) });
        const products = await pool.query(
            `select * from products`
        );

        if (products.rowCount === 0) return res.status(404).json({ message: 'no products found' })

        await client.set(`allProducts`, JSON.stringify(products.rows))
        res.status(200).json(products.rows);
    } catch (error) {
        console.log('getProducts error', error)
        return res.status(500).json({ message: 'Server error during fetching products' });
    }
}

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const redisProductById = await client.get(`products:1`)
        const productById = JSON.parse(redisProductById).find(product => product.id === id)
        if (productById) return res.status(200).json({ message: 'Product by Id', product: productById })
        const product = await pool.query(
            `select * from products where id = $1`,
            [id]
        );

        if (product.rowCount === 0) return res.status(404).json({ message: "product not found" })

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