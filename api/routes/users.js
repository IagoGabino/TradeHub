const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const {loginMiddleware, notLoggedIn} = require('../utils/auth');
const UsersService = require('../services/userService');
const path = require('path')

router.post('/', upload.single('foto'), async (req, res) => {
    try {
        const fotoPath = req.file ? req.file.path : null;
        req.body.fotoPath = fotoPath;
        const user = await UsersService.create(req.body);
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/login', notLoggedIn, loginMiddleware);

router.post('/logout', async (req, res, next) => {
    try{
        res.clearCookie('jwt');
        res.status(200).send('Deslogado com sucesso');
    }catch(error){
        next(error);
    }
});

router.put('/updateSenha', async (req, res, next) => {
    try {
        await UsersService.updatePassword(req.body);
        res.status(200).send('Senha atualizada com sucesso!');
    } catch (error) {
        res.status(400).send(error);
    }
} );

router.get('/:id', async (req, res) => {
    try {
        const user = await UsersService.findById(req.params.id);
        if (user) {
            res.send(user);
        } else {
            res.status(400).send({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/:id/photo', async (req, res) => {
    try {
        const photoPath = await UsersService.getPhoto(req.params.id);
        res.sendFile(photoPath, { root: path.join(__dirname, '..') });
    } catch (error) {
        res.status(400).send({ message: 'Erro do servidor ao recuperar a foto do usuário!' });
    }
});

router.get('/:id/books', async (req, res) => {
    try {
        const books = await UsersService.getAllBooks(req.params.id);
        res.send(books);
    } catch (error) {
        res.status(400).send({ message: 'Erro do servidor ao recuperar livros!' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const user = await UsersService.update(req.params.id, req.body);
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.put('/:id/photo', upload.single('foto'), async (req, res) => {
    try {
        const path = req.file ? req.file.path : null;
        const user = await UsersService.updatePhoto(req.params.id, path);
        res.send(user);
    } catch (error) {
        res.status(400).send({ message: 'Erro do servidor ao atualizar foto!' });
    }
});

module.exports = router;
