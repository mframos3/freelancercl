import React from 'react';
import PropTypes from 'prop-types';
import './ChatMessage.scss';

const ChatMessage = ({ message, userData, myId }) => {
  const isSentByCurrentUser = message.sender_id === myId;

  return (
    isSentByCurrentUser
      ? (
        <div className="message-row you-message">
          <div className="message-content">
            <div className="message-text">{message.content}</div>
            <div className="message-time">Apr 16</div>
          </div>
        </div>
      )
      : (
        <div className="message-row other-message">
          <div className="message-content">
            <img src={userData.img} alt="default" />
            <div className="message-text">{message.content}</div>
            <div className="message-time">Apr 16</div>
          </div>
        </div>
      ));
};

ChatMessage.propTypes = {
  message: PropTypes.shape({
    content: PropTypes.string,
    sender_id: PropTypes.number,
  }),
  userData: PropTypes.shape({
    img: PropTypes.string,
  }),
  myId: PropTypes.number,
};

ChatMessage.defaultProps = {
  message: {},
  userData: {},
  myId: 0,
};


export default ChatMessage;
