// presentation/hooks/votation/UseVotationMembers.js
import { useCallback, useState } from 'react';
import { UsePagination } from '../common/UsePagination.jsx';
import { VotationRepositoryImpl } from '../../../infraestructure/repositories/VotationRepositoryImpl.js';
import { GetVotationMembersUseCase } from '../../../application/use-cases/votation/GetVotationMembersUseCase.js';

const votationRepository = new VotationRepositoryImpl();
const getMembersUseCase = new GetVotationMembersUseCase(votationRepository);

export function UseVotationMembers(votationId, initialPage = 1, initialLimit = 10) {
  const [searchEmail, setSearchEmail] = useState(undefined);
  const [searchPage, setSearchPage] = useState(1);

  const fetchMembers = useCallback(async ({ page, limit }) => {
    return await getMembersUseCase.execute({ 
      votationId, 
      page, 
      limit,
      searchEmail,
      searchPage
    });
  }, [votationId, searchEmail, searchPage]);

  const { 
    data, 
    loading, 
    error, 
    pagination, 
    nextPage, 
    prevPage, 
    goToPage, 
    refetch 
  } = UsePagination(fetchMembers, initialPage, initialLimit);

  const updateSearch = (email, page = 1) => {
    setSearchEmail(email);
    setSearchPage(page);
    goToPage(1);
  };

  const nextSearchPage = () => {
    setSearchPage(prev => prev + 1);
    goToPage(1);
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