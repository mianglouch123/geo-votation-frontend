// application/use-cases/votation/TransferPropertyUseCase.js
export class TransferPropertyUseCase {
  constructor(votationRepository) {
    this.votationRepository = votationRepository;
  }

  execute = async ({ votationId, newOwnerEmail }) => {
    // ✅ CORREGIDO: newOwnerEmail es el email, no newOwner
    if (!votationId || !newOwnerEmail) {
      throw new Error("Faltan datos necesarios para transferir la propiedad");
    }

    const transferResult = await this.votationRepository.transferOwnership(votationId, newOwnerEmail);
    
    return {
      success: true,
      message: transferResult.message || "Propiedad transferida correctamente",
      data: transferResult.data
    };
  };
}