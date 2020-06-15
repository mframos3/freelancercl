import React from 'react';
import PropTypes from 'prop-types';
import './Posts.scss';

const Posts = ({ posts, loading, contentType }) => {
  if (loading) {
    return <h2>Loading...</h2>;
  }
  return (
    <div className="offeringPost-list">
      {posts.map((post) => (
        <div className="offeringPost" key={post.id}>
          <img className="offeringPost__image" src={post.img} alt="OfferingPost" />
          <div className="offeringPost__name">
            <a href={`/offeringPosts/${post.id}`}>{post.name}</a>
          </div>
          <div className="offeringPost__content">
            {post.description}
          </div>
          <div className="offeringPost__extras">
            {post.category}
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
