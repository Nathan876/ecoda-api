import app from "./app";
import config from "./config/env";

app.listen(config.port, () => {
    console.log(`Ecoda API listening on port ${config.port}`);
    console.log(`Swagger UI available at http://localhost:${config.port}/docs`);
});
