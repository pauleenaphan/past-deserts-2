import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { Nav } from './components/Nav'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Entries } from './pages/Entries'
import { Entry } from './pages/Entry'
import { Admin } from './pages/Admin'

const App = () => {
  return (
    <Router>
      <div className='min-h-screen bg-bgcolor'>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Entries" element={<Entries />} />
          <Route path="/Entry" element={<Entry />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
