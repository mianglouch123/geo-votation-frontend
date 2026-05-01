// presentation/hooks/answer/useExportAnswers.js
import { useCallback } from 'react';
import { UseMutation } from '../common/UseMutation.jsx';
import { AnswerRepositoryImpl } from '../../../infrastructure/repositories/AnswerRepositoryImpl.js';
import { ExportAnswersUseCase } from '../../../application/use-cases/answer/ExportAnswersUseCase.js';

const answerRepository = new AnswerRepositoryImpl();
const exportAnswersUseCase = new ExportAnswersUseCase(answerRepository);

export function UseExportAnswers(votationId) {
  const exportAnswers = useCallback(
    ({ page = 1, limit = 1000 }) => {
      return exportAnswersUseCase.execute({ votationId, page, limit });
    },
    [votationId]
  );

  return UseMutation(exportAnswers);
}