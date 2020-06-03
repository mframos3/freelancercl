import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Posts from './Posts/Posts';
import Pagination from './Pagination/Pagination';
import './PostsList.scss';

const PostsList = ({ contentType }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/api/${contentType}`);
      const data = await res.json();
      setPosts(data.data);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <h1 className="text-primary mb-3">Posts</h1>
      <Posts posts={currentPosts} loading={loading} contentType={contentType} />
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={posts.length}
        paginate={paginate}
      />
    </div>
  );
};

export default PostsList;

PostsList.propTypes = {
  contentType: PropTypes.string,
};

PostsList.defaultProps = {
  contentType: '',
};
