import config from "../config";
export const API_PREFIX = `${config.API_BASE_URL}`;


// athena
export const ATHENA_ENDPOINT = `${API_PREFIX}/athena`;

// access-key
export const ACCESS_KEYS_ENDPOINT = `${API_PREFIX}/access-keys`;

// error codes
export const HTTP_CLIENT_ERROR = '500';
