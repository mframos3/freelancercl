import React from 'react';
import './ChatUsers.scss';
import PropTypes from 'prop-types';

const ChatUsers = ({ users, userData, callback }) => {
  // const isToday = (someDate) => {
  //   const today = new Date();
  //   return someDate.getDate() === today.getDate()
  //    && someDate.getMonth() === today.getMonth()
  //    && someDate.getFullYear() === today.getFullYear();
  // };
  return (
    <div id="conversation-list">
      {users.map((item) => (
        <div className="conversation" onClick={() => ((userData.userid !== item.userid) ? (callback(item.userid)) : null)} role="button" tabIndex={0} onKeyPress={() => {}} key={item.userid}>
          <img src={item.img} alt="smth" />
          <div className="title-text">
            {item.username}
          </div>
          {/* <div className="created-date">
           {(isToday(item.))}
          </div> */}
          <div className="conversation-message">
            Placeholder
          </div>
        </div>
      ))}

    </div>
  );
};

ChatUsers.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  callback: PropTypes.func,
  userData: PropTypes.shape({
    userid: PropTypes.number,
  }),
};

ChatUsers.defaultProps = {
  users: [{}],
  callback: () => null,
  userData: {},
};
export default ChatUsers;
