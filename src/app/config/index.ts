import dotenv from "dotenv";
import { MongoClientOptions } from "mongodb";
import ms from "ms";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
    NODE_ENV: process.env.NODE_ENV,
    port: process.env.PORT,
    database: {
        uri: process.env.DATABASE_URI as string,
        options: {
            serverApi: {
                version: "1",
                strict: true,
                deprecationErrors: true,
            },
        } as MongoClientOptions,
    },
    jwt: {
        secret: process.env.ACCESS_TOKEN_SECRET as string,
        expiresIn: process.env.JWT_EXPIRES_IN as ms.StringValue,
    },
    cors: {
        origin: [process.env.CLIENT_URL as string],
        credentials: true,
    },
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY as string,
    },
};
