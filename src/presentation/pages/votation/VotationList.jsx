// presentation/pages/votation/VotationList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UseUserVotationsByRaw } from '../../hooks/user/UseUserVotationsByRaw.jsx';

export default function VotationList() {
  const [selectedTypes, setSelectedTypes] = useState(['created', 'participation', 'answered']);
  const [searchInput, setSearchInput] = useState('');
  
  const { 
    data, 
    loading, 
    error, 
    refetch,
    pagination,
    clearSearch,
    updateSearch,
    searchTerm
  } = UseUserVotationsByRaw(selectedTypes);

  useEffect(() => {
    refetch();
  }, [selectedTypes]);


  // Manejar búsqueda
  const handleSearch = () => {
    if (searchInput.trim()) {
      updateSearch(searchInput.trim());
    } else {
      clearSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    clearSearch();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const typeOptions = [
    { value: 'created', label: 'Creadas por ti', icon: 'created' },
    { value: 'participation', label: 'Donde participo', icon: 'participation' },
    { value: 'answered', label: 'Que respondí', icon: 'answered' }
  ];

  const getIcon = (iconType) => {
    switch(iconType) {
      case 'created':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'participation':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'answered':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleTypeChange = (type, checked) => {
    setSelectedTypes(prev => 
      checked ? [...prev, type] : prev.filter(t => t !== type)
    );
  };

  const getDaysRemaining = (closesAt) => {
    const closeDate = new Date(closesAt);
    const now = new Date();
    const diffTime = closeDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTimeRemaining = (closesAt) => {
    const days = getDaysRemaining(closesAt);
    if (days < 0) return 'Cerrada';
    if (days === 0) return 'Cierra hoy';
    if (days === 1) return 'Cierra mañana';
    return `Cierra en ${days} días`;
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Cargando votaciones...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
        <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-600 font-medium">Error: {error}</p>
      </div>
    </div>
  );

  const typesToShow = selectedTypes.length === 0 
    ? typeOptions.map(opt => opt.value)
    : selectedTypes;

  const totalCreated = data?.created?.items?.length || 0;
  const activeCreated = data?.created?.items?.filter(v => v.status === 'active').length || 0;
  const totalParticipations = data?.participation?.items?.length || 0;
  const totalAnswered = data?.answered?.items?.length || 0;

  // Mostrar indicador de búsqueda activa
  const isSearching = searchTerm && searchTerm.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header Hero */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold">Mis Votaciones</h1>
                </div>
                <p className="text-purple-100 ml-15">
                  Gestiona y visualiza todas tus votaciones creadas y participaciones
                </p>
              </div>
              <Link
                to="/dashboard/votations/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nueva votación
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Creadas por ti</p>
                <p className="text-2xl font-bold text-gray-900">{totalCreated}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">En curso ahora</p>
                <p className="text-2xl font-bold text-emerald-600">{activeCreated}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Donde participo</p>
                <p className="text-2xl font-bold text-purple-600">{totalParticipations}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Que respondí</p>
                <p className="text-2xl font-bold text-orange-600">{totalAnswered}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                placeholder="Buscar por título o descripción..."
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
                  onClick={handleClearSearch}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                >
                  Limpiar
                </button>
              )}
            </div>
            {isSearching && (
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Resultados para: "{searchTerm}"</span>
              </div>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-wrap gap-4">
            {typeOptions.map(option => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(option.value)}
                  onChange={(e) => handleTypeChange(option.value, e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer"
                />
                <div className="flex items-center gap-2 text-sm text-gray-700 group-hover:text-purple-600 transition">
                  {getIcon(option.icon)}
                  <span>{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Lista de votaciones */}
        <div className="space-y-6">
          {typesToShow.map(type => {
            const items = data?.[type]?.items || [];
            const getTitle = () => {
              if (type === 'created') return 'Mis Votaciones';
              if (type === 'participation') return 'Votaciones que participo';
              return 'Votaciones que respondí';
            };
            const getIconColor = () => {
              if (type === 'created') return 'from-blue-500 to-blue-600';
              if (type === 'participation') return 'from-purple-500 to-purple-600';
              return 'from-orange-500 to-orange-600';
            };

            if (items.length === 0) return null;

            return (
              <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className={`px-6 py-4 bg-gradient-to-r ${getIconColor()} text-white`}>
                  <div className="flex items-center gap-2">
                    {getIcon(type === 'created' ? 'created' : type === 'participation' ? 'participation' : 'answered')}
                    <h2 className="text-lg font-semibold">{getTitle()}</h2>
                    <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {items.length}
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {items.map(votation => {
                    const daysRemaining = getDaysRemaining(new Date(votation.closesAt).toISOString().split("T")[0]);
                    const timeRemaining = getTimeRemaining(new Date(votation.closesAt).toISOString().split("T")[0]);
                    const isUrgent = daysRemaining > 0 && daysRemaining <= 3;
                    
                    return (
                      <div key={votation.id} className="p-6 hover:bg-gray-50 transition-all duration-200">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{votation.subject}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                votation.status === 'active' 
                                  ? 'bg-emerald-100 text-emerald-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {votation.status === 'active' ? 'Activa' : 'Cerrada'}
                              </span>
                              {type === 'participation' && (
                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                                  {votation.role === 'EDIT' ? 'Editor' : 'Solo lectura'}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{votation.description}</p>
                            
                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className={isUrgent && votation.status === 'active' ? 'text-orange-600 font-medium' : 'text-gray-500'}>
                                  {timeRemaining}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-gray-500">
                                  Cierra: {new Date(votation.closesAt).toISOString().split("T")[0]}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Acciones */}
                          <div className="flex gap-2 flex-wrap">
                            {(type === 'created' || type === 'participation') && (
                              <Link
                                to={`/dashboard/votations/${votation.id}`}
                                className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium"
                              >
                                Administrar
                              </Link>
                            )}
                            {(type === 'created' || type === 'participation') && (
                              <Link
                                to={`/dashboard/votations/${votation.id}/results`}
                                className="px-3 py-1.5 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition font-medium"
                              >
                                Resultados
                              </Link>
                            )}
                            {votation.status === 'active' && (
                              <Link
                                to={`/public/votation/${votation.id}/view`}
                                className="px-3 py-1.5 text-sm bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition font-medium"
                              >
                                Votar
                              </Link>
                            )}
                            {type === 'answered' && (
                              <Link
                                to={`/votations/${votation.id}/my-answers`}
                                className="px-3 py-1.5 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition font-medium"
                              >
                                Ver mis respuestas
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Estado vacío */}
        {typesToShow.every(type => (data?.[type]?.items || []).length === 0) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isSearching ? 'No se encontraron resultados' : 'No hay votaciones'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-4">
              {isSearching 
                ? `No se encontraron votaciones que coincidan con "${searchTerm}"`
                : "No hay votaciones para mostrar con los filtros seleccionados"}
            </p>
            {!isSearching && (
              <Link
                to="/dashboard/votations/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Crear mi primera votación
              </Link>
            )}
            {isSearching && (
              <button
                onClick={handleClearSearch}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}

        {/* Paginación Global */}
        {/* Paginación */}
{(pagination?.hasNextPage || pagination?.page > 1) && (
  <div className="mt-8 flex justify-center">
    <div className="flex gap-2">
      <button
        onClick={pagination.prevPage}
        disabled={!pagination.hasPrevPage}
        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
      >
        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Anterior
      </button>
      <span className="px-4 py-2 text-gray-700">
        Página {pagination.page}
      </span>
      <button
        onClick={pagination.nextPage}
        disabled={!pagination.hasNextPage}
        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
      >
        Siguiente
        <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  );
}