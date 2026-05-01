// presentation/pages/votation/VotationResults.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UseVotationResults } from '../../hooks/votation/UseVotationResult';

export default function VotationResults() {
  const { id } = useParams();
  const { data, loading, error , refetch, selectedQuestionId , setSelectedQuestionId , refetchDataWithNoQuestion } = UseVotationResults(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 font-medium">Error al cargar resultados</p>
          <p className="text-gray-500 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // Manejar ambos formatos de respuesta
  const isSingleQuestion = data?.question !== undefined;
  
  const votationData = {
    subject: data?.subject || data?.data?.subject,
    description: data?.description || data?.data?.description,
    totalParticipants: data?.totalParticipants || data?.data?.totalParticipants || 0
  };
  
  const questions = isSingleQuestion 
    ? [data.question] 
    : (data?.questions || data?.data?.questions || []);
  
  const totalParticipants = votationData.totalParticipants;

  const handleBackToSummary = () => {
    setSelectedQuestionId(null);
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
          <Link to={`/dashboard/votations/${id}`} className="hover:text-purple-600 transition truncate max-w-xs">
            {votationData?.subject}
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">Resultados</span>
        </div>

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
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{votationData?.subject}</h1>
                    <p className="text-purple-100 text-sm mt-1">{votationData?.description}</p>
                  </div>
                </div>
              </div>
              {totalParticipants > 0 && (
                <div className="text-right">
                  <p className="text-sm text-purple-200">Participantes totales</p>
                  <p className="text-3xl font-bold">{totalParticipants}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selector de pregunta - solo mostrar si hay más de una pregunta y no estamos en vista individual */}
        {!isSingleQuestion && questions.length > 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedQuestionId(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                  !selectedQuestionId
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Resumen general
              </button>
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuestionId(q.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                    selectedQuestionId === q.id
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pregunta {idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contenido principal */}
        <div className="space-y-6 class">
          {!selectedQuestionId && !isSingleQuestion ? (
            // Resumen general - todas las preguntas
            <div className="space-y-6">
              {questions.map((question, idx) => (
                <QuestionResultCard
                  key={question.id}
                  question={question}
                  index={idx}
                  totalParticipants={totalParticipants}
                />
              ))}
              {questions.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                  <p className="text-gray-500">No hay preguntas para mostrar</p>
                </div>
              )}
            </div>
          ) : (
            // Pregunta específica (individual)
            <QuestionResultDetail
              question={questions[0] || data?.question}
              index={0}
              totalParticipants={totalParticipants}
              isSingleView={isSingleQuestion || selectedQuestionId !== null}
              onBack={handleBackToSummary}
            />
          )}
        </div>

        {/* Botón volver */}

    {isSingleQuestion && (
    <div className="mt-8 flex justify-center">
      <button
      onClick={() => refetchDataWithNoQuestion()}
      className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-200 font-medium group"
     >
      <svg 
        className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span>Volver al resumen</span>
    </button>
  </div>
)}
      </div>
    </div>
  );
}

// Componente para tarjeta de pregunta en resumen
function QuestionResultCard({ question, index, totalParticipants }) {
  const [expanded, setExpanded] = useState(false);
  const stats = question?.stats;
  const totalAnswers = stats?.totalAnswers || 0;
  const responseRate = totalParticipants > 0 ? (totalAnswers / totalParticipants) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div
        className="p-5 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-purple-600">{index + 1}</span>
              </div>
              <h3 className="font-semibold text-gray-900">{question?.label}</h3>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{totalAnswers} respuestas</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>{responseRate.toFixed(1)}% de participación</span>
              </div>
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Barra de progreso */}
        <div className="mt-4">
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-purple-500 rounded-full h-2 transition-all duration-500"
              style={{ width: `${responseRate}%` }}
            />
          </div>
        </div>
      </div>

      {expanded && (
        <div className="p-5 border-t border-gray-100 bg-gray-50">
          <RenderStatsByType questionType={question?.type} stats={stats} />
        </div>
      )}
    </div>
  );
}

// Componente para detalle completo de una pregunta
function QuestionResultDetail({ question, index, totalParticipants, isSingleView, onBack }) {
  const stats = question?.stats;
  const totalAnswers = stats?.totalAnswers || 0;
  const responseRate = totalParticipants > 0 ? (totalAnswers / totalParticipants) * 100 : 0;

  if (!question) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-gray-500">No se encontró la pregunta</p>
        {onBack && (
          <button
            onClick={onBack}
            className="mt-4 text-purple-600 hover:text-purple-700"
          >
            Volver al resumen
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-purple-600">{index + 1}</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{question.label}</h2>
          </div>
          {!isSingleView && onBack && (
            <button
              onClick={onBack}
              className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al resumen
            </button>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{totalAnswers} respuestas</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>{responseRate.toFixed(1)}% de participación</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-purple-500 rounded-full h-2 transition-all duration-500"
              style={{ width: `${responseRate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        <RenderStatsByType questionType={question.type} stats={stats} />
      </div>
    </div>
  );
}

// Componente que renderiza estadísticas según el tipo de pregunta
function RenderStatsByType({ questionType, stats }) {
  if (!stats) {
    return <div className="text-gray-500 text-center py-8">No hay datos disponibles</div>;
  }

  if (stats.message) {
    return <div className="text-gray-500 text-center py-8">{stats.message}</div>;
  }

  switch (questionType) {
    case 'MULTI_OPTION':
      return <MultiOptionStats stats={stats} />;
    case 'DATE':
      return <DateStats stats={stats} />;
    case 'HOUR':
      return <HourStats stats={stats} />;
    case 'SHORTANSWER':
    case 'LARGEANSWER':
      return <TextStats stats={stats} />;
    default:
      return <div className="text-gray-500">Tipo de pregunta no soportado</div>;
  }
}

// Estadísticas para opción múltiple
function MultiOptionStats({ stats }) {
  const options = stats.options || [];
  const totalRespondents = stats.totalRespondents || 0;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {options.map((opt) => (
          <div key={opt.id}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">{opt.label}</span>
              <span className="text-sm text-gray-500">
                {opt.count} ({opt.percentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-600 rounded-full h-2.5 transition-all duration-500"
                style={{ width: `${opt.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {stats.allowMultiple && (
        <div className="mt-4 p-4 bg-purple-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-2">Estadísticas adicionales</h4>
          <p className="text-sm text-gray-600">
            Promedio de selecciones por usuario: <strong>{stats.avgSelectionsPerUser}</strong>
          </p>
        </div>
      )}

      {!stats.allowMultiple && stats.topOption && (
        <div className="mt-4 p-4 bg-green-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-2">Opción más seleccionada</h4>
          <p className="text-sm">
            <strong>{stats.topOption.label}</strong> con {stats.topOption.count} votos ({stats.topOption.percentage}%)
          </p>
        </div>
      )}

      <div className="text-sm text-gray-500">
        Total de respuestas: <strong>{totalRespondents}</strong>
      </div>
    </div>
  );
}

// Estadísticas para fecha
function DateStats({ stats }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-xs text-gray-500 uppercase">Fecha más temprana</p>
          <p className="text-lg font-semibold text-gray-900">{stats.min}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-xs text-gray-500 uppercase">Fecha más tardía</p>
          <p className="text-lg font-semibold text-gray-900">{stats.max}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-xs text-gray-500 uppercase">Rango en días</p>
          <p className="text-lg font-semibold text-gray-900">{stats.rangeInDays} días</p>
        </div>
      </div>

      {stats.mostCommonDate && (
        <div className="p-4 bg-purple-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-2">Fecha más común</h4>
          <p className="text-sm">
            <strong>{stats.mostCommonDate.date}</strong> con {stats.mostCommonDate.count} respuestas
          </p>
        </div>
      )}

      {stats.byMonth && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Distribución por mes</h4>
          <div className="space-y-2">
            {stats.byMonth.filter(m => m.count > 0).map((month) => (
              <div key={month.month}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{month.monthName}</span>
                  <span>{month.count} ({month.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 rounded-full h-2"
                    style={{ width: `${month.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500">
        Total de respuestas: <strong>{stats.totalRespondents}</strong>
      </div>
    </div>
  );
}

// Estadísticas para hora
function HourStats({ stats }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-xs text-gray-500 uppercase">Hora más temprana</p>
          <p className="text-lg font-semibold text-gray-900">{stats.min}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-xs text-gray-500 uppercase">Hora más tardía</p>
          <p className="text-lg font-semibold text-gray-900">{stats.max}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-xs text-gray-500 uppercase">Hora promedio</p>
          <p className="text-lg font-semibold text-gray-900">{stats.avg}</p>
        </div>
      </div>

      {stats.mostCommon && (
        <div className="p-4 bg-purple-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-2">Hora más común</h4>
          <p className="text-sm">
            <strong>{stats.mostCommon.time}</strong> con {stats.mostCommon.count} respuestas
          </p>
        </div>
      )}

      {stats.distribution && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Distribución por franjas horarias</h4>
          <div className="space-y-2">
            {stats.distribution.map((slot) => (
              <div key={slot.range}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{slot.range} hrs</span>
                  <span>{slot.count} ({slot.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 rounded-full h-2"
                    style={{ width: `${slot.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500">
        Total de respuestas: <strong>{stats.totalRespondents}</strong>
      </div>
    </div>
  );
}

// Estadísticas para texto
function TextStats({ stats }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-xs text-gray-500 uppercase">Longitud mínima</p>
          <p className="text-lg font-semibold text-gray-900">{stats.minLength} caracteres</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-xs text-gray-500 uppercase">Longitud máxima</p>
          <p className="text-lg font-semibold text-gray-900">{stats.maxLength} caracteres</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-xs text-gray-500 uppercase">Longitud promedio</p>
          <p className="text-lg font-semibold text-gray-900">{stats.avgLength} caracteres</p>
        </div>
      </div>

      {stats.topWords && stats.topWords.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Palabras más mencionadas</h4>
          <div className="flex flex-wrap gap-2">
            {stats.topWords.map((word) => (
              <span
                key={word.word}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
              >
                {word.word} ({word.count})
              </span>
            ))}
          </div>
        </div>
      )}

      {stats.sentiment && (
        <div className="p-4 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-3">Análisis de sentimiento</h4>
          <div className="flex gap-4">
            <div className="flex-1 text-center">
              <div className="text-green-600 text-2xl font-bold">{stats.sentiment.positivePercentage}%</div>
              <p className="text-xs text-gray-500">Positivo</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-500 rounded-full h-2" style={{ width: `${stats.sentiment.positivePercentage}%` }} />
              </div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-gray-600 text-2xl font-bold">{stats.sentiment.neutralPercentage || 0}%</div>
              <p className="text-xs text-gray-500">Neutral</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-gray-500 rounded-full h-2" style={{ width: `${stats.sentiment.neutralPercentage || 0}%` }} />
              </div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-red-600 text-2xl font-bold">{stats.sentiment.negativePercentage}%</div>
              <p className="text-xs text-gray-500">Negativo</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-red-500 rounded-full h-2" style={{ width: `${stats.sentiment.negativePercentage}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {stats.sampleResponses && stats.sampleResponses.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Respuestas de ejemplo</h4>
          <div className="space-y-2">
            {stats.sampleResponses.map((response, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{response.preview}</p>
                <p className="text-xs text-gray-400 mt-1">{response.length} caracteres</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500">
        Total de respuestas: <strong>{stats.totalRespondents}</strong>
      </div>
    </div>
  );
}