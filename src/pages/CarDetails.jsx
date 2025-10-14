import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCarro, updateCarro } from '../api'
import { FaStar } from 'react-icons/fa'

export default function CarDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [carro, setCarro] = useState(null)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(null)

  useEffect(() => {
    getCarro(id).then(setCarro)
  }, [id])

  async function handleAvaliar() {
    if (rating < 1) return alert('Escolha uma nota.')
    const novasNotas = [...carro.avaliacoes, rating]
    await updateCarro(id, { avaliacoes: novasNotas })
    alert('Avaliação salva!')
    navigate('/')
  }

  if (!carro) return <p>Carregando...</p>

  const avaliacoes = Array.isArray(carro.avaliacoes) ? carro.avaliacoes : [];
  const media = avaliacoes.length
    ? (avaliacoes.reduce((a, b) => a + b, 0) / avaliacoes.length).toFixed(1)
    : 0;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
      <img
        src={carro.foto || ''}
        alt={carro.modelo || 'Carro'}
        style={{
          width: '100%',
          maxHeight: '320px',
          borderRadius: '12px',
          objectFit: 'cover',
          boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
        }}
      />
      <h2 style={{ color: '#ff3232', marginTop: '16px' }}>{carro.modelo || ''}</h2>
      <p>{carro.marca || ''} — {carro.ano || ''}</p>
      <p className="price">R$ {carro.preco || ''}</p>
      <p>Média: {media > 0 ? `${media}/5` : 'Sem avaliações'}</p>

      <div className="stars" style={{ justifyContent: 'center', marginTop: 10 }}>
        {[...Array(5)].map((_, i) => {
          const valor = i + 1
          return (
            <FaStar
              key={valor}
              className={valor <= (hover || rating) ? 'star active' : 'star'}
              onClick={() => setRating(valor)}
              onMouseEnter={() => setHover(valor)}
              onMouseLeave={() => setHover(null)}
            />
          )
        })}
      </div>

      <button className="btn" onClick={handleAvaliar}>
        Confirmar Avaliação
      </button>
    </div>
  )
}
