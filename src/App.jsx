import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import AddCar from './pages/AddCar'
import CarDetails from './pages/CarDetails'

export default function App() {
  return (
    <div className="container">
      <header className="header">
        <h1>Catálogo de Carros</h1>
        <nav>
          <Link to="/" className="btn">Home</Link>
          <Link to="/add" className="btn btn-primary">Adicionar</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddCar />} />
        <Route path="/carro/:id" element={<CarDetails />} />
      </Routes>
    </div>
  )
}
