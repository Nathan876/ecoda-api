import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcryptjs";
import request from "supertest";

// Le repository est mocké : ce test vérifie le comportement HTTP du contrôleur et du service (validation Zod, comparaison bcrypt, émission du JWT) sans dépendre d'une vraie base PostgreSQL.
const { findUserByEmail } = vi.hoisted(() => ({ findUserByEmail: vi.fn() }));
vi.mock("../src/repositories/user.repository", () => ({ findUserByEmail }));

import app from "../src/app";

const TEST_PASSWORD = "EcodaTest123!";

const testUser = {
    id: 1,
    email: "lea.martin@ecoda.io",
    firstName: "Léa",
    passwordHash: bcrypt.hashSync(TEST_PASSWORD, 10),
};

describe("POST /auth/login", () => {
    beforeEach(() => {
        findUserByEmail.mockReset();
    });

    it("returns a JWT when credentials are valid", async () => {
        findUserByEmail.mockResolvedValue(testUser);

        const res = await request(app)
            .post("/auth/login")
            .send({ email: testUser.email, password: TEST_PASSWORD });

        expect(res.status).toBe(200);
        expect(typeof res.body.token).toBe("string");
    });

    it("returns 401 when the password is wrong", async () => {
        findUserByEmail.mockResolvedValue(testUser);

        const res = await request(app)
            .post("/auth/login")
            .send({ email: testUser.email, password: "wrong-password" });

        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Invalid email or password" });
    });

    it("returns 401 when the user does not exist", async () => {
        findUserByEmail.mockResolvedValue(null);

        const res = await request(app)
            .post("/auth/login")
            .send({ email: "inconnu@ecoda.io", password: TEST_PASSWORD });

        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Invalid email or password" });
    });

    it("returns 400 when the password is missing", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ email: testUser.email });

        expect(res.status).toBe(400);
        expect(findUserByEmail).not.toHaveBeenCalled();
    });

    it("returns 400 when the email format is invalid", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ email: "not-an-email", password: TEST_PASSWORD });

        expect(res.status).toBe(400);
        expect(findUserByEmail).not.toHaveBeenCalled();
    });
});
