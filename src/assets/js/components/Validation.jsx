import React, { Component } from 'react';

export default class Validation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      password2: '',
      currentError: '',
    };

    this.throwError = this.throwError.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  handleError(event) {
    event.preventDefault();
    const { name, value } = event.target;
    this.setState({ [name]: value });
    this.throwError(name, value);
  }

  throwError(name, value) {
    let pass = '';
    if (name === 'password') {
      pass = this.state.password2;
    } else {
      pass = this.state.password;
    }
    //Para que indique error solo si escribe en la confirmación de contraseña
    let pass2 = 0;
    if (name === 'password2') {
      pass2 = 1;
    }
    if (pass !== value && this.state.password2.length + pass2 > 0) {
      this.setState({ currentError: 'Las contraseñas no coinciden.' });
    } else {
      this.setState({ currentError: '' });
    }
  }

  render() {
    const { currentError } = this.state;
    return (
      <div>
        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input type="password" name="password" onChange={this.handleError} />
        </div>
        <div className="field">
          <p htmlFor="password2">Confirmar contraseña</p>
          <input type="password" name="password2" onChange={this.handleError} />
        </div>
        <br></br>
        <span className="errorMessage" style={{ color: 'red' }}>{currentError}</span>
        <br></br>
      </div>
    );
  }
}
