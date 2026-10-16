import "dotenv/config";

export interface RedisConfig {
    host: string;
    port: number;
    password?: string;
}

export interface JwtConfig {
    secret: string;
    expiresIn: string;
}

export interface AppConfig {
    port: number;
    databaseUrl: string;
    redis: RedisConfig;
    jwt: JwtConfig;
}

const config: AppConfig = {
    port: Number(process.env.PORT) || 3000,
    databaseUrl: process.env.DATABASE_URL as string,
    redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
    },
    jwt: {
        secret: process.env.JWT_SECRET as string,
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    },
};

export default config;
