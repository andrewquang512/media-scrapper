// src/App.jsx
import { useState, useEffect } from 'react'
import ItemList from './components/ItemsList'
import Input from './components/Input'

import { useGetUsers } from './hooks/useGetUsers'

function App() {
  const {users, loading, error} = useGetUsers()
  const [filteredUsers, setFilteredUsers] = useState([])

  useEffect(() => {
    // check if the users are not empty, if so then the 
    // API call was successful and we can update our 
    // filteredUsers state
    if (Object.keys(users).length > 0) {
      setFilteredUsers(users)
    }
  }, [users]) // this effect should run when the users state gets updated

  const filterItems = (searchTerm) => { 
    // we previously set the input state here, 
    // you can remove that now
    const filteredItems = users.filter((user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredUsers(filteredItems);
  }

  return (
    <>
      <Input onChangeCallback={filterItems} />
      {loading && <p>Loading...</p>}
      {error && <p>There was an error loading the users</p>}
      {!loading && !error && <ItemList items={filteredUsers} />}
    </>
  )
}

export default App