import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import ChatWindow from './components/ChatWindow/ChatWindow';
import ValidationPassword from './components/Validation';

const reactAppContainer = document.getElementById('react-app');

if (reactAppContainer) {
  ReactDOM.render(<App />, reactAppContainer);
}

const chat = document.getElementById('react-chat');
const password = document.getElementById('react-validation');

if (chat) {
  ReactDOM.render(<ChatWindow />, chat);
}

if (password) {
  ReactDOM.render(<ValidationPassword />, password);
}
