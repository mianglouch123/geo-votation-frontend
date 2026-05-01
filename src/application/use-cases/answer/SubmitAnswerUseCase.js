// application/use-cases/answer/SubmitAnswerUseCase.js
import { AnswerInputSchema } from "../../../zod/form-validators/answer/answer.input.schema.js";
import { BulkAnswersInputSchema } from "../../../zod/form-validators/answer/answer.input.schema.js";
export class SubmitAnswerUseCase {
  constructor(answerRepository) {
    this.answerRepository = answerRepository;
  }

  

  execute = async ({ votationId, answers }) => {
    if (!votationId) throw new Error('ID de votación requerido');
    if (!answers || answers.length === 0) throw new Error('Respuestas requeridas');

    const parseData = BulkAnswersInputSchema.safeParse({ answers });
    if(!parseData.success) {
     throw new Error("Formato de Input form invalido")
    };

    const response = await this.answerRepository.submitAnswer(votationId, answers);    

    return {
      data: response.data,
      message: response.message || 'Respuestas enviadas correctamente'
    };
  };
}