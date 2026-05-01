import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UseUserProfile } from "../../hooks/user/UseUserProfile.jsx";
import { UseMyAnswers } from "../../hooks/answer/UseMyAnswer.jsx";
import { UseUpdateAnswer } from "../../hooks/answer/UseUpdateAnswer.jsx";

export default function PublicUpdateAnswerVotationView() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { user: dataUser, loading: loadingUserId } = UseUserProfile();
  const { execute: updateAnswer, loading: loadingUpdateAnswer } = UseUpdateAnswer(id);
  const { data: myAnswersData, loading: loadingMyAnswers } = UseMyAnswers(id, dataUser?.id);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState([]);

  // Inicializar formData con las respuestas existentes
  useEffect(() => {
    if (myAnswersData?.questions && dataUser?.id) {
      const initialFormData = myAnswersData.questions.map(q => ({
        userId: dataUser.id,
        votationId: id,
        questionId: q.question.id,
        questionVersion: q.question.version,
        value: initializeValueFromAnswer(q.question.type, q.answer, q.question.config)
      }));
      setFormData(initialFormData);
    }
  }, [myAnswersData, dataUser, id]);

  // Inicializar valor a partir de la respuesta existente
  const initializeValueFromAnswer = (type, answer, config) => {
    switch (type) {
      case 'SHORTANSWER':
      case 'LARGEANSWER': {
        const existingAnswer = answer?.value || "";
        return { value: existingAnswer || '' };
      }
      
      case 'DATE': {
        const existingDate = answer?.value || answer;
        return { date: existingDate || config?.date || new Date().toISOString().split('T')[0] };
      }
      
      case 'HOUR': {
        const existingValue = answer?.value || config
        const existingHour = existingValue?.hour || (typeof answer === 'string' ? answer.split(':')[0] : null);
        const existingMin = existingValue?.minute || (typeof answer === 'string' ? answer.split(':')[1] : null);
        return {
          hour: existingHour || config?.hour || new Date().getHours().toString().padStart(2, '0'),
          min: existingMin || config?.min || new Date().getMinutes().toString().padStart(2, '0')
        };
      }
      
      case 'MULTI_OPTION': {
        // Crear mapa de opciones seleccionadas desde la respuesta
      const selectedIds = new Set();
      
      // Si hay respuesta existente, extraer los IDs seleccionados
      if (answer?.value && Array.isArray(answer.value)) {
        answer.value.forEach(ans => {
          if (ans?.id) {
            selectedIds.add(ans.id);
          }
        });
      }
      
      return {
        options: config?.options?.map(opt => ({ 
          id: opt.id,
          label: opt.label,
          isChecked: selectedIds.has(opt.id)  // ✅ Marcar como checked si está en el Set
        })) || [],
        allowMultiple: config?.allowMultiple || false
      };
      }
      
      default: {
        return {};
      }
    }
  };

  // Verificar autenticación
  useEffect(() => {
    if (!loadingUserId && !dataUser) {
      navigate('/login');
    }
  }, [dataUser, loadingUserId, navigate]);

  // Verificar si la votación está cerrada
  useEffect(() => {
    if (myAnswersData?.votation?.isClosed === true) {
      navigate('/dashboard');
    }
  }, [myAnswersData, navigate]);

  if (loadingUserId || loadingMyAnswers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!dataUser || !myAnswersData) {
    return null;
  }

  // Manejar cambio de valor
  const handleValueChange = (questionId, newValue) => {
    setFormData(prev =>
      prev.map(item =>
        item.questionId === questionId ? { ...item, value: newValue } : item
      )
    );
    if (errors[questionId]) {
      setErrors(prev => ({ ...prev, [questionId]: undefined }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    const questionsMap = new Map(
      myAnswersData.questions.map(q => [q.question.id, q.question])
    );

    formData.forEach(item => {
      const question = questionsMap.get(item.questionId);
      if (!question) return;

      // Validar required
      if (question.isRequired) {
        if (question.type === 'MULTI_OPTION') {
          const hasChecked = item.value.options?.some(opt => opt.isChecked);
          if (!hasChecked) {
            newErrors[item.questionId] = 'Este campo es obligatorio. Selecciona una opción.';
          }
        } else if (question.type === 'DATE') {
          if (!item.value?.date) {
            newErrors[item.questionId] = 'La fecha es obligatoria.';
          }
        } else if (question.type === 'HOUR') {
          if (!item.value?.hour || !item.value?.min) {
            newErrors[item.questionId] = 'La hora es obligatoria.';
          }
        } else if (!item.value?.value?.trim()) {
          newErrors[item.questionId] = 'Este campo es obligatorio.';
        }
      }

      // Validar MULTI_OPTION
      if (question.type === 'MULTI_OPTION' && !item.value?.allowMultiple) {
        const checkedCount = item.value.options?.filter(opt => opt.isChecked).length || 0;
        if (checkedCount > 1) {
          newErrors[item.questionId] = 'Solo puedes seleccionar una opción.';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!dataUser) return;

    const payload = {
      answers: formData.map(item => ({
        userId: dataUser.id,
        votationId: id,
        questionId: item.questionId,
        questionVersion: item.questionVersion,
        value: item.value
      }))
    };

    try {
      await updateAnswer(payload);
      alert("¡Respuestas actualizadas correctamente!");
      navigate(`/votations/${id}/my-answers`);
    } catch (err) {
      console.error('Error updating answers:', err);
      alert(err?.message || 'Error al actualizar las respuestas');
    }
  };

  // Renderizar input según tipo de pregunta
  const renderQuestionInput = (question, value, onChange) => {
    switch (question.type) {
      case 'SHORTANSWER':
      case 'LARGEANSWER':
        return (
          <textarea
            value={value?.value || ''}
            onChange={(e) => onChange({ value: e.target.value })}
            rows={question.type === 'LARGEANSWER' ? 4 : 2}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            placeholder="Tu respuesta..."
          />
        );

      case 'DATE':
        return (
          <input
            type="date"
            value={value?.date || ''}
            onChange={(e) => onChange({ date: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        );

      case 'HOUR':
        return (
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="0"
              max="23"
              value={value?.hour || ''}
              onChange={(e) => onChange({ ...value, hour: e.target.value.padStart(2, '0') })}
              className="w-24 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder="HH"
            />
            <span className="text-gray-500">:</span>
            <input
              type="number"
              min="0"
              max="59"
              value={value?.min || ''}
              onChange={(e) => onChange({ ...value, min: e.target.value.padStart(2, '0') })}
              className="w-24 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder="MM"
            />
          </div>
        );

      case 'MULTI_OPTION': {
        const isMultiple = value?.allowMultiple;
        
        return (
          <div className="space-y-2">
            {value?.options?.map((opt, idx) => (
              <label key={`${question.id}-${opt.id || idx}`} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type={isMultiple ? 'checkbox' : 'radio'}
                  name={`question_${question.id}`}
                  checked={opt.isChecked || false}
                  onChange={(e) => {
                    let newOptions;
                    if (isMultiple) {
                      newOptions = value.options.map(o =>
                        o.id === opt.id ? { ...o, isChecked: e.target.checked } : o
                      );
                    } else {
                      newOptions = value.options.map(o => ({ 
                        ...o, 
                        isChecked: o.id === opt.id 
                      }));
                    }
                    onChange({ ...value, options: newOptions });
                  }}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700 group-hover:text-purple-600 transition-colors">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{myAnswersData.votation?.subject}</h1>
                <p className="text-purple-100 text-sm">Edita tus respuestas</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-purple-200 border-t border-purple-500/30 pt-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Cierra: {new Date(myAnswersData.votation?.closesAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {myAnswersData.questions?.map((item, idx) => {
            const question = item.question;
            const formItem = formData.find(f => f.questionId === question.id);
            const currentValue = formItem?.value;

            return (
              <div key={question.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-purple-600">{idx + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="font-medium text-gray-900">
                        {question.label}
                      </label>
                      {question.isRequired && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Obligatoria
                        </span>
                      )}
                    </div>
                    {question.type === 'MULTI_OPTION' && (
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        {currentValue?.allowMultiple ? (
                          <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Puedes seleccionar varias opciones
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Selecciona una opción
                          </>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {renderQuestionInput(question, currentValue, (newValue) =>
                  handleValueChange(question.id, newValue)
                )}

                {errors[question.id] && (
                  <div className="mt-3 text-red-500 text-sm flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors[question.id]}
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loadingUpdateAnswer}
              className="flex-1 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition font-medium shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loadingUpdateAnswer ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Actualizando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Actualizar respuestas
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}