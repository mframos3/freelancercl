import React, { Component } from 'react';

function isNumber(n) { return /^-?[\d]+(?:e-?\d+)?$/.test(n); }


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
    if (!isNumber(value)) {
      this.currentError = 'Debes ingresar un valor numérico.';
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
          <label htmlFor="price" > Precio </label>
          <input type="text" name="price" onChange={this.handleError} />
        </div>
        <span className="errorMessage" style={{ color: 'red' }}>{currentError}</span>
      </div>
    );
  }
}
