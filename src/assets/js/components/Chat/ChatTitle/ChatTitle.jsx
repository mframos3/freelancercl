import React from 'react';
import PropTypes from 'prop-types';
import './ChatTitle.scss';

const ChatTitle = ({ userData }) => (
  <div className="chat-title">
    <span>{userData.name}</span>
    <img src={userData.img} alt="" />
  </div>
);


ChatTitle.propTypes = {
  userData: PropTypes.shape({
    name: PropTypes.string,
    userid: PropTypes.number,
    img: PropTypes.string,
  }),
};

ChatTitle.defaultProps = {
  userData: {},
};


export default ChatTitle;
