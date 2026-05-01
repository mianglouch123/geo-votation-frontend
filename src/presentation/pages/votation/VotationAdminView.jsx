// presentation/pages/votation/VotationAdminView.jsx
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UseVotation } from '../../hooks/votation/UseVotation.jsx';
import { UseVotationStats } from "../../hooks/votation/UseVotationsStats.jsx";
import { UseVotationResults } from '../../hooks/votation/UseVotationResult.jsx';
import { UseDeleteVotation } from '../../hooks/votation/UseDeleteVotation.jsx';
import { UseCloseVotation } from '../../hooks/votation/UseCloseVotation.jsx';
import { UseUserRole } from '../../hooks/votation/UseUserRoleVotation.jsx';
import { UseDuplicateVotation } from '../../hooks/votation/UseDuplicateVotation.jsx';
export default function VotationAdminView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('results');
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  const { data: votation, loading: loadingVotation } = UseVotation(id);
  const { data: stats, loading: loadingStats } = UseVotationStats(id);
  const { data: results, loading: loadingResults } = UseVotationResults(id);
  const { execute: deleteVotation, loading: deleting } = UseDeleteVotation();
  const { execute: closeVotation, loading: closing } = UseCloseVotation();
  const { role, permissions, loading: loadingUserRole } = UseUserRole(id);
  const { execute: duplicateVotation, loading: duplicating } = UseDuplicateVotation();
  
  const handleShareVotation = (e) => {
   const url = import.meta.env.VITE_FRONT_URL
   const copyUrl = `${url}/public/votation/${id}/view`
   navigator.clipboard.writeText(copyUrl);
   setShowTooltip(prev => !prev)
   setTimeout(() => setShowTooltip(prev => !prev) , 2000)
  }

  if (loadingStats || loadingVotation || loadingUserRole) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Cargando votación...</p>
      </div>
    </div>
  );
  
  if (!votation) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
        <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-600 font-medium">Votación no encontrada</p>
      </div>
    </div>
  );

  const totalVotes = stats?.metrics?.totalAnswers || 0;
  const totalParticipants = stats?.metrics?.totalParticipants || 0;
  const participationRate = stats?.metrics?.completionRate || 0;

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar esta votación? Esta acción no se puede deshacer.')) {
      await deleteVotation(id);
      navigate('/dashboard/votations');
    }
  };

  const handleClose = async () => {
    if (confirm('¿Estás seguro de que quieres cerrar esta votación? Ya no se podrán recibir más respuestas.')) {
      await closeVotation(id);
    }
     window.location.reload();
  };

  const handleDuplicate = async (data) => {
  await duplicateVotation({
    id: id,
    data: {
      newSubject: data.newSubject,
      newDescription: data.newDescription,
      newClosesAt: new Date(data.newClosesAt).toISOString()
    }
  });
  alert("Votación duplicada correctamente");
  // Opcional: redirigir a la nueva votación o recargar
  navigate(`/dashboard/votations`);
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
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
          <Link to="/dashboard/votations" className="hover:text-purple-600 transition">Votaciones</Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium truncate max-w-xs">{votation.subject}</span>
        </div>

        {/* Header Hero */}
        <div className="mb-8">
  <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-xl">
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 flex-wrap mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">{votation.subject}</h1>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            votation.status === 'active' 
              ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/30' 
              : 'bg-gray-500/20 text-gray-100 border border-gray-400/30'
          }`}>
            {votation.status === 'active' ? '● Activa' : '● Cerrada'}
          </span>
          
          {/* ✅ Botón de compartir DENTRO del div flex */}
          <div className="relative">
            <button
              onClick={handleShareVotation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition text-sm font-medium backdrop-blur-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="text-xs">Compartir</span>
            </button>
            {showTooltip && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                ¡Enlace copiado!
              </div>
            )}
          </div>
        </div>
        <p className="text-purple-100 text-sm md:text-base max-w-2xl">{votation.description}</p>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        {votation.status === 'active' && permissions.canClose && (
          <button
            onClick={handleClose}
            disabled={closing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 backdrop-blur rounded-lg hover:bg-amber-500/30 transition text-sm font-medium border border-amber-400/30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            {closing ? 'Cerrando...' : 'Cerrar'}
          </button>
        )}
      
        {permissions.canDelete && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 backdrop-blur rounded-lg hover:bg-red-500/30 transition text-sm font-medium border border-red-400/30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        )}
      </div>
    </div>
  </div>
</div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Participación</p>
                <p className="text-2xl font-bold text-gray-900">{totalVotes}/{totalParticipants}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-blue-500 rounded-full h-1.5" style={{ width: `${participationRate}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tasa de participación</p>
                <p className="text-2xl font-bold text-emerald-600">{participationRate}%</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Fecha de cierre</p>
                <p className="text-xl font-bold text-gray-900">
                  {new Date(votation.closes_at).toISOString().split("T")[0]}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {votation.status === 'active' ? 'En curso' : 'Finalizada'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total respuestas</p>
                <p className="text-2xl font-bold text-orange-600">{totalVotes}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Botón ver respuestas completas */}
        <div className="bg-gradient-to-r from-purple-50 to-white rounded-xl border border-purple-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Análisis de respuestas</h3>
                <p className="text-sm text-gray-500">
                  Explora las {totalVotes} respuestas de usuarios con análisis detallado y gráficos
                </p>
              </div>
            </div>
            <Link
              to={`/dashboard/votations/${id}/answers`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm group"
            >
              <span>Ver respuestas completas</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-6">
            {[
              { id: 'results', label: 'Resultados', icon: '📊' },
              { id: 'voters', label: 'Votantes', icon: '👥' },
              { id: 'activity', label: 'Actividad Reciente', icon: '📈' },
              { id: 'config', label: 'Configuración', icon: '⚙️' }

            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-2 pb-3 px-1 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                }`}
              >
                {activeTab === tab.id ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-gray-500" />
                )}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div>
          {activeTab === 'results' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Resultados de la votación</h3>
              </div>
              <div className="p-6">
                {loadingResults ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Cargando resultados...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {results?.questions?.map((q, idx) => (
                      <div key={q.id} className="pb-6 border-b border-gray-100 last:border-0">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-purple-600">{idx + 1}</span>
                          </div>
                          <h4 className="font-semibold text-gray-900">{q.label}</h4>
                        </div>
                        <div className="ml-9">
                          <p className="text-sm text-gray-500 mb-2">
                            {parseInt(q.stats?.totalAnswers) || 0} respuestas
                          </p>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div 
                              className="bg-purple-500 rounded-full h-2 transition-all duration-500" 
                              style={{ width: `${Math.min(100, (parseInt(q.stats?.totalAnswers) || 0) / totalVotes * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'voters' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Votantes</h3>
                    <p className="text-sm text-gray-500">Usuarios que han participado en esta votación</p>
                  </div>
                </div>
                {totalParticipants === 0 ? (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p className="text-gray-500">Aún no hay votantes para esta votación</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-gray-600">Total de votantes registrados</span>
                    </div>
                    <span className="text-2xl font-bold text-emerald-600">{totalParticipants}</span>
                  </div>
                )}
              </div>

              

              {/* Gestión Miembros */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Gestión de Miembros</h3>
                      <p className="text-sm text-gray-500">
                        Invita colaboradores y gestiona permisos de acceso a esta votación
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/dashboard/votations/${id}/members`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium group"
                  >
                    <span>Gestionar miembros</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
                </div>
              </div>
              <div className="p-6">
                {stats?.metrics?.answersLast7Days && stats.metrics.answersLast7Days.length > 0 ? (
                  <div className="space-y-3">
                    {stats.metrics.answersLast7Days.map((day, index) => {
                      const date = new Date(day.date);
                      const formattedDate = date.toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                      });
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${day.count > 0 ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                            <span className="text-gray-700 capitalize">{formattedDate}</span>
                          </div>
                          <div>
                            {day.count > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                {day.count} {day.count === 1 ? 'respuesta' : 'respuestas'}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">Sin actividad</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-gray-500">No hay actividad registrada en los últimos 7 días</p>
                  </div>
                )}
              </div>
            </div>
          )}

        {activeTab === 'config' && (
  <div className="space-y-6">
    {/* Actualizar formulario */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Actualizar formulario</h3>
            <p className="text-sm text-gray-500">
              Modifica las preguntas, opciones y configuración de la votación
            </p>
          </div>
        </div>
        
        <Link
          to={`/dashboard/votations/${id}/update-votation`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium group"
        >
          <span>Editar votación</span>
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>

    {/* Duplicar votación - Solo visible si tiene permiso */}
    {permissions.canDuplicate && (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Duplicar votación</h3>
              <p className="text-sm text-gray-500">
                Crea una copia de esta votación con nuevos datos
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowDuplicateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium group"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Duplicar votación</span>
          </button>
        </div>
      </div>
    )}
  </div>
)}
  </div>
  </div>
  {showDuplicateModal && (
  <DuplicateModal
    onClose={() => setShowDuplicateModal(false)}
    onDuplicate={handleDuplicate}
    duplicating={duplicating}
    originalSubject={votation.subject}
  />
)}
    
    </div>
  );
}

// Modal de duplicación (puede estar dentro del mismo archivo o importado)
function DuplicateModal({ onClose, onDuplicate, duplicating, originalSubject }) {
  const [formData, setFormData] = useState({
    newSubject: `${originalSubject} (copia)`,
    newDescription: '',
    newClosesAt: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.newSubject.trim()) newErrors.newSubject = 'El título es requerido';
    if (!formData.newDescription.trim()) newErrors.newDescription = 'La descripción es requerida';
    if (!formData.newClosesAt) newErrors.newClosesAt = 'La fecha de cierre es requerida';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    await onDuplicate(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in slide-in-from-bottom-10 duration-300">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Duplicar votación</h3>
            <p className="text-sm text-gray-500">Crea una copia de esta votación</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nuevo título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.newSubject}
              onChange={(e) => handleChange('newSubject', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                errors.newSubject ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Título de la nueva votación"
            />
            {errors.newSubject && <p className="text-red-500 text-sm mt-1">{errors.newSubject}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.newDescription}
              onChange={(e) => handleChange('newDescription', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                errors.newDescription ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Descripción de la nueva votación"
            />
            {errors.newDescription && <p className="text-red-500 text-sm mt-1">{errors.newDescription}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva fecha de cierre <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.newClosesAt}
              onChange={(e) => handleChange('newClosesAt', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                errors.newClosesAt ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.newClosesAt && <p className="text-red-500 text-sm mt-1">{errors.newClosesAt}</p>}
          </div>
          
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={duplicating}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              {duplicating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Duplicando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Duplicar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}