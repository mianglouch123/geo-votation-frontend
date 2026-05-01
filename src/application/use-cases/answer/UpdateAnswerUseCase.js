// application/use-cases/answer/UpdateAnswerUseCase.js

import { AnswerInputSchema } from "../../../zod/form-validators/answer/answer.input.schema.js";
import { BulkAnswersInputSchema } from "../../../zod/form-validators/answer/answer.input.schema.js";


export class UpdateAnswerUseCase {
  constructor(answerRepository) {
    this.answerRepository = answerRepository;
  }

  execute = async ({ votationId, answers }) => {
    if(!votationId)  throw new Error("Votation Id no enviada.");
    if (!answers || answers.length === 0) throw new Error('Respuestas requeridas');

    const parseData = BulkAnswersInputSchema.safeParse({ answers });
    if(!parseData.success) {
     throw new Error("Formato de Input form invalido")
    };

    const response = await this.answerRepository.updateAnswer(votationId, answers);

    return {
      data: response.data,
      message: response.message || 'Respuestas actualizadas correctamente'
    };
  };
}