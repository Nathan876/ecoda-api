import { writeFileSync } from "node:fs";
import { openapiSpec } from "../src/config/swagger";

writeFileSync("docs/openapi.json", JSON.stringify(openapiSpec, null, 2));
console.log("OpenAPI spec written to docs/openapi.json");
