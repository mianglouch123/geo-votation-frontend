// application/use-cases/notification/DeleteNotificationUseCase.js
export class DeleteNotificationUseCase {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  execute = async ({ notificationId }) => {
    if (!notificationId) throw new Error('ID de notificación requerido');

    const response = await this.notificationRepository.deleteNotification(notificationId);

    return {
      ok : true,
      data: response.data,
      message: response.message || 'Notificación eliminada correctamente'
    };
  };
}