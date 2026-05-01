import { Votation } from "../../../domain/entities/votation/Votation.js"
import { VotationUpdateInputSchema } from '../../../zod/form-validators/votation/votation.schema.js';

import { QuestionTypeConfigSchemas } from '../../../zod/type-validators/question.schema.js';

export class UpdateVotationUseCase {
  constructor(votationRepository) {
    this.votationRepository = votationRepository;
  }

  execute = async (inputData) => {
    const validated = VotationUpdateInputSchema.parse(inputData);

    for (const question of validated.questions) {
      const configValidation = QuestionTypeConfigSchemas.safeParse({
        type: question.type,
        config: question.config
      });

      if (!configValidation.success) {
        throw new Error(
          `Config inválida para pregunta "${question.code}": ${configValidation.error.message}`
        );
      }
    }


    const updatedVotation = await this.votationRepository.update(inputData);

    return {
      success: true,
      data: updatedVotation,
      message: 'Votación actualizada correctamente'
    };
  };
}