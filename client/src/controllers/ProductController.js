import { makeRequest } from '../libs/RequestModule';

const getProduct = async (id) => {
    const response = (await makeRequest('GET', `/products/${id}`))
    return response
}

const getVendor = async (id) => {
    const response = (await makeRequest('GET', `/users/${id}`))
    return response
}

const getAllProducts = async () => {
   
    const response = (await makeRequest('GET', '/products'))
    return response
}

export { getProduct, getVendor, getAllProducts }