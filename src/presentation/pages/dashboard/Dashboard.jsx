// presentation/pages/dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UseDashboard } from '../../hooks/user/UseDashboard.jsx';
import { UseAuthAccess } from '../../hooks/user/UseAuthAccess.jsx';
import { UsePendingInvitations } from '../../hooks/invitation/useGetPendingInvitations.jsx';
import { useUnreadCount } from '../../hooks/notification/useUnreadCount.jsx';

export default function Dashboard() {
  const { hasAccess, loading: authLoading } = UseAuthAccess();
  const { data: dashboardData, loading: dashboardLoading } = UseDashboard();
  const { count: unreadCount } = useUnreadCount();
  const { data: invitations } = UsePendingInvitations();

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Buenos días');
    else if (hour < 18) setGreeting('Buenas tardes');
    else setGreeting('Buenas noches');
  }, []);

  if (authLoading || dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasAccess) {
    window.location.href = '/login';
    return null;
  }

  const summary = dashboardData?.summary || {};
  const myVotations = dashboardData?.myVotations || {};
  const upcomingDeadlines = dashboardData?.upcomingDeadlines || [];
  const recentActivity = dashboardData?.recentActivity || [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting}, {dashboardData?.user?.email || 'Usuario'}
        </h1>
        <p className="text-gray-600 mt-1">Bienvenido a tu panel de control</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Votaciones</p>
              <p className="text-2xl font-bold text-gray-900">{summary.totalVotations || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-green-600">Dueño: {summary.asOwner || 0}</span>
            <span className="text-blue-600">Miembro: {summary.asMember || 0}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Invitaciones</p>
              <p className="text-2xl font-bold text-gray-900">{summary.pendingInvitations || 0}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <Link to="/dashboard/invitations" className="text-sm text-blue-600 hover:text-blue-500 mt-4 inline-block">
            Ver invitaciones →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Notificaciones</p>
              <p className="text-2xl font-bold text-gray-900">{unreadCount || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
          <Link to="/dashboard/notifications" className="text-sm text-blue-600 hover:text-blue-500 mt-4 inline-block">
            Ver notificaciones →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tareas pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{summary.pendingInvitations + unreadCount || 0}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <Link to="/dashboard" className="text-sm text-blue-600 hover:text-blue-500 mt-4 inline-block">
            Revisar →
          </Link>
        </div>
      </div>

      {/* Two columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Mis votaciones */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Mis votaciones</h2>
          </div>
          <div className="p-6 space-y-4">
            {/* Votaciones como dueño */}
            {myVotations.asOwner?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Como dueño</h3>
                {myVotations.asOwner.slice(0, 3).map(v => (
                  <Link
                    key={v.id}
                    to={`/dashboard/votations/${v.id}`}
                    className="block p-3 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{v.subject}</p>
                        <p className="text-sm text-gray-500">{v.description?.substring(0, 80)}...</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${v.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {v.status === 'active' ? 'Activa' : 'Cerrada'}
                      </span>
                    </div>
                  </Link>
                ))}
                {myVotations.asOwner?.length > 3 && (
                  <Link to="/dashboard/votations?type=created" className="text-sm text-blue-600 hover:text-blue-500">
                    Ver todas ({myVotations.asOwner.length}) →
                  </Link>
                )}
              </div>
            )}

            {/* Votaciones como miembro */}
            {myVotations.asMember?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Como miembro</h3>
                {myVotations.asMember.slice(0, 3).map(v => (
                  <Link
                    key={v.id}
                    to={`/dashboard/votations/${v.id}`}
                    className="block p-3 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{v.subject}</p>
                        <p className="text-sm text-gray-500">Rol: {v.role === 'EDIT' ? 'Editor' : 'Solo lectura'}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${v.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {v.status === 'active' ? 'Activa' : 'Cerrada'}
                      </span>
                    </div>
                  </Link>
                ))}
                {myVotations.asMember?.length > 3 && (
                  <Link to="/dashboard/votations?type=participation" className="text-sm text-blue-600 hover:text-blue-500">
                    Ver todas ({myVotations.asMember.length}) →
                  </Link>
                )}
              </div>
            )}

            {(!myVotations.asOwner?.length && !myVotations.asMember?.length) && (
              <div className="text-center py-8">
                <p className="text-gray-500">No tienes votaciones aún</p>
                <Link to="/dashboard/votations/create" className="mt-2 inline-block text-blue-600 hover:text-blue-500">
                  Crear mi primera votación
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Próximas a cerrar y actividad reciente */}
        <div className="space-y-6">
          {/* Próximas a cerrar */}
          {upcomingDeadlines.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Próximas a cerrar</h2>
              </div>
              <div className="p-6 space-y-3">
                {upcomingDeadlines.map(deadline => (
                  <Link
                    key={deadline.id}
                    to={`/dashboard/votations/${deadline.id}`}
                    className="block p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{deadline.title}</p>
                        <p className="text-sm text-yellow-700">
                          Cierra en {deadline.closesIn} día{deadline.closesIn !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <span className="text-xs text-yellow-600">⚠️</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Actividad reciente */}
          {recentActivity.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Actividad reciente</h2>
              </div>
              <div className="p-6 space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {activity.type === 'votation_created' && (
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                      {activity.type === 'votation_participating' && (
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
  <div className="px-6 py-4 border-b border-gray-100">
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
      <h2 className="text-base font-semibold text-gray-900">Acciones rápidas</h2>
    </div>
  </div>
  
  <div className="p-5">
    <div className="flex flex-wrap gap-3">
      <Link
        to="/dashboard/votations/create"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium group"
      >
        <svg className="w-4 h-4 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Nueva votación
      </Link>

      <Link
        to="/dashboard/votations"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm font-medium group"
      >
        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Ver votaciones
      </Link>

      <Link
        to="/dashboard/invitations"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm font-medium group"
      >
        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Invitaciones
      </Link>

      <Link
        to="/dashboard/profile"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm font-medium group"
      >
        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Mi perfil
      </Link>
    </div>
      </div>
     </div>
    </div>
  );
}