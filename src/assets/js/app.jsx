import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import ChatWindow from './components/Chat/ChatWindow/ChatWindow';
import ValidationPassword from './components/Forms/ConfirmPassword';
import Email from './components/Forms/Email';
import Name from './components/Forms/Name';
import Occupation from './components/Forms/Occupation';
import Description from './components/Forms/Description';
import EndsAt from './components/Forms/EndsAt';
import Price from './components/Forms/Price';

const reactAppContainer = document.getElementById('react-app');

if (reactAppContainer) {
  ReactDOM.render(<App />, reactAppContainer);
}

const chat = document.getElementById('react-chat');
const password = document.getElementById('react-confirmPassword');
const email = document.getElementById('react-email');
const name = document.getElementById('react-name');
const occupation = document.getElementById('react-occupation');
const description = document.getElementById('react-description');
const endsAt = document.getElementById('react-endsAt');
const price = document.getElementById('react-price');

if (chat) {
  ReactDOM.render(<ChatWindow />, chat);
}

if (password) {
  ReactDOM.render(<ValidationPassword />, password);
}

if (email) {
  ReactDOM.render(<Email />, email);
}

if (name) {
  ReactDOM.render(<Name serverData={name.dataset} />, name);
}

if (occupation) {
  ReactDOM.render(<Occupation />, occupation);
}

if (description) {
  ReactDOM.render(<Description />, description);
}

if (endsAt) {
  ReactDOM.render(<EndsAt />, endsAt);
}
if (price) {
  ReactDOM.render(<Price />, price);
}