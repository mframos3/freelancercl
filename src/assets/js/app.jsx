import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import ChatWindow from './components/Chat/ChatWindow/ChatWindow';
import ValidationPassword from './components/Forms/ConfirmPassword';
import Email from './components/Forms/Email';
import Followers from './components/Followers/Followers';

const reactAppContainer = document.getElementById('react-app');

if (reactAppContainer) {
  ReactDOM.render(<App />, reactAppContainer);
}

const chat = document.getElementById('react-chat');
const password = document.getElementById('react-confirmPassword');
const email = document.getElementById('react-email');
const followButton = document.getElementById('react-follower');

if (chat) {
  ReactDOM.render(<ChatWindow />, chat);
}

if (password) {
  ReactDOM.render(<ValidationPassword />, password);
}

if (email) {
  ReactDOM.render(<Email />, email);
}

if (followButton) {
  ReactDOM.render(<Followers />, followButton);
}
