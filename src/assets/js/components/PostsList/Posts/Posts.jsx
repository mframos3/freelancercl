import React from 'react';
import PropTypes from 'prop-types';
import { BsFillStarFill } from 'react-icons/bs';
import './Posts.scss';

const Posts = ({ posts, loading, contentType }) => {
  if (loading) {
    return <h2>Loading...</h2>;
  }
  return (
    <div className="cards">
      {posts.map((post) => (
        <div className="card" key={post.id}>
          <img className="card__image" src={post.img} alt="OfferingPost" />
          {/* <div className="card__title">
            <a href={`/${contentType}/${post.id}`}>{post.name}</a>
          </div> */}
          <div className="card__content">
            <div className="card__link">
              <a href={`/${contentType}/${post.id}`}>{post.name}</a>
            </div>
            <p>
              {post.description}
            </p>
          </div>
          <div className="card__info">
            <div>
              <BsFillStarFill />
              4.7
            </div>
            <div>
              {post.category}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;

Posts.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  contentType: PropTypes.string,
};

Posts.defaultProps = {
  posts: [],
  loading: false,
  contentType: '',
};
