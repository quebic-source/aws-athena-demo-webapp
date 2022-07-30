// app
export const APP_ID_PATH_PARM = ':appId';
export const VERSION_PATH_PARM = ':version';
export const INTENT_PATH_PARM = ':intent';

export const APP_BASE_PATH = `/app/${APP_ID_PATH_PARM}/version/${VERSION_PATH_PARM}`;

export const NESTED_INTENT_BASE_PATH = `/intents/${INTENT_PATH_PARM}`;
export const INTENT_BASE_PATH = `${APP_BASE_PATH}/nlu${NESTED_INTENT_BASE_PATH}`;

export const ACTION_QUERY_PARM = 'action';
export const APP_CREATE_ACTION = 'app-create';

export function createAppBasePath(appId, version) {
    return APP_BASE_PATH
        .replace(APP_ID_PATH_PARM, appId)
        .replace(VERSION_PATH_PARM, version);
}

export function createIntentBasePath(appId, version, intent) {
    return INTENT_BASE_PATH
        .replace(APP_ID_PATH_PARM, appId)
        .replace(VERSION_PATH_PARM, version)
        .replace(INTENT_PATH_PARM, intent);
}
