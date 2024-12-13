const User = require('../models/User');
const Product = require('../models/Product');

const encryptPassword = require('../utils/encryptPassword');
const bcrypt = require('bcrypt');
const PermissionError = require('../utils/errors/PermissionError.js');
const NotFoundError = require('../utils/errors/NotFoundError');
const path = require('path')

class UsersService {
    async create(body){
        body.senha = await encryptPassword(body.senha);
        const { name, email, ...otherDetails } = body;
        const user = await User.create({
            name,
            email,
            foto: body.fotoPath,
            ...otherDetails
        });
        return user;
    }

    async updatePassword(body){
        const user = await User.findByPk(body.id);
        if (user) {
            const matchingPassword = await bcrypt.compare(body.atual, user.senha);
            if (!matchingPassword) {
                throw new PermissionError('Senha atual incorreta!');
            }
            user.senha = await encryptPassword(body.nova);
            await user.save();
        } else {
            throw new PermissionError('Senha atual incorreta!');
        }
    }

    async findById(id){
        const user = await User.findByPk(id);
        return user;
    }

    async getPhoto(id){
        const user = await User.findByPk(id);
        if (user && user.foto) {
            const photoPath = path.join(user.foto);
            return photoPath;
        } else {
            throw new NotFoundError('Usuário não encontrado.');
        }
    }

    async getAllProducts(id){
        const userId = id;
        const user = await User.findByPk(userId);

        if (!user) {
            throw new NotFoundError('Usuário não encontrado.');
        }

        const products = await Product.findAll({
            where: { idVendedor: userId,
                    available: true }
        });

        if (products.length === 0) {
            throw new NotFoundError('Este usuário não possui produtos.');
        }

        return products;
    }

    async update(id, body){
        const user = await User.findByPk(id);
        if (user) {
            if (body.senha) {
                delete body.senha;
            }
            await user.update(body);
        } else {
            throw new NotFoundError('Usuário não encontrado.');
        }

        return user;
    }

    async updatePhoto(id, fotoPath){
        const user = await User.findByPk(id);
        if (user) {
            await user.update({ foto: fotoPath });
        } else {
            throw new NotFoundError('Usuário não encontrado.');
        }
        return user;
    }

}

module.exports = new UsersService;
