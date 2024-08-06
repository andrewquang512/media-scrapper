import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ItemList from './ItemsList';
import Input from './Input';
import { useGetUsers } from '../hooks/useGetUsers';

function Dashboard() {
  const { token, isLoading } = useContext(AuthContext);
  if (isLoading) {
    return null;
  }

  if (!token) {
    console.log(token);
    return <Navigate to="/login" replace />;
  }

  const { users, loading, error } = useGetUsers();
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    // check if the users are not empty, if so then the
    // API call was successful and we can update our
    // filteredUsers state
    if (Object.keys(users).length > 0) {
      setFilteredUsers(users);
    }
  }, [users]); // this effect should run when the users state gets updated

  const filterItems = (searchTerm) => {
    // we previously set the input state here,
    // you can remove that now
    const filteredItems = users.filter((user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setFilteredUsers(filteredItems);
  };

  return (
    <div className="container d-flex flex-column align-items-center vh-100">
      <div className="row w-100">
        <div className="col-md-2 col-lg-3"></div>
        <div className="col-md-8 col-lg-6">
          <div className="card p-4 shadow-sm">
            <h2 className="card-title mb-4 text-center">Filter Users</h2>
            <Input onChangeCallback={filterItems} />
            {loading && (
              <div className="alert alert-info mt-3" role="alert">
                Loading...
              </div>
            )}
            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                There was an error loading the users
              </div>
            )}
            {!loading && !error && (
              <div className="mt-3">
                <ItemList items={filteredUsers} />
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
