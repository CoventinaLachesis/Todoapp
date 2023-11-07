import { Routes, Route } from 'react-router-dom'
import axios from 'axios'

import SignIn from './SignIn'
import Main from './Main'
import Credit from './Credit'
import SignOut from './SignOut'
import SignUp from './SignUp'
import './index.css';
function App() {
   axios.defaults.baseURL = 'https://localhost:7164'
  return (
    <Routes>
        <Route path="/" element={<SignIn/>}/>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/main" element={<Main/>}/>
        <Route path="/credit" element={<Credit/>}/>
        <Route path="/signout" element={<SignOut/>}/>
        <Route path="/signup" element={<SignUp/>}/>
    </Routes>
)
}

export default App;
