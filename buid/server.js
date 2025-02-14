"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_fastify = __toESM(require("fastify"));
var import_cookie = __toESM(require("@fastify/cookie"));

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

// src/validation/meal.schema.ts
var import_zod3 = require("zod");
var createMealSchema = import_zod3.z.object({
  name: import_zod3.z.string({ required_error: "field name is required" }),
  desc: import_zod3.z.string().nullish(),
  is_diet: import_zod3.z.boolean({ required_error: "field is_diet is required" }),
  date: import_zod3.z.coerce.date().nullish()
});
var validateRouteId = import_zod3.z.object({
  id: import_zod3.z.string({ required_error: "invalid request id" }).uuid()
});

// src/routes/meals/meals.routes.ts
var import_crypto2 = require("crypto");
var createMeal = async (req, res) => {
  const parsedBody = createMealSchema.safeParse(req.body);
  if (!parsedBody.success) {
    const fromattedErrors = formatError(parsedBody.error);
    console.error(
      `${createMeal.name} :: create Meal Schema :: error :: ${parsedBody.error}`
    );
    return res.status(400).header("Content-Type", "application/json").send(JSON.stringify({ errors: fromattedErrors }));
  }
  const meal = parsedBody.data;
  try {
    await knex("meals").insert({
      id: (0, import_crypto2.randomUUID)(),
      user_id: req.user.id,
      name: meal.name,
      desc: meal.desc,
      date: meal.date,
      is_diet: meal.is_diet
    });
    return res.status(201).send();
  } catch (error) {
    console.error(
      `${createMeal.name} :: error on insert on database :: error :: ${error}`
    );
    return res.status(500).send("Internal Server Error");
  }
};
var listMeals = async (req, res) => {
  try {
    const meals = await knex("meals").where("user_id", req.user.id).select("*");
    return { meals };
  } catch (error) {
    console.error(`${listMeals.name} :: get meals from db :: error :: ${error}`);
    return res.status(500).send("Internal Server Error");
  }
};
var getMeal = async (req, res) => {
  const parsedReqId = validateRouteId.safeParse(req.params);
  if (!parsedReqId.success) {
    const fromattedErrors = formatError(parsedReqId.error);
    console.error(
      `${getMeal.name} :: Request Id Schema :: error :: ${parsedReqId.error}`
    );
    return res.status(400).send(JSON.stringify({ errors: fromattedErrors }));
  }
  const { id } = parsedReqId.data;
  try {
    const meal = await knex("meals").where("id", id).select("*").first();
    if (!meal) {
      return res.status(400).send("Id not Found");
    }
    return { meal };
  } catch (error) {
    console.error(
      `${getMeal.name} :: error on get meal from db :: error :: ${error}`
    );
    return res.status(500).send("Internal Server Error");
  }
};
var updateMeal = async (req, res) => {
  const parsedBody = createMealSchema.safeParse(req.body);
  const parsedReqId = validateRouteId.safeParse(req.params);
  if (!parsedBody.success) {
    const fromattedErrors = formatError(parsedBody.error);
    console.error(
      `${updateMeal.name} :: update Meal Schema :: error :: ${parsedBody.error}`
    );
    return res.status(400).send(JSON.stringify({ errors: fromattedErrors }));
  }
  if (!parsedReqId.success) {
    const fromattedErrors = formatError(parsedReqId.error);
    console.error(
      `${updateMeal.name} :: Request Id Schema :: error :: ${parsedReqId.error}`
    );
    return res.status(400).send(JSON.stringify({ errors: fromattedErrors }));
  }
  const { id } = parsedReqId.data;
  const meal = parsedBody.data;
  try {
    const rows = await knex("meals").where("id", id).update({
      name: meal.name,
      desc: meal.desc,
      date: meal.date,
      is_diet: meal.is_diet
    });
    if (!rows) {
      return res.status(400).send("Id not Found");
    }
    return res.status(204).send();
  } catch (error) {
    console.error(
      `${updateMeal.name} :: error on update on database :: error :: ${error}`
    );
    return res.status(500).send("Internal Server Error");
  }
};
var deleteMeal = async (req, res) => {
  const parsedReqId = validateRouteId.safeParse(req.params);
  if (!parsedReqId.success) {
    const fromattedErrors = formatError(parsedReqId.error);
    console.error(
      `${deleteMeal.name} :: Request Id Schema :: error :: ${parsedReqId.error}`
    );
    return res.status(400).send(JSON.stringify({ errors: fromattedErrors }));
  }
  const { id } = parsedReqId.data;
  try {
    const rows = await knex("meals").where("id", id).delete();
    if (!rows) {
      return res.status(400).send("Id not Found");
    }
    return res.status(204).send();
  } catch (error) {
    console.error(
      `${deleteMeal.name} :: error on delete on database :: error :: ${error}`
    );
    return res.status(500).send("Internal Server Error");
  }
};
var mealMetrics = async (req, res) => {
  try {
    const totalMeals = await knex("meals").where("user_id", req.user.id).count("id", { as: "total" }).first();
    const totalMealsOnDiet = await knex("meals").where("user_id", req.user.id).andWhere("is_diet", true).count("id", { as: "total" }).first();
    const totalMealsOffDiet = await knex("meals").where("user_id", req.user.id).andWhere("is_diet", false).count("id", { as: "total" }).first();
    const totalMealsSequence = await knex("meals").where("user_id", req.user.id).select("is_diet", "date").orderBy("date", "desc");
    console.log({ totalMealsSequence });
    const { bestSequence } = totalMealsSequence.reduce(
      (acc, meal) => {
        if (meal.is_diet) {
          acc.currentSequence += 1;
        } else {
          acc.currentSequence = 0;
        }
        if (acc.currentSequence > acc.bestSequence) {
          acc.bestSequence = acc.currentSequence;
        }
        return acc;
      },
      { bestSequence: 0, currentSequence: 0 }
    );
    return res.status(200).header("content-type", "application/json").serialize({
      totalMeals: totalMeals?.total,
      onDiet: totalMealsOnDiet?.total,
      offDiet: totalMealsOffDiet?.total,
      bestSequenceOnDiet: bestSequence
    });
  } catch (error) {
    console.error(
      `${mealMetrics.name} :: error on count in database :: error :: ${error}`
    );
    return res.status(500).send("Internal Server Error");
  }
};

// src/routes/routes.ts
async function usersRoutes(app2) {
  app2.post("/", createUser);
  app2.get("/", getUsers);
}
async function mealsRoutes(app2) {
  app2.addHook("preHandler", verifySessionId);
  app2.post("/", createMeal);
  app2.get("/", listMeals);
  app2.get("/:id", getMeal);
  app2.put("/:id", updateMeal);
  app2.delete("/:id", deleteMeal);
  app2.get("/metrics", mealMetrics);
}

// src/app.ts
var app = (0, import_fastify.default)();
app.addHook("preHandler", async (request) => {
  console.log(`[${request.method}] ${request.url}`);
});
app.register(import_cookie.default);
app.register(usersRoutes, { prefix: "/users" });
app.register(mealsRoutes, { prefix: "/meals" });
var app_default = app;

// src/server.ts
app_default.listen({
  port: env.PORT
}).then(() => console.log("Server is running on PORT: 3333"));
