import { Votation } from "../../../domain/entities/votation/Votation.js"
import { VotationInputSchema } from '../../../zod/form-validators/votation/votation.schema.js';
import { QuestionTypeConfigSchemas } from '../../../zod/type-validators/question.schema.js';

export class CreateVotationUseCase {
  constructor(votationRepository) {
    this.votationRepository = votationRepository;
  }

  execute = async (inputData) => {
  const validatedData = VotationInputSchema.parse(inputData);
  
  // Validar config de cada pregunta
  for (const question of validatedData.questions) {
    const configValidation = QuestionTypeConfigSchemas.safeParse({
      type: question.type,
      config: question.config
    });
    if (!configValidation.success) {
      throw new Error(`Config inválida...`);
    }
  }
  
  // ✅ Directo al repositorio (sin entidad)
  const createdVotation = await this.votationRepository.create(validatedData);
  
  return {
    success: true,
    data: createdVotation,
    message: 'Votación creada correctamente'
  };


  };
}