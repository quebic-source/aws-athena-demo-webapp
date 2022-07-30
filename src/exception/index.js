import { HTTP_CLIENT_ERROR } from '../consts/api-endpoints';
import { INTERNAL_ERROR } from '../consts/error-messages';

export class HttpClientError extends Error {
    constructor(args){
        super(`HttpClientError : ${args}`);
        this.code = HTTP_CLIENT_ERROR;
        this.displayError = INTERNAL_ERROR;
    }
}