import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiSearch } from 'react-icons/fi';

import Posts from './Posts/Posts';
import Pagination from './Pagination/Pagination';
import './PostsList.scss';

const PostsList = ({ contentType }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(8);
  const [search, setSearch] = useState('');
  const [preSearch, setPreSearch] = useState([]);
  const [category, setCategory] = useState('');

  const DEV = false;
  const ENDPOINT = (DEV) ? 'http://localhost:3000' : 'https://freelancercl.herokuapp.com';

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const res = await fetch(`${ENDPOINT}/api/posts/${contentType}`);
      const data = await res.json();
      setPosts(data.data);
      setPreSearch([...data.data]);
      setCategory('Todo');
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filterPost = () => {
    let filteredPosts = [];
    if (category === 'Todo') {
      filteredPosts = preSearch.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    } else {
      filteredPosts = preSearch.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()) && i.category === category);
    }
    setPosts(filteredPosts);
  };

  useEffect(() => {
    filterPost();
  }, [search, category]);

  return (
    <div>
      <div className="wrap">
        <div className="search">
          <input type="text" className="searchTerm" placeholder="Busca" value={search} onChange={(event) => setSearch(event.target.value)} />
          <button type="submit" className="searchButton">
            <FiSearch />
          </button>
        </div>
      </div>
      <div className="wrap">
        <select className="select-css" name="category" id="category" placeholder="Categoría" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="Todo">Todas las categorías</option>
          <option value="General">General</option>
          <option value="Hogar">Hogar</option>
          <option value="Educación">Educación</option>
          <option value="Música">Música</option>
          <option value="Entretenimiento">Entretenimiento</option>
          <option value="Deportes">Deportes</option>
          <option value="Artes">Artes</option>
          <option value="Tele Trabajo">Tele Trabajo</option>
          <option value="Emprendimiento">Emprendimiento</option>
          <option value="Investigación">Investigación</option>
          <option value="Salud">Salud</option>
          <option value="Asesoría">Asesoría</option>
          <option value="Otros">Otros</option>

        </select>
      </div>

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
