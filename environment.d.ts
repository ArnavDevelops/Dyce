declare global {
    namespace NodeJS {
        interface ProcessEnv {
            Token: string;
            clientId: string;
            environment: "dev" | "prod" | "debug";
        }
    }
}

export {};