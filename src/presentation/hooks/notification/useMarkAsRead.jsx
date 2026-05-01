// presentation/hooks/notification/useMarkAsRead.js
import { useCallback } from 'react';
import { UseMutation } from '../common/UseMutation.jsx';
import { NotificationRepositoryImpl } from '../../../infraestructure/repositories/NotificationRepositoryImpl.js';
import { MarkAsReadUseCase } from '../../../application/use-cases/notification/MarkAsReadUseCase.js';

const notificationRepository = new NotificationRepositoryImpl();
const markAsReadUseCase = new MarkAsReadUseCase(notificationRepository);

export function UseMarkAsRead() {
  const markAsRead = useCallback(
    ({ notificationId }) => markAsReadUseCase.execute({ notificationId }),
    []
  );

  return UseMutation(markAsRead);
}