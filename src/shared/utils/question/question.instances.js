import { DateConfigSchema } from "../../../zod/type-validators/date.schema.validator.js";
import { HourConfigSchema } from "../../../zod/type-validators/hour.schema.validator.js";
import { ShortAnswerConfigSchema } from "../../../zod/type-validators/short.anwer.schema.validator.js";
import { LargeAnswerConfigSchema } from "../../../zod/type-validators/large.answer.schema.validator.js";
import { MultiOptionConfigSchema } from "../../../zod/type-validators/multi.option.schema.validator.js";
export const QuestionTypeConfigInstances = {
  DATE: DateConfigSchema,
  HOUR: HourConfigSchema,
  SHORTANSWER: ShortAnswerConfigSchema,
  LARGEANSWER: LargeAnswerConfigSchema,
  MULTI_OPTION: MultiOptionConfigSchema
}