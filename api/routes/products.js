const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const path = require('path');
const ProductService = require('../services/productService');

router.post('/', upload.single('foto'), async (req, res) => {
    try {
        const fotoPath = req.file ? req.file.path : null;
        const product = await ProductService.create(req.body, fotoPath);
        res.status(200).send(product);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const products = await ProductService.getAllProducts();
        res.send(products);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await ProductService.getProductById(req.params.id);
        res.send(product);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/:id/photo', async (req, res) => {
    try {
        const fullPath = await ProductService.getPhoto(req.params.id);
        res.sendFile(fullPath, { root: path.join(__dirname, '..') });
    } catch (error) {
        res.status(400).send({ message: 'Erro no servidor ao buscar a foto do produto!' });
    }
});

module.exports = router;
