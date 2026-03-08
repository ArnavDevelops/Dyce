declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            CLIENT_ID: string;
            ENVIRONMENT: "dev" | "prod" | "debug";
        }
    }
}

export {};