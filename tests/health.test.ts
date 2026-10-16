import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app";

describe("GET /health", () => {
    it("reports the API status and its dependencies (PostgreSQL, Redis)", async () => {
        const res = await request(app).get("/health");

        expect([200, 503]).toContain(res.status);
        expect(res.body).toMatchObject({
            status: expect.stringMatching(/^(ok|degraded)$/),
            dependencies: {
                postgres: expect.stringMatching(/^(ok|error)$/),
                redis: expect.stringMatching(/^(ok|error)$/),
            },
        });
    });
});
