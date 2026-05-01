// presentation/hooks/votation/UseTransferProperty.js
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseMutation } from '../common/UseMutation.jsx';
import { VotationRepositoryImpl } from '../../../infraestructure/repositories/VotationRepositoryImpl.js';
import { TransferPropertyUseCase } from '../../../application/use-cases/votation/TransferPropertyUseCase.js';

const votationRepository = new VotationRepositoryImpl();
const transferPropertyUseCase = new TransferPropertyUseCase(votationRepository);

export function UseTransferProperty() {
  const navigate = useNavigate();

  const transferProperty = useCallback(
    ({ votationId, newOwnerEmail }) => 
      transferPropertyUseCase.execute({ votationId, newOwnerEmail }),
    []
  );

  return UseMutation(transferProperty, {
    onSuccess: (result) => {
      navigate(`/votations/${result.data.votationId}`);
    }
  });
}