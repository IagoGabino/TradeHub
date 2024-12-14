import { makeRequest } from '../libs/RequestModule';

const performSale = async (idProduto, idVendedor, idComprador) => {
    const response = (await makeRequest('POST', '/sales', { idProduto, idVendedor, idComprador }))
    return response
}


export { performSale }