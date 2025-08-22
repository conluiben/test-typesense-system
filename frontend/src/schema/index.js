import joi from "joi";

export const searchParamsSchema = joi.object({
  q: joi.string().required().allow(""),
  query_by: joi.string().required().valid("title"),
  sort_by: joi.string().required(),
  page: joi.number().integer().greater(0).required(),
  per_page: joi.number().integer(),
  prefix: joi.boolean().optional(),
});
