import React from 'react';
import PropTypes from 'prop-types';
import './ChatInput.scss';

const ChatInput = ({ message, setMessage, sendMessage }) => (
  <form id="chat-form">
    <button type="submit" className="sendButton" onClick={(event) => sendMessage(event)}>Send</button>
    <input
      className="input"
      type="text"
      placeholder="escribe un mensaje"
      value={message}
      onChange={(event) => setMessage(event.target.value)}
      onKeyPress={(event) => (event.key === 'Enter' ? sendMessage(event) : null)}
    />
  </form>
);

ChatInput.propTypes = {
  message: PropTypes.string,
  setMessage: PropTypes.func,
  sendMessage: PropTypes.func,
};

ChatInput.defaultProps = {
  message: {},
  setMessage: () => null,
  sendMessage: () => null,
};

export default ChatInput;
