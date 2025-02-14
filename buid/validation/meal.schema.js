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

// src/validation/meal.schema.ts
var meal_schema_exports = {};
__export(meal_schema_exports, {
  createMealSchema: () => createMealSchema,
  validateRouteId: () => validateRouteId
});
module.exports = __toCommonJS(meal_schema_exports);
var import_zod = require("zod");
var createMealSchema = import_zod.z.object({
  name: import_zod.z.string({ required_error: "field name is required" }),
  desc: import_zod.z.string().nullish(),
  is_diet: import_zod.z.boolean({ required_error: "field is_diet is required" }),
  date: import_zod.z.coerce.date().nullish()
});
var validateRouteId = import_zod.z.object({
  id: import_zod.z.string({ required_error: "invalid request id" }).uuid()
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createMealSchema,
  validateRouteId
});
