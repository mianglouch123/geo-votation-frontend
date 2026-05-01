// presentation/pages/notification/NotificationsPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UseNotifications } from '../../hooks/notification/useNotifications.jsx';
import { UseMarkAsRead } from '../../hooks/notification/useMarkAsRead.jsx';
import { UseMarkAllAsRead } from '../../hooks/notification/useMarkAllAsRead.jsx';
import { UseDeleteNotification } from "../../hooks/notification/useDeleteNotification.jsx";
import Pagination from '../../hooks/common/Pagination.jsx';

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  
  const { data: notifications, loading, pagination, refetch } = UseNotifications(filter === 'unread' ? false : null);
  const { execute: markAsRead, loading: marking , error : markAsReadError } = UseMarkAsRead();
  const { execute: markAllAsRead, loading: markingAll } = UseMarkAllAsRead();
  const { execute: deleteNotification, loading: deleting } = UseDeleteNotification();

  const handleMarkAsRead = async (_id) => {
    console.log('Marcando como leída:', _id);

    await markAsRead({ notificationId: _id });
    refetch();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    refetch();
  };

  const handleDelete = async (_id) => {
    if (confirm('¿Eliminar esta notificación?')) {
      await deleteNotification({ notificationId: _id });
      refetch();
    }
  };

  const getActionIcon = (action) => {
    switch(action) {
      case 'VOTATION_CREATED':
        return {
          bg: 'bg-blue-50',
          icon: (
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )
        };
      case 'RECEIVED_INVITATION_VOTATION':
        return {
          bg: 'bg-amber-50',
          icon: (
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )
        };
      case 'SEND_INVITATION_VOTATION':
        return {
          bg: 'bg-purple-50',
          icon: (
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )
        };
      case 'TRANSFER_PROPERTY':
        return {
          bg: 'bg-orange-50',
          icon: (
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          )
        };
      default:
        return {
          bg: 'bg-gray-50',
          icon: (
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          )
        };
    }
  };

  const getActionTitle = (action) => {
    switch(action) {
      case 'VOTATION_CREATED': return 'Votación creada';
      case 'RECEIVED_INVITATION_VOTATION': return 'Invitación recibida';
      case 'SEND_INVITATION_VOTATION': return 'Invitación enviada';
      case 'TRANSFER_PROPERTY': return 'Transferencia de propiedad';
      default: return 'Notificación';
    }
  };

  const filteredNotifications = notifications?.notifications?.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  }) || [];

  const unreadCount = notifications?.totalUnreadNotifications || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando notificaciones...</p>
        </div>
      </div>
    );
  }

  return (
    

    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/dashboard" className="hover:text-purple-600 transition flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">Notificaciones</span>
        </div>

        {/* Header Hero */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold">Notificaciones</h1>
                </div>
                <p className="text-purple-100 ml-15">
                  {unreadCount > 0 
                    ? `Tienes ${unreadCount} notificación${unreadCount !== 1 ? 'es' : ''} sin leer`
                    : 'No tienes notificaciones pendientes'}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={markingAll}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Marcar todas como leídas
                </button>
              )}
            </div>
          </div>
        </div>

        {markAsReadError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{markAsReadError}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900">{notifications?.totalNotifications|| 0}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">No leídas</p>
                <p className="text-2xl font-bold text-amber-600">{unreadCount}</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Leídas</p>
                <p className="text-2xl font-bold text-emerald-600">{notifications?.totalReadNotifications || 0}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros mejorados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                filter === 'all'
                  ? 'bg-gray-800 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Todas
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                filter === 'unread'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              No leídas
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                filter === 'read'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Leídas
            </button>
          </div>
        </div>

        {/* Lista de notificaciones - SIN BORDE EXTERIOR */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay notificaciones</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {filter !== 'all' 
                ? `No tienes notificaciones ${filter === 'unread' ? 'sin leer' : 'leídas'}`
                : 'Todavía no tienes notificaciones. Cuando recibas notificaciones, aparecerán aquí.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const iconConfig = getActionIcon(notification.action);
              const isUnread = !notification.read;
              
              return (
                <div
                  key={notification._id}
                  className={`group bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden ${
                    isUnread ? 'relative' : ''
                  }`}
                >
                  {/* Borde lateral izquierdo para no leídas */}
                  {isUnread && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-purple-600" />
                  )}
                  
                  <div className="p-5">
                    <div className="flex gap-4">
                      {/* Icono */}
                      <div className={`w-12 h-12 ${iconConfig.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                        {iconConfig.icon}
                      </div>
                      
                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className={`text-sm font-medium ${isUnread ? 'text-purple-600' : 'text-gray-900'}`}>
                                {getActionTitle(notification.action)}
                              </span>
                              {notification.count > 1 && (
                                <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                  {notification.count} notificaciones
                                </span>
                              )}
                            </div>
                            <p className={`text-gray-700 ${isUnread ? 'font-medium' : ''}`}>
                              {notification.message}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="text-right">
                              <p className="text-xs text-gray-400 whitespace-nowrap">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </p>
                            </div>
                            {isUnread && (
                              <button
                                onClick={() => handleMarkAsRead(notification._id)}
                                disabled={marking}
                                className="p-1.5 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition"
                                title="Marcar como leída"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notification._id)}
                              disabled={deleting}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                              title="Eliminar"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        {/* Detalles expandibles */}
                        {notification.payload && Object.keys(notification.payload).length > 0 && (
                          <div className="mt-3">
                            <button
                              onClick={() => setExpandedId(expandedId === notification._id ? null : notification._id)}
                              className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-purple-600 transition"
                            >
                              <svg className={`w-3 h-3 transition-transform ${expandedId === notification._id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                              {expandedId === notification._id ? 'Ocultar detalles' : 'Ver detalles'}
                            </button>
                            
                            {expandedId === notification._id && (
                              <div className="mt-3 p-4 bg-gray-50 rounded-xl">
                                <div className="space-y-2">
                                  {Object.entries(notification.payload).map(([key, value]) => (
                                    <div key={key} className="flex gap-2 text-sm">
                                      <span className="font-medium text-gray-700 w-32">{key}:</span>
                                      <span className="text-gray-600 break-all">
                                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Paginación */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              hasPrev={pagination.hasPrev}
              hasNext={pagination.hasNext}
              onPrev={() => pagination.prevPage()}
              onNext={() => pagination.nextPage()}
              onPageChange={(page) => pagination.goToPage(page)}
              totalItems={pagination.total}
            />
          </div>
        )}
      </div>
    </div>
  );
}