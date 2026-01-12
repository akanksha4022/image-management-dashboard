
import './App.css'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Signup from './components/Signup'
import { Navigate } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import RefreshHandler from './components/RefreshHandler'
import { useState } from 'react'
import Page from './components/Page'


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState();

  const PrivateRoute = ({element})=>{
    return isAuthenticated ? element :<Navigate to="/login"/>
  }
  return(
    <div className='App'>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={<Navigate to="/page" />} />
        <Route path='/page' element={<Page />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<PrivateRoute element={<Dashboard />} />} />
      </Routes>
    </div>
  )
}

export default App
