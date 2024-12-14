const express = require('express');
const router = express.Router();
const SaleService = require('../services/saleService');

router.post('/', async (req, res) => {
    try {
        const sale = await SaleService.purchase(req.body);
        res.status(200).send(sale);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const sales = await SaleService.findAll(req.params.id);
        res.send(sales);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
