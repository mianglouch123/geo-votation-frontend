export class User {
  constructor({id = null, email, password, isVerified = false, createdAt = null, updatedAt = null , code = null}) {

    this.id = id;
    this.email = email;
    this.password = password;
    this.isVerified = isVerified;
    this.createdAt = createdAt ? new Date(createdAt) : null;
    this.updatedAt = updatedAt ? new Date(updatedAt) : null;
  }

  static fromApi(data) {
    return new User({
      _id: data._id,
      email: data.email,
      password: data.password,
      isVerified: data.isVerfied,        // ← respetamos el campo del modelo
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });
  }

  static fromLogin({ email, password }) {
    const errors = User.#validateLogin({ email, password });
	if(errors.length > 0) {
	  throw new Error(errors.join(', '));
	}
    return new User({ email, password });
  }

  static fromRegister({ email, password }) {
    const errors = User.#validateRegister({ email, password, confirmPassword: password })
     if(errors.length > 0) {
	  throw new Error(errors.join(', '));
	}
    if(User.#validateEmail(email) && User.validatePassword(password)) {
      return new User({ email, password , isVerified: false });
    }

  }
  static #validateEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
  }
  static validatePassword(password) {
	return typeof password === 'string' && password.length >= 6;
  }

  static #validateLogin({ email, password }) {
    const errors = [];

    if (!email || !email.includes('@'))
      errors.push('Email inválido');

    if (!password || password.length < 1)
      errors.push('La contraseña es requerida');

    return errors;
  }
  static #validateRegister({ email, password, confirmPassword }) {
    const errors = [];

    if (!email || !email.includes('@'))
      errors.push('Email inválido');

    if (!password || password.length < 6)
      errors.push('La contraseña debe tener al menos 6 caracteres');

    if (password !== confirmPassword)
      errors.push('Las contraseñas no coinciden');

    return errors;
  }

  toRegisterPayload() {
    return {
      email: this.email,
      password: this.password
    };
  }
   toLoginPayload() {
    return {
      email: this.email,
      password: this.password
    };
  }
    toJSON() {
    return {
      _id: this._id,
      email: this.email,
      isVerified: this.isVerified,
      created_at: this.createdAt?.toISOString() ?? null,
      updated_at: this.updatedAt?.toISOString() ?? null
    };
  }
}