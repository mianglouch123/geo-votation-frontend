// hooks/answer/UseAnswers.jsx
import { useCallback, useState } from "react";
import { UsePagination } from "../common/UsePagination.jsx";
import { GetAnswersUseCase } from "../../../application/use-cases/answer/GetAnswersUseCase.js";

import { AnswerRepositoryImpl } from "../../../infraestructure/repositories/AnswerRepositoryImpl.js";

const answerRepository = new AnswerRepositoryImpl();
const getAnswersUseCase = new GetAnswersUseCase(answerRepository);

export function useAnswers(votationId, questionId = null, userId = null) {
  const [searchEmail, setSearchEmail] = useState(undefined);
  const [searchPage, setSearchPage] = useState(1);  // ← NUEVO: página para búsqueda de usuarios
  
  const fetchAnswers = useCallback(async ({ page, limit }) => {
    return await getAnswersUseCase.execute({ 
      votationId, 
      page, 
      limit, 
      questionId, 
      userId,
      searchEmail,
      searchPage  // ← NUEVO: pasar searchPage
    });
  }, [votationId, questionId, userId, searchEmail, searchPage]);

  const { 
    data, 
    loading, 
    error, 
    pagination, 
    nextPage, 
    prevPage, 
    goToPage, 
    refetch 
  } = UsePagination(fetchAnswers);
  
  const updateSearch = (email, page = 1) => {
    setSearchEmail(email);
    setSearchPage(page);
    goToPage(1);  // Resetear página de respuestas
  };

  const nextSearchPage = () => {
    setSearchPage(prev => prev + 1);
    goToPage(1);  // Resetear página de respuestas
  };

  const prevSearchPage = () => {
    setSearchPage(prev => Math.max(1, prev - 1));
    goToPage(1);
  };

  return {
    data,
    loading,
    error,
    pagination,
    nextPage,
    prevPage,
    goToPage,
    refetch,
    updateSearch,
    searchEmail,
    searchPage,
    nextSearchPage,
    prevSearchPage
  };
}