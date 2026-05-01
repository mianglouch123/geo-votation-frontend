import { useCallback } from 'react';
import { UsePagination } from '../common/UsePagination.jsx';
import { AnswerRepositoryImpl } from '../../../infraestructure/repositories/AnswerRepositoryImpl.js';
import { GetMyAnswersUseCase } from '../../../application/use-cases/answer/GetMyAnswersUseCase.js';


const answerRepository = new AnswerRepositoryImpl();
const getMyAnswersUseCase = new GetMyAnswersUseCase(answerRepository);

export function UseMyAnswers(votationId , userId = null) {

 const fetchMyAnswers = useCallback( async ({ page , limit }) => {
  return await getMyAnswersUseCase.execute({ votationId, userId, page , limit })
} , [votationId , userId]);

return UsePagination(fetchMyAnswers);

}



