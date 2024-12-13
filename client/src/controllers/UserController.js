import { makeRequest } from '../libs/RequestModule';
import store from '@/store/index.js'

const login = async (email, senha) => {
    const response = await makeRequest('POST', '/users/login', { email, senha })
    return response
}

const getUser = async () => {
    // gets the logged in user
    const response = (await makeRequest('GET', '/users/user'))?.data
    return response
}

const logout = async () => {
    const response = await makeRequest('POST', '/users/logout')
    store.dispatch('doLogout')
    return response
}

const register = async (nome, email, celular, senha) => {
    const response = await makeRequest('POST', '/users', { nome, email, celular, senha })
    return response
}

export { login, getUser, logout, updatePassword, register, updatePhoto }