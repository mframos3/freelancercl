import React, { Component } from 'react';

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
    this.props.serverData.occupation = value;
    this.throwError(name, value);
  }

  throwError(name, value) {
    if (!value) {
      this.currentError = 'Debes ingresar una ocupación';
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
          <label htmlFor="occupation" > Ocupación</label>
          <input type="text" name="occupation" value={this.props.serverData.occupation} onChange={this.handleError} />
        </div>
        <span className="errorMessage" style={{ color: 'red' }}>{currentError}</span>
      </div>
    );
  }
}