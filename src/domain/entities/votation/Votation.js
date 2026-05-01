// domain/entities/votation/Votation.js

export class Votation {
  constructor({
    _id = null,
    ownerId,
    subject,
    description,
    closesAt,
    createdAt = null,
    updatedAt = null,
    questions = []
  }) {
    this._id = _id;
    this.ownerId = ownerId;
    this.subject = subject;
    this.description = description;
    this.closesAt = closesAt ? new Date(closesAt) : null;
    this.createdAt = createdAt ? new Date(createdAt) : null;
    this.updatedAt = updatedAt ? new Date(updatedAt) : null;
    this.questions = questions;
  }

  // ─────────────────────────────────────────
  // FACTORY METHODS
  // ─────────────────────────────────────────

  // Para hidratar datos que vienen del servidor (GET)
  static fromAPI(data) {
    return new Votation({
      _id:       data._id,
      ownerId:   data.ownerId,
      subject:   data.subject,
      description: data.description,
      closesAt:  data.closes_at,   // ← mapea snake_case → camelCase
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      questions: data.questions ?? []
    });
  }

  // Para crear una votación nueva desde un formulario
  static fromForm(data) {
    const errors = Votation.#validateForm(data);
    if (errors.length > 0) throw new Error(errors.join(', '));

    return new Votation({
      ownerId:     data.ownerId,
      subject:     data.subject,
      description: data.description,
      closesAt:    data.closesAt,
      questions:   data.questions ?? []
    });
  }

  // Para editar una votación existente
  static fromEdit(data) {
    if (!data._id) throw new Error('Se requiere _id para editar una votación');

    const errors = Votation.#validateForm(data);
    if (errors.length > 0) throw new Error(errors.join(', '));

    return new Votation({
      _id:         data._id,
      ownerId:     data.ownerId,
      subject:     data.subject,
      description: data.description,
      closesAt:    data.closesAt,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
      questions:   data.questions ?? []
    });
  }

  // ─────────────────────────────────────────
  // VALIDACIONES (privado, solo para formularios)
  // ─────────────────────────────────────────

  static #validateForm({ subject, description, closesAt, questions = [] }) {
    const errors = [];

    if (!subject || subject.length < 3)
      errors.push('El título debe tener al menos 3 caracteres');

    if (!description || description.length < 1)
      errors.push('La descripción es requerida');

    const closeDate = new Date(closesAt);
    if (isNaN(closeDate.getTime()))
      errors.push('Fecha de cierre inválida');

    if (questions.length === 0)
      errors.push('La votación debe tener al menos una pregunta');

    return errors;
  }

  // ─────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────

  get isClosed() {
    return this.closesAt ? new Date() > this.closesAt : false;
  }

  get status() {
    return this.isClosed ? 'closed' : 'active';
  }

  // ─────────────────────────────────────────
  // PAYLOADS
  // ─────────────────────────────────────────

  toCreatePayload() {
    return {
      ownerId:     this.ownerId,
      subject:     this.subject,
      description: this.description,
      closes_at:   this.closesAt?.toISOString(),
      questions:   this.questions.map(q => ({
        label:      q.label,
        code:       q.code,
        type:       q.type,
        isRequired: q.isRequired,
        config:     q.config ?? {}
      }))
    };
  }

  toUpdatePayload() {
    return {
      votationId:  this._id,
      ownerId:     this.ownerId,
      subject:     this.subject,
      description: this.description,
      closes_at:   this.closesAt?.toISOString(),
      questions:   this.questions.map(q => ({
        questionId: q._id,
        label:      q.label,
        code:       q.code,
        type:       q.type,
        isRequired: q.isRequired,
        config:     q.config ?? {}
      }))
    };
  }

  toJSON() {
    return {
      _id:         this._id,
      ownerId:     this.ownerId,
      subject:     this.subject,
      description: this.description,
      closes_at:   this.closesAt?.toISOString(),
      created_at:  this.createdAt?.toISOString() ?? null,
      updated_at:  this.updatedAt?.toISOString() ?? null,
      status:      this.status,
      questions:   this.questions.map(q => ({
        _id:        q._id,
        label:      q.label,
        code:       q.code,
        type:       q.type,
        isRequired: q.isRequired,
        version:    q.version,
        config:     q.config ?? {}
      }))
    };
  }
}