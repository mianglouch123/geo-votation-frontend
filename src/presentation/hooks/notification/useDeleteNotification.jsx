// presentation/hooks/notification/useDeleteNotification.js
import { useCallback } from 'react';
import { UseMutation } from '../common/UseMutation.jsx';
import { NotificationRepositoryImpl } from '../../../infraestructure/repositories/NotificationRepositoryImpl.js';
import { DeleteNotificationUseCase } from '../../../application/use-cases/notification/DeleteNotificationUseCase.js';

const notificationRepository = new NotificationRepositoryImpl();
const deleteNotificationUseCase = new DeleteNotificationUseCase(notificationRepository);

export function UseDeleteNotification() {
  const deleteNotification = useCallback(
    ({ notificationId }) => deleteNotificationUseCase.execute({ notificationId }),
    []
  );

  return UseMutation(deleteNotification);
}