export default () => ({
    port: process.env.PORT || 3000,
    TOKEN_EXPIRES: process.env.TOKEN_EXPIRES,
    DB_URI: process.env.DB_URI,
    DB_NAME: process.env.DB_NAME,
})