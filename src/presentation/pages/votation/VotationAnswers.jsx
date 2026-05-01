// presentation/pages/votation/VotationAnswers.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UseVotation } from '../../hooks/votation/UseVotation.jsx';
import Pagination from '../../hooks/common/Pagination.jsx';
import { useAnswers } from '../../hooks/answer/useAnswers.jsx';
// Modal component
function AnswerDetailModal({ answer, onClose }) {
  if (!answer) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Detalles de la respuesta</h3>
            <p className="text-sm text-gray-500">{answer.user?.email}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Votó el {new Date(answer.submittedAt).toLocaleDateString()} a las {new Date(answer.submittedAt).toLocaleTimeString()}</span>
          </div>
          
          {answer.questions?.map((q, idx) => (
            <div key={q.id} className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-purple-600">{idx + 1}</span>
                </div>
                <p className="font-medium text-gray-900">{q.label}</p>
              </div>
              <div className="ml-8 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-gray-700">
                  {Array.isArray(q.answer) 
                    ? q.answer.map(a => a.label).join(', ')
                    : q.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export default function VotationAnswers() {
  const { id } = useParams();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  
  const { data: votation, loading: loadingVotation } = UseVotation(id);
  const { 
    data: answersData, 
    loading: loadingAnswers, 
    pagination, 
    nextPage, 
    prevPage, 
    goToPage,
    refetch,
    updateSearch,
    searchPage,
    nextSearchPage,
    prevSearchPage
  } = useAnswers(id);




  const handleViewDetails = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      updateSearch(searchInput.trim());
    } else {
      updateSearch(undefined);
      refetch();
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    updateSearch(undefined);
    refetch();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Agrupar respuestas por usuario
  const answersByUser = answersData?.questions?.reduce((acc, question) => {
    question.answers?.forEach(answer => {
      const userId = answer.user?.id;
      if (!acc[userId]) {
        acc[userId] = {
          user: answer.user,
          submittedAt: answer.submittedAt,
          questions: []
        };
      }
      acc[userId].questions.push({
        id: question.question.id,
        label: question.question.label,
        answer: answer.value
      });
    });
    return acc;
  }, {}) || {};

  const userAnswersList = Object.values(answersByUser);
  
  const totalVoters = answersData?.summary?.totalVoters || 0;
  const totalParticipants = answersData?.summary?.totalParticipants || 0;
  const participationRate = answersData?.summary?.participationPercentage || 0;
  const totalAnswers = answersData?.summary?.totalAnswers || 0;

  const isLoading = loadingVotation || loadingAnswers;

  const showSearchPagination = answersData?.searchMetadata?.totalSearchPages > 1;

  // Función para limpiar búsqueda desde el estado vacío
  const handleClearSearchFromEmpty = () => {
    setSearchInput('');
    updateSearch(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando respuestas...</p>
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
          <Link to={`/dashboard/votations/${id}`} className="hover:text-purple-600 transition truncate max-w-xs">
            {votation?.subject}
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">Respuestas</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <Link 
            to={`/dashboard/votations/${id}`} 
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm mb-4 transition group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a detalles de votación
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Respuestas de votación</h1>
            <p className="text-gray-500 mt-1">{votation?.subject}</p>
          </div>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total votantes</p>
                <p className="text-2xl font-bold text-gray-900">{totalParticipants}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Han votado</p>
                <p className="text-2xl font-bold text-emerald-600">{totalVoters}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Participación</p>
                <p className="text-2xl font-bold text-blue-600">{participationRate}%</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-blue-500 rounded-full h-1.5 transition-all duration-500" style={{ width: `${participationRate}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Respuestas</p>
                <p className="text-2xl font-bold text-purple-600">{totalAnswers}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
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
              <span>Mostrando {userAnswersList.length} respuestas</span>
            </div>
          </div>
        </div>

         {/* Paginación de búsqueda (si hay resultados) */}
        {showSearchPagination && (
       <div className="flex justify-end items-center gap-2 mb-4 text-sm">
       <span className="text-gray-500">
      Página de búsqueda: {searchPage} de {answersData?.searchMetadata?.totalSearchPages}
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
      disabled={searchPage === answersData?.searchMetadata?.totalSearchPages}
      className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
)}

        {/* Lista de respuestas */}
        <div className="space-y-4">
          {userAnswersList.map((answer, idx) => (
            <div key={idx} className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{answer.user?.email}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>Votó el {new Date(answer.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewDetails(answer)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition font-medium group/btn"
                  >
                    <span>Ver detalles</span>
                    <svg className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {answer.questions.slice(0, 2).map((q, qIdx) => (
                    <div key={q.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gray-100 rounded-md flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">{qIdx + 1}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-700 line-clamp-1">{q.label}</p>
                      </div>
                      <p className="text-sm text-gray-600 ml-7 line-clamp-2">
                        {Array.isArray(q.answer) 
                          ? q.answer.map(a => a.label).join(', ')
                          : q.answer}
                      </p>
                    </div>
                  ))}
                </div>
                {answer.questions.length > 2 && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-sm text-purple-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      + {answer.questions.length - 2} respuestas más
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {userAnswersList.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay respuestas</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchInput 
                  ? `No se encontraron resultados`
                  : "Aún no hay respuestas para esta votación"}
              </p>
              {searchInput && (
                <button
                  onClick={handleClearSearchFromEmpty}
                  className="mt-4 text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          )}
        </div>

        {/* Paginación */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              hasPrev={pagination.hasPrev}
              hasNext={pagination.hasNext}
              onPrev={prevPage}
              onNext={nextPage}
              onPageChange={goToPage}
              totalItems={pagination.total}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedAnswer && (
        <AnswerDetailModal 
          answer={selectedAnswer} 
          onClose={() => setSelectedAnswer(null)} 
        />
      )}
    </div>
  );
}