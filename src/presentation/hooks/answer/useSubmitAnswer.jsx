// presentation/hooks/answer/useSubmitAnswer.js
import { useCallback } from 'react';
import { UseMutation } from '../common/UseMutation.jsx';
import { AnswerRepositoryImpl } from '../../../infraestructure/repositories/AnswerRepositoryImpl.js';
import { SubmitAnswerUseCase } from '../../../application/use-cases/answer/SubmitAnswerUseCase.js';

const answerRepository = new AnswerRepositoryImpl();
const submitAnswerUseCase = new SubmitAnswerUseCase(answerRepository);

export function UseSubmitAnswer(votationId) {
  const submitAnswer = useCallback(
    ({ answers }) => submitAnswerUseCase.execute({ votationId, answers }),
    [votationId]
  );

  return UseMutation(submitAnswer);
}