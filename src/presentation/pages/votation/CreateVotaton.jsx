// presentation/pages/votation/CreateVotation.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseUserProfile } from '../../hooks/user/UseUserProfile.jsx';
import { UseCreateVotation } from '../../hooks/votation/UseCreateVotation.jsx';
import { createNewQuestion } from '../../../shared/utils/question/questionFormDefault.js';

export default function CreateVotation() {
  const navigate = useNavigate();
  const { user: dataUser, loading: loadingUserId } = UseUserProfile();
  const { execute: createVotation, loading: creating } = UseCreateVotation();
  
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    closes_at: '',
    questions: [createNewQuestion()]
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!loadingUserId && !dataUser) {
      navigate('/login');
    }
  }, [loadingUserId, dataUser, navigate]);

  if (loadingUserId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!dataUser) {
    return null;
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleQuestionChange = (questionId, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === questionId) {
          const updated = { ...q, [field]: value };
          if (field === 'label') {
            updated.code = value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
          }
          return updated;
        }
        return q;
      })
    }));
  };

  const handleConfigChange = (questionId, configValue) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, config: { ...q.config, ...configValue } } : q
      )
    }));
  };

  const handleTypeChange = (questionId, newType) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === questionId) {
          let defaultConfig = {};
          
          switch (newType) {
            case 'SHORTANSWER':
              defaultConfig = { value: "", minLength: 0, maxLength: 150 };
              break;
            case 'LARGEANSWER':
              defaultConfig = { value: "", minLength: 0, maxLength: 500 };
              break;
            case 'DATE':
              defaultConfig = { date: new Date().toISOString().split('T')[0] };
              break;
            case 'HOUR':
              defaultConfig = { hour: "12", min: "00" };
              break;
            case 'MULTI_OPTION':
              defaultConfig = { 
                options: [
                  { id: Date.now().toString(), label: "Opción 1", isChecked: false }
                ], 
                allowMultiple: false 
              };
              break;
            default:
              defaultConfig = {};
          }
          
          return { ...q, type: newType, config: defaultConfig };
        }
        return q;
      })
    }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, createNewQuestion()]
    }));
  };

  const removeQuestion = (questionId) => {
    if (formData.questions.length === 1) {
      alert('Debe haber al menos una pregunta');
      return;
    }
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject.trim()) newErrors.subject = 'El título es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.closes_at) newErrors.closes_at = 'La fecha de cierre es requerida';
    
    const invalidQuestions = formData.questions.filter(q => !q.label.trim());
    if (invalidQuestions.length > 0) {
      newErrors.questions = 'Todas las preguntas deben tener un enunciado';
    }
    
    for (const question of formData.questions) {
      if (question.type === 'MULTI_OPTION' && (!question.config.options || question.config.options.length === 0)) {
        newErrors.questions = 'Las preguntas de opción múltiple deben tener al menos una opción';
        break;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!dataUser) return;
    const localDate = new Date(formData.closes_at);
    const isoDate = localDate.toISOString();

    const payload = {
      ownerId: dataUser.id,
      subject: formData.subject,
      description: formData.description,
      closes_at: isoDate,
      questions: formData.questions.map(q => ({
        label: q.label,
        code: q.code || q.label.toLowerCase().replace(/\s/g, '_'),
        type: q.type,
        isRequired: q.isRequired,
        config: q.config || {}
      }))
    };

    try {
      const result = await createVotation(payload);
      setTimeout(() => {
        alert("Serás redirigido a la nueva votación creada.");
        navigate(`/dashboard/votations/${result.data.votationId}`);
      }, 500);
    } catch (err) {
      console.error('Error creating votation:', err);
      alert(err.message || 'Error al crear la votación');
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
                <h1 className="text-2xl md:text-3xl font-bold">Crear nueva votación</h1>
                <p className="text-purple-100 text-sm">Completa los datos para crear una nueva votación</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información general */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información general</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                    errors.subject ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Ej: Encuesta de satisfacción"
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                    errors.description ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Describe el propósito de la votación"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de cierre <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.closes_at}
                  onChange={(e) => handleChange('closes_at', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                    errors.closes_at ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.closes_at && <p className="text-red-500 text-sm mt-1">{errors.closes_at}</p>}
              </div>
            </div>
          </div>

          {/* Preguntas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Preguntas</h2>
              <span className="text-sm text-gray-400">{formData.questions.length} preguntas</span>
            </div>

            {errors.questions && <p className="text-red-500 text-sm mb-4">{errors.questions}</p>}

            <div className="space-y-4">
              {formData.questions.map((question, idx) => (
                <div key={question.id} className="border border-gray-200 rounded-xl p-5 hover:border-purple-200 transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-purple-600">{idx + 1}</span>
                      </div>
                      <h3 className="font-medium text-gray-900">Pregunta {idx + 1}</h3>
                    </div>
                    {formData.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-400 hover:text-red-600 transition text-sm flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      value={question.label}
                      onChange={(e) => handleQuestionChange(question.id, 'label', e.target.value)}
                      placeholder="Enunciado de la pregunta"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />

                    <div className="flex flex-wrap gap-4">
                      <select
                        value={question.type}
                        onChange={(e) => handleTypeChange(question.id, e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition bg-white appearance-none cursor-pointer pr-10"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 12px center',
                          backgroundSize: '16px'
                        }}
                      >
                        <option value="SHORTANSWER">Respuesta corta</option>
                        <option value="LARGEANSWER">Respuesta larga</option>
                        <option value="DATE">Fecha</option>
                        <option value="HOUR">Hora</option>
                        <option value="MULTI_OPTION">Opción múltiple</option>
                      </select>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={question.isRequired}
                          onChange={(e) => handleQuestionChange(question.id, 'isRequired', e.target.checked)}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">Obligatoria</span>
                      </label>
                    </div>

                    
                   {/* Configuraciones según tipo */}
                   {question.type === 'DATE' && (
                    <DateConfig
                     config={question.config}
                     onChange={(config) => handleConfigChange(question.id, config)}
                    />
                    )}

                  {question.type === 'HOUR' && (
                   <HourConfig
                    config={question.config}
                    onChange={(config) => handleConfigChange(question.id, config)}
                   />
                  )}

                    {question.type === 'MULTI_OPTION' && (
                      <MultiOptionConfig
                        config={question.config}
                        onChange={(config) => handleConfigChange(question.id, config)}
                      />
                    )}

                    {(question.type === 'SHORTANSWER' || question.type === 'LARGEANSWER') && (
                      <TextConfig
                        type={question.type}
                        config={question.config}
                        onChange={(config) => handleConfigChange(question.id, config)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Botón Agregar pregunta al FINAL de la lista */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={addQuestion}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition font-medium border border-purple-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar nueva pregunta
              </button>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/votations')}
              className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={creating}
              className="flex-1 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition font-medium shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {creating ? 'Creando...' : 'Crear votación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente para configuración de opciones múltiples
function MultiOptionConfig({ config, onChange }) {
  const [newOption, setNewOption] = useState('');

  const addOption = () => {
    if (!newOption.trim()) return;
    const options = [...(config.options || []), { id: Date.now().toString(), label: newOption, isChecked: false }];
    onChange({ ...config, options });
    setNewOption('');
  };

  const updateOption = (idx, label) => {
    const options = [...(config.options || [])];
    options[idx].label = label;
    onChange({ ...config, options });
  };

  const removeOption = (idx) => {
    const options = [...(config.options || [])];
    options.splice(idx, 1);
    onChange({ ...config, options });
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
      <label className="flex items-center gap-2 mb-3 cursor-pointer">
        <input
          type="checkbox"
          checked={config.allowMultiple || false}
          onChange={(e) => onChange({ ...config, allowMultiple: e.target.checked })}
          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
        />
        <span className="text-sm text-gray-700">Permitir selección múltiple</span>
      </label>

      <div className="space-y-2 mb-3">
        {(config.options || []).map((opt, idx) => (
          <div key={opt.id} className="flex gap-2">
            <input
              type="text"
              value={opt.label}
              onChange={(e) => updateOption(idx, e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder={`Opción ${idx + 1}`}
            />
            <button
              type="button"
              onClick={() => removeOption(idx)}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Nueva opción"
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="button"
          onClick={addOption}
          className="px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition font-medium"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}

// Componente para configuración de fecha
function DateConfig({ config, onChange }) {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
      <p className="text-xs text-gray-500 mb-3">Configuración de fecha</p>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Fecha por defecto (opcional)</label>
        <input
          type="date"
          value={config.date || ''}
          onChange={(e) => onChange({ ...config, date: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <p className="text-xs text-gray-400 mt-1">Deja en blanco para que el usuario la seleccione</p>
      </div>
    </div>
  );
}

// Componente para configuración de hora
function HourConfig({ config, onChange }) {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
      <p className="text-xs text-gray-500 mb-3">Configuración de hora</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Hora por defecto</label>
          <input
            type="number"
            min="0"
            max="23"
            value={config.hour || ''}
            onChange={(e) => onChange({ ...config, hour: e.target.value.padStart(2, '0') })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="HH (00-23)"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Minutos por defecto</label>
          <input
            type="number"
            min="0"
            max="59"
            value={config.min || ''}
            onChange={(e) => onChange({ ...config, min: e.target.value.padStart(2, '0') })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="MM (00-59)"
          />
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">Deja en blanco para valores por defecto</p>
    </div>
  );
}

// Componente para configuración de texto
function TextConfig({ type, config, onChange }) {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
      <p className="text-xs text-gray-500 mb-3">
        {type === 'SHORTANSWER' ? 'Configuración de respuesta corta' : 'Configuración de respuesta larga'}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Longitud mínima</label>
          <input
            type="number"
            min="0"
            value={config.minLength || 0}
            onChange={(e) => onChange({ ...config, minLength: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Longitud máxima</label>
          <input
            type="number"
            min="1"
            value={config.maxLength || ''}
            onChange={(e) => onChange({ ...config, maxLength: parseInt(e.target.value) || undefined })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Sin límite"
          />
        </div>
      </div>
    </div>
  );
}