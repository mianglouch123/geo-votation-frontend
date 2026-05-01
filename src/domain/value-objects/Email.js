// domain/value-objects/Email.js
export class Email {
  constructor(email) {
    if (!this.isValid(email)) {
      throw new Error('Invalid email address');
    }
    this.value = email.toLowerCase();
  }

  isValid(email) {
    const regex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return regex.test(email);
  }

  getValue() {
    return this.value;
  }

  equals(other) {
    return this.value === other.value;
  }
}