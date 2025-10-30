import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCarro, updateCarro } from '../../api'
import Swal from 'sweetalert2'
import './CarDetails.css'

export default function CarDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [carro, setCarro] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [nome, setNome] = useState('')
  const [comentario, setComentario] = useState('')
  const [nota, setNota] = useState(0)

  async function carregarCarro() {
    const data = await getCarro(id)
    setCarro(data)
  }

  useEffect(() => {
    carregarCarro()
  }, [id])

  const handleAvaliar = async () => {
    if (!nome.trim() || !comentario.trim() || nota === 0) {
      Swal.fire({
        title: 'Atenção!',
        text: 'Preencha todos os campos e selecione uma nota.',
        icon: 'warning',
        confirmButtonColor: '#e11d48',
        background: '#1c1c1c',
        color: '#fff'
      })
      return
    }

    const novaAvaliacao = { nome, comentario, nota }

    const novasAvaliacoes = [...(carro.avaliacoes || []), novaAvaliacao]

    const media =
      novasAvaliacoes.reduce((acc, a) => acc + a.nota, 0) /
      novasAvaliacoes.length

    const atualizado = {
      ...carro,
      avaliacoes: novasAvaliacoes,
      media: parseFloat(media.toFixed(1))
    }

    await updateCarro(id, atualizado)
    setCarro(atualizado)
    setShowModal(false)

    Swal.fire({
      title: 'Avaliação enviada!',
      text: 'Obrigado por avaliar este carro 🚗',
      icon: 'success',
      confirmButtonColor: '#e11d48',
      background: '#1c1c1c',
      color: '#fff'
    })
  }

  if (!carro) return <p>Carregando...</p>

  return (
    <div className="car-details-container">
      <img src={carro.foto} alt={carro.modelo} className="car-image" />
      <h2>{carro.modelo}</h2>
      <p>
        {carro.marca} — {carro.ano}
      </p>
      <p className="preco">R$ {carro.preco}</p>
      <p className="media">⭐ Média: {carro.media || 0}/5</p>

      <button className="btn-avaliar" onClick={() => setShowModal(true)}>
        Avaliar carro
      </button>

      <h3 className="titulo-avaliacoes">Avaliações dos usuários</h3>
      <div className="avaliacoes">
        {carro.avaliacoes && carro.avaliacoes.length > 0 ? (
          carro.avaliacoes.map((a, i) => (
            <div key={i} className="avaliacao">
              <strong>{a.nome}</strong> — Nota: {a.nota}/5
              <p>{a.comentario}</p>
            </div>
          ))
        ) : (
          <p>Nenhuma avaliação ainda.</p>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Avaliar {carro.modelo}</h2>
            <input
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <textarea
              placeholder="Seu comentário..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={n <= nota ? 'active' : ''}
                  onClick={() => setNota(n)}
                >
                  ★
                </span>
              ))}
            </div>

            <div className="review-buttons">
              <button onClick={handleAvaliar}>Enviar</button>
              <button className="cancel" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
