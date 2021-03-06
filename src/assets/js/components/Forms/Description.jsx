import React, { Component } from 'react';
import { IoMdCloseCircleOutline } from 'react-icons/io';

export default class Validation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentError: '',
    };
    this.throwError = this.throwError.bind(this);
    this.handleError = this.handleError.bind(this);
    this.serverData = this.props;
  }

  handleError(event) {
    event.preventDefault();
    const { name, value } = event.target;
    this.setState({ [name]: value });
    this.props.serverData.description = value;
    this.throwError(name, value);
  }

  throwError(name, value) {
    if (!value) {
      this.currentError = 'Debes ingresar una descripción.';
    } else {
      this.currentError = '';
    }
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
          <label htmlFor="description" > Descripción </label>
          <input type="text" name="description" value={this.props.serverData.description} onChange={this.handleError} />
        </div>
        {alert}
      </div>
    );
  }
}