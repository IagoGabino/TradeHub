const ProductService = require('../services/productService');
const Product = require('../models/Product');
const bcrypt = require('bcrypt');
const PermissionError = require('../utils/errors/PermissionError');
const NotFoundError = require('../utils/errors/NotFoundError');
const path = require('path');

jest.mock('../models/Product');
jest.mock('../utils/encryptPassword');
jest.mock('bcrypt');

describe('ProductService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('create: deve criar um produto com os dados fornecidos', async () => {
        const mockBody = { name: 'Produto 1', price: 100 };
        const mockFotoPath = 'uploads/produto1.jpg';
        const mockCreatedProduct = { id: 1, ...mockBody, foto: mockFotoPath };

        Product.create.mockResolvedValue(mockCreatedProduct);

        const result = await ProductService.create(mockBody, mockFotoPath);

        expect(Product.create).toHaveBeenCalledWith({
            foto: mockFotoPath,
            ...mockBody,
        });
        expect(result).toEqual(mockCreatedProduct);
    });

    test('getAllProducts: deve retornar todos os produtos disponíveis', async () => {
        const mockProducts = [
            { id: 1, name: 'Produto 1', available: true },
            { id: 2, name: 'Produto 2', available: true },
            { id: 3, name: 'Produto 3', available: false },
        ];

        Product.findAll.mockResolvedValue(mockProducts);

        const result = await ProductService.getAllProducts();

        expect(Product.findAll).toHaveBeenCalledWith({
            where: { available: true },
        });
        expect(result).toEqual(mockProducts);
    });

    test('getProductById: deve retornar o produto quando encontrado', async () => {
        const mockProduct = { id: 1, name: 'Produto 1' };

        Product.findByPk.mockResolvedValue(mockProduct);

        const result = await ProductService.getProductById(1);

        expect(Product.findByPk).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockProduct);
    });

    test('getProductById: deve lançar NotFoundError quando o produto não for encontrado', async () => {
        Product.findByPk.mockResolvedValue(null);

        await expect(ProductService.getProductById(999))
            .rejects
            .toThrow(NotFoundError);
    });

    test('getPhoto: deve retornar o caminho completo da foto do produto', async () => {
        const mockProduct = { id: 1, foto: 'uploads/produto1.jpg' };
        const expectedPath = path.join('uploads/produto1.jpg');

        Product.findByPk.mockResolvedValue(mockProduct);

        const result = await ProductService.getPhoto(1);

        expect(Product.findByPk).toHaveBeenCalledWith(1);
        expect(result).toEqual(expectedPath);
    });

    test('getPhoto: deve lançar NotFoundError quando o produto não tiver uma foto ou não for encontrado', async () => {
        Product.findByPk.mockResolvedValue(null);

        await expect(ProductService.getPhoto(999))
            .rejects
            .toThrow(NotFoundError);
    });

});
