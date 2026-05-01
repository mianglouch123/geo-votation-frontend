// presentation/hooks/answer/useAnsweredVotations.js
import { useCallback } from 'react';
import { UsePagination } from '../common/UsePagination.jsx';
import { AnswerRepositoryImpl } from '../../../infraestructure/repositories/AnswerRepositoryImpl.js';
import { GetAnsweredVotationsUseCase } from '../../../application/use-cases/answer/GetAnsweredVotationsUseCase.js';

const answerRepository = new AnswerRepositoryImpl();
const getAnsweredVotationsUseCase = new GetAnsweredVotationsUseCase(answerRepository);

export function useAnsweredVotations(userId) {
  const fetchAnsweredVotations = useCallback(
    ({ page, limit }) => {
      return getAnsweredVotationsUseCase.execute({ userId, page, limit });
    },
    [userId]
  );

  return UsePagination(fetchAnsweredVotations);
}