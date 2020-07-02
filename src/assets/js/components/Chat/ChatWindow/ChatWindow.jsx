import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './ChatWindow.scss';

import ChatUsers from '../ChatUsers/ChatUsers';
import ChatInput from '../ChatInput/ChatInput';
import ChatConversation from '../ChatConversation/ChatConversation';
import ChatTitle from '../ChatTitle/ChatTitle';


let socket;

const ChatWindow = () => {
  const [myId, setMyId] = useState(0);
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState({});
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [preSearch, setPreSearch] = useState([]);
  const [isBusy, setBusy] = useState(true);


  const DEV = false;
  const ENDPOINT = (DEV) ? 'http://localhost:3000' : 'https://freelancercl.herokuapp.com';

  async function fetchData() {
    const res = await fetch(`${ENDPOINT}/api/chat/chats`);
    const data = await res.json();
    setUsers(data.data.users);
    setMyId(data.data.myuserid);
    setPreSearch([...data.data.users]);
    setBusy(false);
  }

  async function fetchDirectory() {
    const directory = (await fetch(`${ENDPOINT}/api/chat/directory`).then((res) => res.json())).data;
    const existingChats = (await fetch(`${ENDPOINT}/api/chat/chats`).then((res) => res.json())).data;
    const usersid = existingChats.users.map((existingChat) => existingChat.userid);
    const newChats = directory.filter((i) => (!usersid.includes(i.userid) && i.userid !== existingChats.myuserid));
    console.log(newChats);
    setUsers(newChats);
    setPreSearch([...newChats]);
  }

  const toggleList = async () => {
    if (modalIsOpen) {
      setModalIsOpen(false);
      fetchData();
    } else {
      setModalIsOpen(true);
      fetchDirectory();
    }
  };

  const connectToUser = async (userId) => {
    if (userData.userid) {
      const uid = userData.userid;
      socket.emit('leave', { myId, userId: uid });
    }
    const user = users.filter((obj) => obj.userid === userId)[0];
    setUserData({ name: user.username, userid: user.userid, img: user.img });
    socket.emit('join', { myId, userId });
    const res = await fetch(`${ENDPOINT}/api/chat/history/${userId}`);
    const data = await res.json();
    setMessages(data.data);
  };

  useEffect(() => {
    fetchData();
    socket = io(ENDPOINT);
    return () => {
      if (typeof socket !== 'undefined') {
        socket.emit('disconnect');
        socket.off();
      }
    };
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [message, ...messages]);
    });
  }, []);

  const filterUser = (event) => {
    setSearch(event);
    const filteredUsers = preSearch.filter((i) => i.username.includes(event));
    setUsers(filteredUsers);
  };

  const sendMessage = (event) => {
    event.preventDefault();
    const data = {
      sender: myId,
      receiver: userData.userid,
      content: message,
      createdAt: new Date(),
    };

    if (message && userData !== {}) {
      socket.emit('sendMessage',
        data, () => setMessage(''));
      fetch(`${ENDPOINT}/api/chat/save`, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ data }),
      }).then((response) => response.json()).then((responseData) => {
        console.log(responseData);
      });
    }
  };
  return ((!isBusy) ? (
    <div id="chat-container">
      <div id="search-container">
        <input type="text" placeholder="Busca" value={search} onChange={(event) => filterUser(event.target.value)} />
      </div>
      <ChatUsers
        users={users}
        userData={userData}
        callback={connectToUser}
        modalIsOpen={modalIsOpen}
      />
      <div id="new-message-container">
        <div className="left">
          <a onClick={() => toggleList()}>{(!modalIsOpen) ? ('+') : ('-')}</a>
        </div>
        <div className="right">
          {(!modalIsOpen) ? ('Nuevo Chat') : ('Volver atrás')}
        </div>
      </div>
      <ChatTitle userData={userData} users={users} />
      <ChatConversation messages={messages} userData={userData} myId={myId} />
      <ChatInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
    </div>
  ) : null);
};

export default ChatWindow;
