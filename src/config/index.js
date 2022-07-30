const environment = process.env.NODE_ENV || 'development';
const port = parseInt(process.env.PORT) || 3333;

const config = Object.freeze({
  ENVIRONMENT: environment,
  IS_PRODUCTION: environment === 'production',
  IS_STAGING: environment === 'staging',
  IS_DEVELOPMENT: environment === 'development',
  IS_TEST: environment === 'test',
  PORT: port,
  API_BASE_URL: 'https://bm9g5a3dda.execute-api.us-east-1.amazonaws.com/dev',
  APP_NAME: 'Athena-Demo',
});

export default config;
