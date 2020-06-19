import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import ChatWindow from './components/Chat/ChatWindow/ChatWindow';
import PostsList from './components/PostsList/PostsList';
import ValidationPassword from './components/Forms/ConfirmPassword';
import Email from './components/Forms/Email';
import Name from './components/Forms/Name';
import Occupation from './components/Forms/Occupation';
import Description from './components/Forms/Description';
import EndsAt from './components/Forms/EndsAt';
import Price from './components/Forms/Price';
import Comment from './components/Forms/Comment';
import Content from './components/Forms/Content';
import Title from './components/Forms/Title';

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
const comment = document.getElementById('react-comment');
const content = document.getElementById('react-content');
const title = document.getElementById('react-title');

const posts = document.getElementById('react-posts');
const searchPosts = document.getElementById('react-posts-search');

if (chat) {
  ReactDOM.render(<ChatWindow />, chat);
}

if (password) {
  ReactDOM.render(<ValidationPassword />, password);
}

if (posts) {
  ReactDOM.render(<PostsList contentType="offeringPosts" />, posts);
}

if (searchPosts) {
  ReactDOM.render(<PostsList contentType="searchingPosts" />, searchPosts);
}

if (email) {
  ReactDOM.render(<Email serverData={email.dataset} />, email);
}

if (name) {
  ReactDOM.render(<Name serverData={name.dataset} />, name);
}

if (occupation) {
  ReactDOM.render(<Occupation serverData={occupation.dataset} />, occupation);
}

if (description) {
  ReactDOM.render(<Description serverData={description.dataset} />, description);
}

if (endsAt) {
  ReactDOM.render(<EndsAt />, endsAt);
}
if (price) {
  ReactDOM.render(<Price serverData={price.dataset} />, price);
}

if (comment) {
  ReactDOM.render(<Content serverData={comment.dataset} />, comment);
}

if (content) {
  ReactDOM.render(<Comment serverData={content.dataset} />, content);
}

if (title) {
  ReactDOM.render(<Title serverData={title.dataset} />, title);
}