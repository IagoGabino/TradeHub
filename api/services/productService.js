const Product = require('../models/Product');

const path = require('path')
const NotFoundError = require('../utils/errors/NotFoundError');

class ProductService {
    async create(body, fotoPath) {
        const { title, description, ...otherDetails } = body;
        const product = await Product.create({
            title,
            description,
            foto: fotoPath,
            ...otherDetails
        });

        return product;
    }

    async getAllProducts() {
        const products = await Product.findAll({
            where: { available: true }
        });
        return products;
    }

    async getProductById(id) {
        const product = await Product.findByPk(id);
        if (product) {
            return product;
        } else {
            throw new NotFoundError('Product não encontrado.');
        }
    }

    async getPhoto(id) {
        const product = await Product.findByPk(id);
        if (product && product.foto) {
            const fullPath = path.join(product.foto);
            return fullPath;
        } else {
            throw new NotFoundError('Product não encontrado.');
        }
    }

}

module.exports = new ProductService;