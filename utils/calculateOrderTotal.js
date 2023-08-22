const { Product } = require('../model/productModel');

async function calculateOrderTotal(products) {
	const productIds = products.map((product) => product.product);

	try {
		// Fetch product prices from the database
		const fetchedProducts = await Product.find({ _id: { $in: productIds } });

		let total = 0;
		products.forEach((product) => {
			const fetchedProduct = fetchedProducts.find(
				(p) => p._id.toString() === product.product
			);
			if (fetchedProduct) {
				total += fetchedProduct.price * product.quantity;
			}
		});

		return +total.toFixed(2);
	} catch (error) {
		return -1;
	}
}

module.exports = calculateOrderTotal;
