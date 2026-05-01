// presentation/hooks/answer/useUpdateAnswer.js
import { useCallback } from 'react';
import { UseMutation } from '../common/UseMutation.jsx';
import { AnswerRepositoryImpl } from '../../../infraestructure/repositories/AnswerRepositoryImpl.js';
import { UpdateAnswerUseCase } from '../../../application/use-cases/answer/UpdateAnswerUseCase.js';

const answerRepository = new AnswerRepositoryImpl();
const updateAnswerUseCase = new UpdateAnswerUseCase(answerRepository);

export function UseUpdateAnswer(votationId) {
  const updateAnswer = useCallback(
    ({ answers }) => updateAnswerUseCase.execute({ votationId, answers }),
    [votationId]
  );

  return UseMutation(updateAnswer);
}