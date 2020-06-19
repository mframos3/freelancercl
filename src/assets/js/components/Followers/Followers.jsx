import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import './Followers.scss';

const Followers = () => {
  const [isFollowed, setIsFollowed] = useState(false);
  const [following, setFollowing] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [occupation, setOccupation] = useState('');
  const [rating, setRating] = useState('Sin Valoración');
  const [userId, setUserId] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(false);

  useEffect(() => {
    console.log('UseEffect');
    const fetchFollow = async () => {
      const res = await fetch(`http://localhost:3000/api/follow/${window.location.href.split('/').reverse()[0]}`);
      const data = await res.json();
      if (data.data[0]) {
        setIsFollowed(true);
      } else {
        setIsFollowed(false);
      }
      setFollowers(data.data[1].cFollowers);
      setFollowing(data.data[1].cFollowed);
      setOccupation(data.data[1].occupation);
      setRating(data.data[1].rating);
      setUserId(data.data[1].id);
      setCurrentUserId(data.data[2].id);
    };
    fetchFollow();
  }, []);

  const follow = () => {
    const fetchBackServer = async () => {
      console.log(typeof (window.location.href.split('/').reverse()[0]));
      const res = await fetch(`http://localhost:3000/api/follow/${window.location.href.split('/').reverse()[0]}`);
      const data = await res.json();
      // console.log('Holaa');
      // console.log(data);
      // console.log(data.data);
      const idUser = data.data[1].id.toString();
      // const idUser = data.data[1].id;
      console.log(typeof (idUser));
      console.log(idUser);
      const res2 = await fetch(`http://localhost:3000/api/follow/${idUser}/follow`);
      console.log('pase el fetch');
      const data2 = await res2.json();
      console.log(data2);
      console.log(data2.data);
      if (data2.data[0]) {
        // console.log('La sigo y dejaré de seguirla');
        setIsFollowed(true);
        setFollowers(data2.data[1].cFollowers + 1);
      } else {
        setIsFollowed(false);
        setFollowers(data2.data[1].cFollowers - 1);
      }
      setFollowing(data.data[1].cFollowed);
      setOccupation(data.data[1].occupation);
      setRating(data.data[1].rating);
      setUserId(data.data[1].id);
      setCurrentUserId(data.data[2].id);
    };
    fetchBackServer();
  };

  return (
    <div>
      <div className="skill-box">
        <ul>
          <li><strong>Ocupación:</strong></li>
          <li>{(occupation)}</li>
          <li><strong>Valoración:</strong></li>
          <li>{(rating)}</li>
          {/* <% if (user.rating !== 0) {%>
            <% for(let i=0; i < Math.round(user.rating); i++) {%>
              <li><img class="star" src="https://img.icons8.com/color/2x/star.png"></img></li>
            <% } %>
          <% } else {%>
            <li>Sin Valoraciones</li>
          <% } %>  */}
          <li><strong>Seguidores:</strong></li>
          <li>{(followers)}</li>
          <li><strong>Seguidos:</strong></li>
          <li>{(following)}</li>
          <li>
            { userId !== currentUserId ? (
              <button type="button" id="followButton" onClick={() => follow()}>
                {(isFollowed) ? 'Dejar de Seguir' : 'Seguir' }
              </button>
            ) : (<li />)}
          </li>
        </ul>
      </div>
      {/* <p><strong>Seguidores:</strong></p>
      <p>{(followers)}</p>
      <p><strong>Seguidos:</strong></p>
      <p><%= user.cFollowed =%></p> */}
    </div>
  );
};

export default Followers;

// Followers.propTypes = {
//   contentType: PropTypes.string,
// };

// Followers.defaultProps = {
//   contentType: '',
// };