import React, { useState } from 'react'
import { addCarro } from '../api'
import { useNavigate } from 'react-router-dom'

export default function AddCar() {
  const [carro, setCarro] = useState({ modelo: '', marca: '', ano: '', preco: '', foto: '' })
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    await addCarro({ ...carro, dataCadastro: new Date().toISOString(), avaliacoes: [] })
    navigate('/')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Adicionar Carro</h2>
      {['modelo','marca','ano','preco','foto'].map(campo => (
        <input
          key={campo}
          type={campo === 'ano' || campo === 'preco' ? 'number' : 'text'}
          placeholder={campo}
          value={carro[campo]}
          onChange={e => setCarro({ ...carro, [campo]: e.target.value })}
          required
        />
      ))}
      <button className="btn">Salvar</button>
    </form>
  )
}
