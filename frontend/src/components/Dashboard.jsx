import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDebounce } from '../hooks/useDebounce';
import '../mediaList.css';

const DELAY = 1000;

function Dashboard() {
  const { token, isLoading } = useContext(AuthContext);
  const [searchItem, setSearchItem] = useState('');
  const [filter, setFilter] = useState('');
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);


  const navigate = useNavigate();

  // Debounced search function
  const performSearch = useCallback(async (searchTerm, type, pageNum, limit) => {
    setLoading(true);
    try {
      const response = await axios.get('/media', {
        params: {
          type: type,
          search: searchTerm,
          page: pageNum,
          limit: limit,
        },
      });
      setMediaItems(response.data.result.rows);
      setTotalCount(response.data.result.count);
    } catch (error) {
      console.error('Error fetching media:', error);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('AccessToken');
        navigate('/login');
      }
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedPerformSearch = useDebounce(performSearch, DELAY);

  useEffect(() => {
    axios.get('/media', {
      params: {
        page: page,
        limit: limit,
      },
    })
      .then(response => response.data)
      .then(data => {
        setMediaItems(data.result.rows);
        setTotalCount(data.result.count);
      })
      .catch(err => {
        console.error('Error fetching media:', error);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('AccessToken');
          navigate('/login');
        }
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleFilterChange = (type) => () => {
    setFilter(type);
    setPage(1);
    debouncedPerformSearch(searchItem, type, page, limit);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchItem(value);
    setPage(1);
    debouncedPerformSearch(value, filter, page, limit);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    debouncedPerformSearch(searchItem, filter, newPage, limit);
  };

  const totalPages = Math.ceil(totalCount / limit);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container d-flex flex-column align-items-center vh-100">
      <div className="row w-100">
        <div className="col-md-2 col-lg-3"></div>
        <div className="col-md-8 col-lg-6">
          <div className="card p-4 shadow-sm">
            <h2 className="card-title mb-4 text-center">Filter Media</h2>
            <input
              type="text"
              value={searchItem}
              onChange={handleInputChange}
              placeholder="Type to search"
              className="form-control mb-4"
            />
            <div className="d-flex justify-content-center mb-4">
              <button
                className={`btn btn-outline-primary me-2 ${filter === '' ? 'active' : ''}`}
                onClick={handleFilterChange('')}
              >
                All
              </button>
              <button
                className={`btn btn-outline-primary me-2 ${filter === 'image' ? 'active' : ''}`}
                onClick={handleFilterChange('image')}
              >
                Images
              </button>
              <button
                className={`btn btn-outline-primary ${filter === 'video' ? 'active' : ''}`}
                onClick={handleFilterChange('video')}
              >
                Videos
              </button>
            </div>
            {loading && (
              <div className="alert alert-info mt-3" role="alert">
                Loading...
              </div>
            )}
            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                There was an error loading media
              </div>
            )}
            {!loading && !error && (
              <div className="container mt-4">
                <h2 className="text-center mb-4">Media Gallery</h2>
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Preview</th>
                      <th>URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mediaItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.mediaType.charAt(0).toUpperCase() + item.mediaType.slice(1)}</td>
                        <td>
                          {item.mediaType === 'image' ? (
                            <img
                              src={item.url}
                              alt={`Media ${index}`}
                              className="img-thumbnail"
                              style={{ maxWidth: '150px', maxHeight: '100px' }}
                            />
                          ) : item.mediaType === 'video' ? (
                            <video
                              src={item.url}
                              controls
                              style={{ maxWidth: '150px', maxHeight: '100px' }}
                            >
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <p>Unsupported media type</p>
                          )}
                        </td>
                        <td className="url-column">
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="url-link">
                            {item.url}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(page - 1)}>
                        Previous
                      </button>
                    </li>
                    {[...Array(totalPages).keys()].map(num => (
                      <li key={num + 1} className={`page-item ${page === num + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(num + 1)}>
                          {num + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(page + 1)}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
        <div className="col-md-2 col-lg-3"></div>
      </div>
    </div>
  );
}

export default Dashboard;
