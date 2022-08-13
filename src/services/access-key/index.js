import { get, post, del } from "../../helpers/utils/http-client";
import { ACCESS_KEYS_ENDPOINT } from '../../consts/api-endpoints';

export async function list() {
    try {
        const { response, status } =  await get(`${ACCESS_KEYS_ENDPOINT}`);
        if (status !== 200) {
            return {pagination: {}, data: []};
        }
        return response;
    } catch (err) {
        console.debug('access-key list failed cause', err.message, err.code);
        return {pagination: {}, data: []};
    }
}

export async function create(request) {
    try {
        return await post(`${ACCESS_KEYS_ENDPOINT}`, request);
    } catch (err) {
        console.debug('access-key create failed cause', err.message, err.code);
        return { response: err.displayError, status: err.code };
    }
}

export async function delKey(customerId) {
    try {
        return await del(`${ACCESS_KEYS_ENDPOINT}/${customerId}`);
    } catch (err) {
        console.debug('access-key delete failed cause', err.message, err.code);
        return { response: err.displayError, status: err.code };
    }
}