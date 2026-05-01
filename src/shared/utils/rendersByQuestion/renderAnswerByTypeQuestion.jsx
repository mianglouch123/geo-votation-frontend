// shared/utils/rendersByQuestion/renderAnswerByTypeQuestion.jsx
import { QuestionTypeConfigSchemas } from "../../../zod/type-validators/question.schema.js";

export const renderAnswerByTypeQuestion = (question, answer) => {
  // Si no hay respuesta
  if (!answer) {
    return (
      <div className="text-gray-400 italic text-sm">
        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        No respondida
      </div>
    );
  }

  const parsedConfig = QuestionTypeConfigSchemas.safeParse({ type : question.type , config : question.config });

  if (!parsedConfig.success) {
    console.error("Error al parsear la configuración de la pregunta:", parsedConfig.error);
    return (
      <div className="text-red-500 text-sm">
        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Error al cargar la respuesta
      </div>
    );
  }

  const { type, config } = parsedConfig.data;
  const answerValue = answer.value;

  switch (type) {
    case "DATE": {
      return (
        <div className="flex items-center gap-2 text-gray-700">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{new Date(answerValue).toLocaleDateString("es-CL")}</span>
        </div>
      );
    }

    case "HOUR": {
      const hourValue = typeof answerValue === 'object' 
        ? answerValue.formatted || `${answerValue.hour}:${answerValue.minute}`
        : answerValue;
      return (
        <div className="flex items-center gap-2 text-gray-700">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{hourValue}</span>
        </div>
      );
    }

    case "SHORTANSWER": {
      return (
        <div className="flex items-start gap-2 text-gray-700">
          <svg className="w-4 h-4 text-purple-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="break-words">{answerValue || "Sin respuesta"}</span>
        </div>
      );
    }

    case "LARGEANSWER": {
      return (
        <div className="flex items-start gap-2 text-gray-700">
          <svg className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          <p className="break-words whitespace-pre-wrap">{answerValue || "Sin respuesta"}</p>
        </div>
      );
    }

    case "MULTI_OPTION": {
      if (Array.isArray(answerValue) && answerValue.length > 0) {
        return (
          <div className="flex flex-wrap gap-2">
            {answerValue.map((ans, idx) => (
              <span
                key={ans.id || idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {ans.label}
              </span>
            ))}
          </div>
        );
      }
      return (
        <div className="text-gray-400 italic text-sm">No hay opciones seleccionadas</div>
      );
    }

    default: {
      return (
        <div className="text-gray-700">
          {typeof answerValue === 'object' 
            ? JSON.stringify(answerValue) 
            : answerValue || "Sin respuesta"}
        </div>
      );
    }
  }
};