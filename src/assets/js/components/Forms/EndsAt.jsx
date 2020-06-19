import React, { Component } from 'react';

const moment = require('moment'); // require

moment().format();

export default class Validation extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    if (!moment(moment()).isSameOrBefore(value)) {
      this.currentError = 'Debes ingresar una fecha posterior a la de hoy.';
    } else {
      this.currentError = '';
    }
    this.setState({ currentError: this.currentError });
  }

  render() {
    const { currentError } = this.state;
    return (
      <div>
        <div className="field">
          <label htmlFor="endsAt" > Fecha de Término</label>
          <input type="date" name="endsAt" onChange={this.handleError} />
        </div>
        <span className="errorMessage" style={{ color: 'red' }}>{currentError}</span>
      </div>
    );
  }
}
