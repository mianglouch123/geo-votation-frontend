// presentation/pages/member/MembersList.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UseVotationMembers } from '../../hooks/votation/UseVotationMembers.jsx';
import { UseInviteMember } from '../../hooks/votation/UseInviteMember.jsx';
import { UseUpdateMemberRole } from '../../hooks/votation/UseUpdateMemberRole.jsx';
import { UseRemoveMember } from '../../hooks/votation/UseRemoveMember.jsx';
import { UseUserRole } from '../../hooks/votation/UseUserRoleVotation.jsx';
import { UsePendingSentInvitations } from '../../hooks/invitation/usePendingSentInvitations.jsx';
import Pagination from '../../hooks/common/Pagination.jsx';

export default function MembersList() {
  const { id } = useParams();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('ONLYREAD');
  const [searchInput, setSearchInput] = useState('');
  
  const { 
   data: membersData, 
   loading, 
   pagination, 
   refetch,
   updateSearch,
   searchEmail,
   searchPage,
   nextSearchPage,
   prevSearchPage
  } = UseVotationMembers(id);
  
  const { execute: inviteMember, loading: inviting } = UseInviteMember(id);
  const { execute: updateRole, loading: updating } = UseUpdateMemberRole(id);
  const { execute: removeMember, loading: removing } = UseRemoveMember(id);
  const { data: pendingInvitationsData } = UsePendingSentInvitations(id);
  const { permissions } = UseUserRole(id);

  const members = membersData?.members || [];
  const canManageMembers = permissions.canManageMembers;


  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    await inviteMember({ email: inviteEmail, role: inviteRole });
    setInviteEmail('');
    setShowInviteModal(false);
    alert("Se ha enviado la invitación correctamente");
    setTimeout(() => {
      refetch();
    }, 500);
  };

  const handleRoleChange = async (userId, newRole) => {
    await updateRole({ userId, newRole });
    refetch();
  };

  const handleRemove = async (userId) => {
    if (confirm('¿Estás seguro de que quieres eliminar a este miembro?')) {
      await removeMember({ userId });
      refetch();
    }
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      updateSearch(searchInput.trim());
    } else {
      updateSearch(undefined);
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    updateSearch(undefined);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const owner = members.find(m => m.role === 'OWNER');
  const regularMembers = members.filter(m => m.role !== 'OWNER');
  const totalMembers = membersData?.totalMembers || 0;
  const pendingInvitations = pendingInvitationsData?.totalInvitations || 0;

  const showSearchPagination = membersData?.searchMetadata?.totalSearchPages > 1;

  const getRoleBadge = (role) => {
    switch(role) {
      case 'OWNER':
        return { 
          bg: 'bg-amber-50', 
          text: 'text-amber-700', 
          label: 'Propietario',
          icon: (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          )
        };
      case 'EDIT':
        return { 
          bg: 'bg-blue-50', 
          text: 'text-blue-700', 
          label: 'Editor',
          icon: (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          )
        };
      default:
        return { 
          bg: 'bg-gray-50', 
          text: 'text-gray-600', 
          label: 'Solo lectura',
          icon: (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando miembros...</p>
        </div>
      </div>
    );
  }

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
          <span className="text-gray-900 font-medium">Miembros</span>
        </div>

        {/* Header Hero */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold">Gestión de Miembros</h1>
                </div>
                <p className="text-purple-100 ml-15">
                  Gestiona los miembros y permisos de acceso a esta votación
                </p>
              </div>
              {canManageMembers && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Invitar miembro
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Miembros Activos</p>
                <p className="text-2xl font-bold text-emerald-600">{regularMembers.length}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Invitaciones Pendientes</p>
                <p className="text-2xl font-bold text-amber-600">{pendingInvitations}</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Miembros</p>
                <p className="text-2xl font-bold text-purple-600">{totalMembers}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por correo electrónico..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
              >
                Buscar
              </button>
              {searchInput && (
                <button
                  onClick={clearSearch}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                >
                  Limpiar
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Mostrando {members.length} miembros</span>
            </div>
          </div>
        </div>

        {/* Paginación de búsqueda (si hay resultados) */}
        {showSearchPagination && (
       <div className="flex justify-end items-center gap-2 mb-4 text-sm">
       <span className="text-gray-500">
      Página de búsqueda: {searchPage} de {membersData?.searchMetadata?.totalSearchPages}
      </span>
    <button
      onClick={prevSearchPage}
      disabled={searchPage === 1}
      className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button
      onClick={nextSearchPage}
      disabled={searchPage === membersData?.searchMetadata?.totalSearchPages}
      className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
)}

        {/* Propietario */}
        {owner && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="font-semibold text-amber-800">Propietario</h3>
                <span className="text-xs text-amber-600 ml-2">Creador y responsable principal</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-lg">
                    {owner.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{owner.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Propietario
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Miembros de la Votación */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Miembros del equipo</h3>
                <p className="text-sm text-gray-500">{regularMembers.length} miembros activos</p>
              </div>
              {regularMembers.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Rol y permisos configurables</span>
                </div>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {regularMembers.map((member) => {
              const roleConfig = getRoleBadge(member.role);
              
              return (
                <div key={member.userId} className="p-5 hover:bg-gray-50 transition-all duration-200">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold">
                          {member.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${roleConfig.bg} ${roleConfig.text} rounded-full text-xs font-medium`}>
                            {roleConfig.icon}
                            {roleConfig.label}
                          </span>
                          <span className="text-xs text-gray-400">
                            • Desde {new Date(member.joinedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {canManageMembers ? (
                        <div className="relative">
                          <select
                            value={member.role}
                            onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                            disabled={updating}
                            className="appearance-none px-4 py-2 pr-8 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white cursor-pointer hover:border-purple-300 transition"
                          >
                            <option value="ONLYREAD">Solo lectura</option>
                            <option value="EDIT">Editor</option>
                          </select>
                          <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-3 py-1.5 ${roleConfig.bg} ${roleConfig.text} rounded-lg text-sm font-medium`}>
                          {roleConfig.icon}
                          {roleConfig.label}
                        </span>
                      )}
                      
                      {canManageMembers && member.role !== 'OWNER' && (
                        <button
                          onClick={() => handleRemove(member.userId)}
                          disabled={removing}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                          title="Eliminar miembro"
                        >
                          <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {regularMembers.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">Sin miembros adicionales</h4>
                <p className="text-gray-500 text-sm">
                  {canManageMembers 
                    ? "Invita a nuevos miembros para colaborar en esta votación"
                    : "No hay otros miembros en esta votación"}
                </p>
                {canManageMembers && (
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Invitar miembro
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Paginación */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
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

        {/* Modal de invitación */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in slide-in-from-bottom-10 duration-300">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Invitar miembro</h3>
                  <p className="text-sm text-gray-500">Envía una invitación para colaborar</p>
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleInvite} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                      placeholder="usuario@ejemplo.com"
                      className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol
                  </label>
                  <div className="relative">
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer"
                    >
                      <option value="ONLYREAD">Solo lectura - Puede ver los resultados</option>
                      <option value="EDIT">Editor - Puede gestionar la votación</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={inviting}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                  >
                    {inviting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Invitar
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}