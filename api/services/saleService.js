const Sale = require('../models/Sale');
const Product = require('../models/Product');

const NotFoundError = require('../utils/errors/NotFoundError');

class SaleService {
    async purchase(body) {
        const product = await Product.findByPk(body.idLivro);
        if (product.available) {
            product.available = false;
            await product.save();
            const sale = await Sale.create(body);
            return sale;
        } else {
            throw new NotFoundError('Product not found');
        }
    }

    async findAll(id) {
        const sales = await Sale.findAll({
            where: {
                idVendedor: id
            }
        });
        const purchases = await Sale.findAll({
            where: {
                idComprador: id
            }
        });

        sales.forEach(sale => {
            sale.dataValues.sale = 1;
        });
        purchases.forEach(purchase => {
            purchase.dataValues.sale = 0;
        });

        const allSales = sales.concat(purchases);

        return allSales;
    }
}

module.exports = new SaleService;