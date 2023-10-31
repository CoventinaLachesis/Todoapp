import logo from './logo.svg';
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'

import SignIn from './SignIn'
import Main from './Main'
import Credit from './Credit'
import SignOut from './SignOut'
function App() {
   axios.defaults.baseURL = 'http://localhost:7000'
  return (
    <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/main" element={<Main/>}/>
        <Route path="/credit" element={<Credit/>}/>
        <Route path="/signout" element={<SignOut/>}/>
    </Routes>
)
}

export default App;