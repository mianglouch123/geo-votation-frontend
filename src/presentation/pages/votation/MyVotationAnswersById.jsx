// presentation/pages/votation/MyVotationAnswersById.jsx
import { useParams, Link } from 'react-router-dom';
import { UseMyAnswers } from "../../hooks/answer/UseMyAnswer.jsx"
import { renderAnswerByTypeQuestion } from '../../../shared/utils/rendersByQuestion/renderAnswerByTypeQuestion.jsx';

export default function MyVotationAnswersById() {
  const { id } = useParams();
  
  const { data: answersData, loading, error, refetch, pagination } = UseMyAnswers(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando tus respuestas...</p>
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
          <p className="text-red-600 font-medium">Error al cargar tus respuestas</p>
          <p className="text-gray-500 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const votation = answersData?.votation;
  const summary = answersData?.summary;
  const questions = answersData?.questions || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
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
          <span className="text-gray-900 font-medium">Mis respuestas</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{votation?.subject}</h1>
                <p className="text-purple-100 text-sm mt-1">{votation?.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-purple-500/30">
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Cierra: {new Date(votation?.closesAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>{summary?.answeredQuestions} de {summary?.totalQuestions} preguntas respondidas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">Progreso de respuestas</h3>
              <p className="text-sm text-gray-500">Has completado el {summary?.completionPercentage}% de la votación</p>
            </div>
            <div className="text-2xl font-bold text-purple-600">{summary?.completionPercentage}%</div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-full h-2.5 transition-all duration-500"
              style={{ width: `${summary?.completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((item, idx) => {
            const question = item.question;
            const answer = item.answer;
            const isAnswered = !!answer;

            return (
              <div
                key={question.id}
                className={`bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${
                  isAnswered ? 'border-gray-100' : 'border-amber-200 bg-amber-50/30'
                }`}
              >
                <div className="p-6">
                  {/* Question Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isAnswered ? 'bg-green-100' : 'bg-amber-100'
                    }`}>
                      {isAnswered ? (
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-sm font-bold text-amber-600">{idx + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-gray-900">{question.label}</h3>
                        {question.isRequired && (
                          <span className="text-xs text-red-500">*Obligatorio</span>
                        )}
                        {!isAnswered && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                            Pendiente
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        Tipo: {question.type === 'MULTI_OPTION' ? 'Selección múltiple' : 
                               question.type === 'SHORTANSWER' ? 'Respuesta corta' :
                               question.type === 'LARGEANSWER' ? 'Respuesta larga' :
                               question.type === 'DATE' ? 'Fecha' :
                               question.type === 'HOUR' ? 'Hora' : question.type}
                      </p>
                    </div>
                  </div>

                  {/* Answer */}
                  <div className="ml-11 pl-2 border-l-2 border-gray-100">
                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Tu respuesta:</p>
                    <div className="text-gray-800">
                      {renderAnswerByTypeQuestion(question, answer)}
                    </div>
                    {answer?.submittedAt && (
                      <p className="text-xs text-gray-400 mt-3">
                        Respondido el {new Date(answer.submittedAt).toLocaleDateString()} a las {new Date(answer.submittedAt).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {questions.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay preguntas</h3>
            <p className="text-gray-500">Esta votación aún no tiene preguntas configuradas</p>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            to="/dashboard/votations"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a mis votaciones
          </Link>
        </div>
      </div>
    </div>
  );
}