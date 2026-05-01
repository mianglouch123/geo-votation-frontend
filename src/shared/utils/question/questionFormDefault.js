// shared/utils/question/questionFormDefault.js

// Plantilla base
const baseQuestion = {
  label: "pregunta sin título",
  code: "",
  type: "SHORTANSWER",
  isRequired: false,
  config: {
    value: "",
    minLength: 0,
    maxLength: 150
  }
};

// Función para generar código a partir del label
const generateCode = (label) => {
  return label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
};

// Función para crear una nueva pregunta con ID único
export const createNewQuestion = () => {
  const id = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 6);
  const label = "pregunta sin título";
  
  return {
    id,
    label,
    code: generateCode(label),
    type: "SHORTANSWER",
    isRequired: false,
    config: {
      value: "",
      minLength: 0,
      maxLength: 150
    }
  };
};

// Exportar también la plantilla si se necesita
export const questionInputDefault = createNewQuestion();