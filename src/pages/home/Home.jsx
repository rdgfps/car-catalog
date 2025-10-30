import React, { useEffect, useState } from 'react'
import { getCarros, deleteCarro } from '../../api'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import './Home.css'

export default function Home() {
  const [carros, setCarros] = useState([])
  const [busca, setBusca] = useState('')

  async function carregarCarros() {
    const data = await getCarros()
    setCarros(data)
  }

  useEffect(() => {
    carregarCarros()
  }, [])

  async function handleDelete(id) {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'O carro será excluído permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#555',
      confirmButtonText: 'Sim, excluir!',
      background: '#1c1c1c',
      color: '#fff',
    })

    if (result.isConfirmed) {
      await deleteCarro(id)
      Swal.fire({
        title: 'Excluído!',
        text: 'O carro foi removido com sucesso.',
        icon: 'success',
        confirmButtonColor: '#e11d48',
        background: '#1c1c1c',
        color: '#fff',
      })
      carregarCarros()
    }
  }

const carrosFiltrados = carros.filter((c) => {
  const termo = busca.toLowerCase()
  return (
    c.modelo.toLowerCase().includes(termo) ||
    c.marca.toLowerCase().includes(termo)
  )
})

  return (
    <div className="home-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar carro..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="cards-container">
        {carrosFiltrados.map((carro) => (
          <div key={carro.id} className="car-card">
            <img src={carro.foto} alt={carro.modelo} />
            <h3>{carro.modelo}</h3>
            <p>{carro.marca} — {carro.ano}</p>
            <p className="preco">R$ {carro.preco}</p>
            <p className="media">⭐ Média: {carro.media ? carro.media.toFixed(1) : '0.0'}/5</p>

            <div className="buttons">
              <Link to={`/carro/${carro.id}`} className="btn-detalhes">
                Detalhes
              </Link>
              <button
                className="btn-excluir"
                onClick={() => handleDelete(carro.id)}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}