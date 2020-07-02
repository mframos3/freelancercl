import React, { useState, useEffect } from 'react';
import './Followers.scss';

const Followers = () => {
  const [isFollowed, setIsFollowed] = useState(false);
  const [following, setFollowing] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [occupation, setOccupation] = useState('');
  const [rating, setRating] = useState('Sin Valoración');
  const [userId, setUserId] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(false);

  const DEV = false;
  const ENDPOINT = (DEV) ? 'http://localhost:3000' : 'https://freelancercl.herokuapp.com';

  useEffect(() => {
    const fetchFollow = async () => {
      const res = await fetch(`${ENDPOINT}/api/follow/${window.location.href.split('/').reverse()[0]}`);
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
      const res = await fetch(`${ENDPOINT}/api/follow/${window.location.href.split('/').reverse()[0]}`);
      const data = await res.json();
      const idUser = data.data[1].id.toString();
      const res2 = await fetch(`${ENDPOINT}/api/follow/${idUser}/follow`);
      const data2 = await res2.json();
      if (data2.data[0]) {
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
    </div>
  );
};

export default Followers;
