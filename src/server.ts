import { Server } from "http";
import app from "./app";
import { config } from "./app/config";

let server: Server;
const port = Number(config.port);

async function main() {
    try {
        server = app.listen(port, () => {
            console.log("Bistro Boss Server Server is listening on port", port);
        });
    } catch (error) {
        console.log(error);
    }
}

main();

process.on("unhandledRejection", () => {
    console.log("UnahandledRejection is detected , shutting down ...");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});

process.on("uncaughtException", () => {
    console.log("UncaughtException is detected , shutting down ...");
    process.exit(1);
});
