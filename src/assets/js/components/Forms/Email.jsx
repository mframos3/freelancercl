import React, { Component } from 'react';
import { IoMdCloseCircleOutline } from 'react-icons/io';

const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

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
    this.props.serverData.email = value;
    this.throwError(name, value);
  }

  throwError(name, value) {
    this.currentError = emailRegex.test(value)
      ? ''
      : 'Email inválido';
    this.setState({ currentError: this.currentError });
  }

  render() {
    const { currentError } = this.state;
    let alert;
    if (currentError) {
      alert = <span visibility="hidden" className="errorMessage" style={{ color: 'red' }}>{currentError} <IoMdCloseCircleOutline /></span>;
    } else {
      alert = '';
    }
    return (
      <div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input type="text" name="email" value={this.props.serverData.email} onChange={this.handleError} />
        </div>
        {alert}
      </div>
    );
  }
}