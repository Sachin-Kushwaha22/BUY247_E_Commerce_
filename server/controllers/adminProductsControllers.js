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
        const result = await pool.query(
            `SELECT * FROM products ORDER BY id ASC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        if(result.rowCount === 0) return res.status(200).json({message:'Data not found'})

        await client.setex(cacheKey, 3600, JSON.stringify(result.rows))
        res.status(200).json({
            success: true,
            products: result.rows,
        });
    } catch (error) {
        console.error("Error fetching all products (admin):", error);
        res.status(500).json({ message: "Internal server error." });
    }
};





const {cloudinary} = require('../config/cloudinary'); // adjust path as needed
const multer = require('multer');
const streamifier = require('streamifier');

// Memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadImageMiddleware = upload.single('image'); 

exports.addProducts = async (req, res) => {
    const { name, description, price, stock, category, brand } = req.body;

    if (!name || !description || !category || !brand || !price || !stock) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {

         // Upload to cloudinary
         const streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        const result = await streamUpload(req);
        const image_url = result.secure_url;


        const addProducts = await pool.query(
            `insert into products(name, description, price, stock, category, brand, image_url)
            Values($1, $2, $3, $4, $5, $6, $7 ) returning *`,
            [name, description, price, stock, category, brand, image_url]
        );

        if (addProducts.rows.length === 0) return res.status(400).json({ message: 'error while adding products' })
        
        const keys = await client.keys("products_page_*"); 
        if (keys.length > 0) await client.del(keys); 
        
        res.status(201).json(addProducts.rows[0]);
    } catch (error) {
        console.log('addProducts error', error)
        res.status(500).json({ message: 'Server error during fetching products' });
    }
}

exports.updateProducts = async (req, res) => {
    try {
        const { id } = req.params; // Get product ID from URL
        const updates = req.body; // Get fields to update

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No fields provided for update." });
        }

        // Build dynamic update query
        // Extract keys from the 'updates' object and map them to SQL placeholders ($1, $2, ...).
        // Example: { name: "Laptop", price: 2000 } → "name = $1, price = $2"
        const fields = Object.keys(updates) //["name", "price"]
            .map((key, index) => `${key} = $${index + 1}`) // ["name = $1", "price = $2"] Dynamically generate "column = $1, column = $2"
            .join(", "); //"name = $1, price = $2" Convert the array to a string separated by commas

        // Extract values from the 'updates' object
        // Example: { name: "Laptop", price: 2000 } → ["Laptop", 2000]
        const values = Object.values(updates);

        // Construct the SQL query dynamically
        // The 'updated_at' field is also updated using NOW() to track modifications
        // The ID is placed at the end using $values.length + 1 to ensure correct placeholder positioning
        const query = `UPDATE products SET ${fields} WHERE id = $${values.length + 1} RETURNING *`;

        // Execute the query, passing the dynamic values array and the ID as the last parameter
        const result = await pool.query(query, [...values, id]);


        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Product not found." });
        }

        const keys = await client.keys("products_page_*"); 
        if (keys.length > 0) await client.del(keys); 

        res.status(200).json({
            message: "Product updated successfully.",
            product: result.rows[0],
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal server error." });
    }

}

exports.deleteProducts = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteProduct = await pool.query(
            `DELETE FROM products WHERE id = $1 RETURNING *`,
            [id]
        );

        if(deleteProduct.rowCount === 0) return res.status(404).json({message:'product not found'})
        
        const keys = await client.keys("products_page_*"); 
        if (keys.length > 0) await client.del(keys); 

        return res.status(200).json({ message:"product deleted successfully", product:deleteProduct.rows[0] })
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

exports.toggleProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body; // true or false

        if (typeof is_active !== "boolean") {
            return res.status(400).json({ message: "Invalid value for is_active. Use true or false." });
        }

        const query = `UPDATE products SET is_active = $1 WHERE id = $2 RETURNING *`;
        const result = await pool.query(query, [is_active, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Product not found." });
        }

        const keys = await client.keys("products_page_*"); 
        if (keys.length > 0) await client.del(keys); 

        res.status(200).json({
            success: true,
            message: `Product ${is_active ? "enabled" : "disabled"} successfully.`,
            product: result.rows[0],
        });
    } catch (error) {
        console.error("Error updating product status:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.bulkAddProducts = async (req, res) => {
    try {
        const products = req.body.products; // Array of products

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Invalid input. Provide an array of products." });
        }

         // Array to store values for placeholders
         const values = [];

         // Generate placeholders dynamically ($1, $2, $3, ... for each product)
         const placeholders = products.map((_, index) => {
             const offset = index * 7;
             return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7})`;
         }).join(", ");
 
         // Push values into the array
         products.forEach(({ name, description, price, stock, category, brand, image_url }) => {
             values.push(name, description, price, stock, category, brand, image_url);
         });
 
         // Final SQL Query
         const query = `
             INSERT INTO products (name, description, price, stock, category, brand, image_url) 
             VALUES ${placeholders} RETURNING *;
         `;

        const result = await pool.query(query, values)

        const keys = await client.keys("products_page_*"); 
        if (keys.length > 0) await client.del(keys); 
        
        res.status(201).json({
            success: true,
            message: `${result.rowCount} products uploaded successfully.`,
            products: result.rows,
        });

    } catch (error) {
        console.error("Error in bulk upload:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

