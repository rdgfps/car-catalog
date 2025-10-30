import React, { useState } from 'react'
import { addCarro } from '../../api'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import './AddCar.css'

export default function AddCar() {
  const [carro, setCarro] = useState({
    modelo: '',
    marca: '',
    ano: '',
    preco: '',
    fotos: '',
  })
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const fotosArray = carro.fotos
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)

      await addCarro({
        modelo: carro.modelo,
        marca: carro.marca,
        ano: Number(carro.ano),
        preco: Number(carro.preco),
        foto: fotosArray[0] || '',
        fotos: fotosArray,
        dataCadastro: new Date().toISOString(),
        avaliacoes: [],
        media: 0
      })

      await Swal.fire({
        title: 'Sucesso!',
        text: 'Carro adicionado com sucesso!',
        icon: 'success',
        confirmButtonText: 'OK',
        background: '#1c1c1c',
        color: '#fff',
        confirmButtonColor: '#e11d48',
      })

      navigate('/')
    } catch (err) {
      console.error(err)
      Swal.fire({
        title: 'Erro!',
        text: 'Não foi possível adicionar o carro.',
        icon: 'error',
        confirmButtonText: 'Fechar',
        background: '#1c1c1c',
        color: '#fff',
        confirmButtonColor: '#e11d48',
      })
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setCarro(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="add-car-container">
      <h2>Adicionar Carro</h2>

      <form className="add-car-form" onSubmit={handleSubmit}>
        <input
          name="modelo"
          placeholder="Modelo"
          value={carro.modelo}
          onChange={handleChange}
          required
        />

        <input
          name="marca"
          placeholder="Marca"
          value={carro.marca}
          onChange={handleChange}
          required
        />

        <div className="add-car-inline">
          <input
            name="ano"
            type="number"
            placeholder="Ano"
            value={carro.ano}
            onChange={handleChange}
            required
          />
          <input
            name="preco"
            type="number"
            placeholder="Preço"
            value={carro.preco}
            onChange={handleChange}
            required
          />
        </div>

        <textarea
          name="fotos"
          placeholder="URL da foto"
          value={carro.fotos}
          onChange={handleChange}
        />

        <button type="submit">Salvar</button>
      </form>
    </div>
  )
}
