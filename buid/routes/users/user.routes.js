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

// src/routes/users/user.routes.ts
var user_routes_exports = {};
__export(user_routes_exports, {
  createUser: () => createUser,
  getUsers: () => getUsers
});
module.exports = __toCommonJS(user_routes_exports);

// src/validation/users.schema.ts
var import_zod = require("zod");
var createUserSchema = import_zod.z.object({
  name: import_zod.z.string({ required_error: "field name is required" }),
  email: import_zod.z.string({ required_error: "field email is required" }).email()
});

// src/utils/formatError.ts
var formatError = (errors) => {
  const formatedError = { messages: [] };
  errors.issues.forEach((element) => {
    formatedError.messages.push(element.message);
  });
  return formatedError;
};

// src/database.ts
var import_knex = require("knex");

// src/env/index.ts
var import_dotenv = require("dotenv");

// src/validation/env.schema.ts
var import_zod2 = require("zod");
var envSchema = import_zod2.z.object({
  NODE_ENV: import_zod2.z.enum(["dev", "test", "production"]).default("dev"),
  PORT: import_zod2.z.coerce.number().default(3333),
  DATABASE_CLIENT: import_zod2.z.enum(["pg", "sqlite"]).default("pg"),
  DATABASE_URL: import_zod2.z.string()
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

// src/routes/users/user.routes.ts
var import_crypto = require("crypto");
var createUser = async (req, res) => {
  const result2 = createUserSchema.safeParse(req.body);
  if (!result2.success) {
    const fromattedErrors = formatError(result2.error);
    console.error(
      `${createUser.name} :: createUserSchame :: error :: ${result2.error}`
    );
    return res.status(400).send(JSON.stringify({ errors: fromattedErrors }));
  }
  const { name, email } = result2.data;
  const user = await knex("users").where("email", email).select("email").first();
  if (user) {
    console.log(`${createUser.name} :: email exists :: ${email}`);
    return res.status(400).send("Email already registered");
  }
  let sessionId = req.cookies.sessionId;
  if (!sessionId) {
    sessionId = (0, import_crypto.randomUUID)();
    res.cookie("sessionId", sessionId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7
      // 7 days
    });
  }
  try {
    await knex("users").insert({
      id: (0, import_crypto.randomUUID)(),
      session_id: sessionId,
      name,
      email
    });
    return res.status(201).send();
  } catch (error) {
    console.error(
      `${createUser.name} :: error on insert on database :: error :: ${error}`
    );
    return res.status(500).send("Internal Server Error");
  }
};
var getUsers = async (_, res) => {
  try {
    const users = await knex("users").select("*");
    return { users };
  } catch (error) {
    console.error(
      `${getUsers.name} :: error on insert on database :: error :: ${error}`
    );
    return res.status(500).send("Internal Server Error");
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createUser,
  getUsers
});
