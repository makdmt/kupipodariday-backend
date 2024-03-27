
export default () => ({
    server: {
        port: parseInt(process.env.SERVER_PORT) || 3000
    },
    database: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'student',
        password: process.env.DB_PASSWORD || 'student',
        name: process.env.DB_NAME || 'kupipodariday',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'secret-key',
        ttl: process.env.JWT_TTL || '6000s',
    }
})