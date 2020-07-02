import React from 'react';
import PropTypes, { object } from 'prop-types';
import './ChatConversation.scss';
import Message from '../ChatMessage/ChatMessage';

const ChatConversation = ({ messages, userData, myId }) => (
  <div id="chat-message-list">
    {messages.map((message, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <div key={i}>
        <Message message={message} userData={userData} myId={myId} />
      </div>
    ))}
  </div>
);

ChatConversation.propTypes = {
  messages: PropTypes.arrayOf(object),
  userData: PropTypes.shape(),
  myId: PropTypes.number,
};

ChatConversation.defaultProps = {
  messages: [],
  userData: {},
  myId: 0,
};

export default ChatConversation;
