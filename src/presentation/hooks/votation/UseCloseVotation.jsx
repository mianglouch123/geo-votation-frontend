// presentation/hooks/votation/UseCloseVotation.js
import { UseMutation } from '../common/UseMutation.jsx';
import { VotationRepositoryImpl } from '../../../infraestructure/repositories/VotationRepositoryImpl.js';
import { CloseVotationUseCase } from '../../../application/use-cases/votation/CloseVotationUseCase.js';
const votationRepository = new VotationRepositoryImpl();
const closeVotationUseCase = new CloseVotationUseCase(votationRepository);

export function UseCloseVotation() {
  return UseMutation(closeVotationUseCase.execute);
}
