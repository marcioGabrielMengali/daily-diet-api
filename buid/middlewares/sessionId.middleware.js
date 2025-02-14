"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/middlewares/sessionId.middleware.ts
var sessionId_middleware_exports = {};
__export(sessionId_middleware_exports, {
  verifySessionId: () => verifySessionId
});
module.exports = __toCommonJS(sessionId_middleware_exports);

// src/database.ts
var import_knex = require("knex");

// src/env/index.ts
var import_dotenv = require("dotenv");

// src/validation/env.schema.ts
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["dev", "test", "production"]).default("dev"),
  PORT: import_zod.z.coerce.number().default(3333),
  DATABASE_CLIENT: import_zod.z.enum(["pg", "sqlite"]).default("pg"),
  DATABASE_URL: import_zod.z.string()
});

// src/env/index.ts
if (process.env.NODE_ENV === "test") {
  (0, import_dotenv.config)({ path: ".env.test" });
} else {
  (0, import_dotenv.config)();
}
var result = envSchema.safeParse(process.env);
if (!result.success) {
  console.error("Error on ENV Variables !!!", result.error.issues);
  throw new Error("Invalid ENV Variables");
} else {
  console.log("Success on read ENV Variables", result.data);
}
var env = result.data;

// src/database.ts
var config2 = {
  client: env.DATABASE_CLIENT,
  connection: env.DATABASE_CLIENT === "pg" ? env.DATABASE_URL : { filename: env.DATABASE_URL },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations"
  }
};
var knex = (0, import_knex.knex)(config2);

// src/middlewares/sessionId.middleware.ts
async function verifySessionId(req, res) {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    return res.status(401).send("Unauthorized");
  }
  try {
    const user = await knex("users").where("session_id", sessionId).select("*").first();
    req.user = user;
  } catch (error) {
    console.error(`${verifySessionId.name} :: error on database :: ${error}`);
    return res.status(500).send("Internal Server Error");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  verifySessionId
});
