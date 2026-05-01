// presentation/hooks/notification/useMarkAllAsRead.js
import { useCallback } from 'react';
import { UseMutation } from '../common/UseMutation.jsx';
import { NotificationRepositoryImpl } from '../../../infraestructure/repositories/NotificationRepositoryImpl.js';
import { MarkAllAsReadUseCase } from '../../../application/use-cases/notification/MarkAllAsReadUseCase.js';

const notificationRepository = new NotificationRepositoryImpl();
const markAllAsReadUseCase = new MarkAllAsReadUseCase(notificationRepository);

export function UseMarkAllAsRead() {
  const markAllAsRead = useCallback(() => markAllAsReadUseCase.execute(), []);

  return UseMutation(markAllAsRead);
}