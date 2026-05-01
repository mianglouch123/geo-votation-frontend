// presentation/hooks/votation/UseDeleteVotation.js
import { useNavigate } from 'react-router-dom';
import { UseMutation } from '../common/UseMutation.jsx';
import { VotationRepositoryImpl } from '../../../infraestructure/repositories/VotationRepositoryImpl.js';
import { DeleteVotationUseCase } from '../../../application/use-cases/votation/DeleteVotationUseCase.js';

const votationRepository = new VotationRepositoryImpl();
const deleteVotationUseCase = new DeleteVotationUseCase(votationRepository);

export function UseDeleteVotation() {
  const navigate = useNavigate();

  return UseMutation(deleteVotationUseCase.execute, {
    onSuccess: () => {
      navigate('/votations');
    }
  });
}