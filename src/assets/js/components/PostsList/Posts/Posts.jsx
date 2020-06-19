import React from 'react';
import PropTypes from 'prop-types';

const Posts = ({ posts, loading, contentType }) => {
  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (contentType === 'offeringPosts') {
    return (
      <ul className="list-group mb-4">
        {posts.map((post) => (
          <li key={post.id} className="list-group-item">
            {post.title}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="list-group mb-4">
      {posts.map((post) => (
        <li key={post.id} className="list-group-item">
          {post.title}
        </li>
      ))}
    </ul>
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
