const SaleService = require('../services/saleService');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const NotFoundError = require('../utils/errors/NotFoundError');

jest.mock('../models/Sale');
jest.mock('../models/Product');

describe('SaleService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('purchase: deve criar uma venda e marcar o produto como indisponível', async () => {
        const mockProduct = { id: 1, available: true, save: jest.fn() };
        const mockSale = { id: 1, idProduto: 1 };

        Product.findByPk.mockResolvedValue(mockProduct);
        Sale.create.mockResolvedValue(mockSale);

        const body = { idProduto: 1, idComprador: 2, idVendedor: 3 };

        const result = await SaleService.purchase(body);

        expect(Product.findByPk).toHaveBeenCalledWith(1);
        expect(mockProduct.available).toBe(false);
        expect(mockProduct.save).toHaveBeenCalled();
        expect(Sale.create).toHaveBeenCalledWith(body);
        expect(result).toEqual(mockSale);
    });

    test('purchase: deve lançar NotFoundError se o produto não estiver disponível', async () => {
        const mockProduct = { id: 1, available: false };

        Product.findByPk.mockResolvedValue(mockProduct);

        const body = { idProduto: 1 };

        await expect(SaleService.purchase(body))
            .rejects
            .toThrow(NotFoundError);

        expect(Product.findByPk).toHaveBeenCalledWith(1);
        expect(Sale.create).not.toHaveBeenCalled();
    });

    test('findAll: deve retornar todas as vendas e compras do usuário', async () => {
        const mockSales = [
            { id: 1, idVendedor: 2, idComprador: 3, dataValues: {} },
        ];
        const mockPurchases = [
            { id: 2, idVendedor: 3, idComprador: 2, dataValues: {} },
        ];

        Sale.findAll
            .mockResolvedValueOnce(mockSales) // Para vendas
            .mockResolvedValueOnce(mockPurchases); // Para compras

        const result = await SaleService.findAll(2);

        expect(Sale.findAll).toHaveBeenCalledTimes(2);
        expect(Sale.findAll).toHaveBeenCalledWith({ where: { idVendedor: 2 } });
        expect(Sale.findAll).toHaveBeenCalledWith({ where: { idComprador: 2 } });

        expect(result).toEqual([
            { ...mockSales[0], dataValues: { sale: 1 } },
            { ...mockPurchases[0], dataValues: { sale: 0 } },
        ]);
    });

    test('findAll: deve retornar lista vazia se não houver vendas ou compras', async () => {
        Sale.findAll.mockResolvedValue([]);

        const result = await SaleService.findAll(999);

        expect(Sale.findAll).toHaveBeenCalledTimes(2);
        expect(result).toEqual([]);
    });

    test('purchase: deve lançar NotFoundError se o produto não for encontrado', async () => {
        Product.findByPk.mockResolvedValue(null);

        const body = { idProduto: 999 };

        await expect(SaleService.purchase(body))
            .rejects
            .toThrow(NotFoundError);

        expect(Product.findByPk).toHaveBeenCalledWith(999);
    });
});
