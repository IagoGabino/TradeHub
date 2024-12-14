import { makeRequest } from '../libs/RequestModule';
import store from '@/store/index.js'

const getUserProducts = async (id) => {
    // gets the logged in user
    const response = (await makeRequest('GET', `/users/${id}/products`))
    return response
}

const addUserProduct = async (formData) => {
    // gets the logged in user
    console.log(formData)
    const response = (await makeRequest('POST', `/products`, formData, true))
    console.log(response)
    return response
}

export { getUserProducts, addUserProduct }