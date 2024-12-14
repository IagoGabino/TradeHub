import { makeRequest } from '../libs/RequestModule';

const getUserTransactions = async (id) => { 
    const response = (await makeRequest('GET', `/sales/${id}`))
    return response
}

export { getUserTransactions }