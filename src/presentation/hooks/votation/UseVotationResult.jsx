// presentation/hooks/votation/UseVotationResults.js
import { useState, useEffect , useCallback } from 'react';
import { VotationRepositoryImpl } from '../../../infraestructure/repositories/VotationRepositoryImpl';
import { GetResultsUseCase } from '../../../application/use-cases/votation/GetResultsUseCase.js';
const votationRepository = new VotationRepositoryImpl();
const getResultsUseCase = new GetResultsUseCase(votationRepository);

export function UseVotationResults(votationId) {
  const [data, setData] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadResults = useCallback(async () => {
  if (!votationId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getResultsUseCase.execute({ votationId, questionId : selectedQuestionId });
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
 
 } , [votationId , selectedQuestionId])

  const refetchDataWithNoQuestion = () => {
   setSelectedQuestionId(null);
  }

  useEffect(() => {
    loadResults();
  }, [loadResults]);
  
  

  return { 
  data, 
  loading, 
  error, 
  refetch : loadResults , 
  refetchDataWithNoQuestion , 
  setSelectedQuestionId , 
  selectedQuestionId };
}