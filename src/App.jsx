import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import NewAccommodation from './components/NewAccommodation'
import NewBookings from './components/NewBookings'

function App() {

  return (
    <BrowserRouter>

      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/newaccommodation' element={<NewAccommodation/>}/>
        <Route path='/newbooking' element={<NewBookings/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App