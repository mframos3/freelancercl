import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import ChatWindow from './components/Chat/ChatWindow/ChatWindow';
import ValidationPassword from './components/Validation';
import PostsList from './components/PostsList/PostsList';

const reactAppContainer = document.getElementById('react-app');

if (reactAppContainer) {
  ReactDOM.render(<App />, reactAppContainer);
}

const chat = document.getElementById('react-chat');
const password = document.getElementById('react-validation');

const posts = document.getElementById('react-posts');

if (chat) {
  ReactDOM.render(<ChatWindow />, chat);
}

if (password) {
  ReactDOM.render(<ValidationPassword />, password);
}

if (posts) {
  ReactDOM.render(<PostsList contentType="offeringPosts" />, posts);
}
