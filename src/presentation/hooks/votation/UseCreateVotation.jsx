// presentation/hooks/votation/UseCreateVotation.js
import { UseMutation } from '../common/UseMutation.jsx';
import { VotationRepositoryImpl } from '../../../infraestructure/repositories/VotationRepositoryImpl.js';
import { CreateVotationUseCase } from '../../../application/use-cases/votation/CreateVotationUseCase.js';

const votationRepository = new VotationRepositoryImpl();
const createVotationUseCase = new CreateVotationUseCase(votationRepository);

export function UseCreateVotation() {
  return UseMutation(createVotationUseCase.execute);
}