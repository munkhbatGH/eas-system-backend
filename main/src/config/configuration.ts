export default () => ({
  port: process.env.PORT || 3000,
  TOKEN_EXPIRES: process.env.TOKEN_EXPIRES, // 60s, 12h, 1d
  DB_URI: process.env.DB_URI,
  DB_NAME: process.env.DB_NAME,
  ELASTIC_SEARCH: process.env.ELASTIC_SEARCH,
})