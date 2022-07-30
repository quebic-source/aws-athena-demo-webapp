import { post } from "../../helpers/utils/http-client";
import { ATHENA_ENDPOINT } from '../../consts/api-endpoints';

export async function makeRequest(request) {
    try {
        return await post(`${ATHENA_ENDPOINT}`, request);
    } catch (err) {
        console.debug('athena makeRequest failed cause', err.message, err.code);
        return { response: err.displayError, status: err.code };
    }
}