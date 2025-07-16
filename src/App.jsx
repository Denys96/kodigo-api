import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import NewAccommodation from './components/NewAccommodation'
import NewBookings from './components/NewBookings'
import EditAccommodation from './components/EditAcomodation'


function App() {

  return (
    <BrowserRouter>

      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/newaccommodation' element={<NewAccommodation/>}/>
        <Route path='/newbooking' element={<NewBookings/>}/>
        <Route path="/dashboard/reservations" element={<Dashboard activeView="reservations" />} />
        <Route path="/editaccommodation/:id" element={<EditAccommodation />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App