import express, { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import { openapiSpec } from "./config/swagger";
import usersRoutes from "./routes/users.routes";

const app = express();

app.use(express.json());

app.use(healthRoutes);
app.use("/auth", authRoutes);
app.use(usersRoutes)
app.use("/users", usersRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.get("/docs.json", (req, res) => res.json(openapiSpec));

// À organiser par vos soins : routes /users, /goals, /challenges, /actions, /badges,
// protégées par le middleware de vérification JWT (src/middlewares/).

app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
});

export default app;
