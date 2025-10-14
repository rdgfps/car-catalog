import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCarros, deleteCarro, updateCarro } from '../api'

export default function Home() {
  const [carros, setCarros] = useState([])
  const [busca, setBusca] = useState('')
  const [carroSelecionado, setCarroSelecionado] = useState(null)
  const [carroParaAvaliar, setCarroParaAvaliar] = useState(null)
  const [nota, setNota] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getCarros().then(setCarros)
  }, [])

  const handleDeleteConfirm = async () => {
    if (!carroSelecionado) return
    const sucesso = await deleteCarro(carroSelecionado.id)
    if (sucesso) {
      setCarros(carros.filter(c => c.id !== carroSelecionado.id))
    } else {
      alert('Erro ao excluir carro.')
    }
    setCarroSelecionado(null)
  }

  const handleAvaliarConfirm = async () => {
    if (!nota) return alert('Escolha uma nota.')
    const novasAvaliacoes = [...(carroParaAvaliar.avaliacoes || []), nota]
    await updateCarro(carroParaAvaliar.id, { avaliacoes: novasAvaliacoes })
    setCarros(carros.map(c =>
      c.id === carroParaAvaliar.id
        ? { ...c, avaliacoes: novasAvaliacoes }
        : c
    ))
    setCarroParaAvaliar(null)
    setNota(null)
    alert('Avaliação salva!')
  }

  const filtrados = carros.filter(c =>
    c.modelo.toLowerCase().includes(busca.toLowerCase()) ||
    c.marca.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar carro..."
        value={busca}
        onChange={e => setBusca(e.target.value)}
        style={{
          padding: '10px 15px',
          borderRadius: '10px',
          border: '1px solid #444',
          background: '#222',
          color: '#fff',
          marginBottom: '20px',
          width: '60%'
        }}
      />

      <div className="grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {filtrados.length === 0 && <p>Nenhum carro encontrado.</p>}
        {filtrados.map(c => {
          const media = c.avaliacoes?.length
            ? (c.avaliacoes.reduce((a, b) => a + b, 0) / c.avaliacoes.length).toFixed(1)
            : 0
          return (
            <div
              key={c.id}
              style={{
                background: '#181818',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                padding: '18px',
                textAlign: 'center',
                position: 'relative',
                cursor: 'pointer'
              }}
              onClick={e => {
                if (e.target.tagName === 'BUTTON') return
                navigate(`/carro/${c.id}`)
              }}
            >
              <img
                src={c.foto}
                alt={c.modelo}
                style={{
                  width: '100%',
                  maxHeight: '160px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}
              />
              <h3 style={{ color: '#ff3232', margin: '8px 0' }}>{c.modelo}</h3>
              <p>{c.marca} — {c.ano}</p>
              <p style={{ fontWeight: 'bold', color: '#fff' }}>R$ {c.preco}</p>
              <p style={{ color: '#ccc', fontSize: 14 }}>
                Média: {media > 0 ? `${media}/5` : 'Sem avaliações'}
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 10 }}>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    setCarroParaAvaliar(c)
                  }}
                  style={{
                    background: '#ff3232',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    cursor: 'pointer'
                  }}
                >
                  Avaliar
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    setCarroSelecionado(c)
                  }}
                  style={{
                    background: '#ff4d4d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    cursor: 'pointer'
                  }}
                >
                  Excluir
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal de exclusão */}
      {carroSelecionado && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#222',
            padding: '32px 24px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            textAlign: 'center',
            minWidth: '320px'
          }}>
            <h3 style={{ color: '#ff3232', marginBottom: 12 }}>
              Excluir "{carroSelecionado.modelo}"?
            </h3>
            <p style={{ color: '#ccc', marginBottom: 24 }}>
              Essa ação não pode ser desfeita.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button
                onClick={handleDeleteConfirm}
                style={{
                  background: '#ff3232',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 24px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Excluir
              </button>
              <button
                onClick={() => setCarroSelecionado(null)}
                style={{
                  background: '#444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 24px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de avaliação */}
      {carroParaAvaliar && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#222',
            padding: '32px 24px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            textAlign: 'center',
            minWidth: '320px'
          }}>
            <h3 style={{ color: '#ff3232', marginBottom: 12 }}>
              Avaliar "{carroParaAvaliar.modelo}"
            </h3>
            <p style={{ color: '#ccc', marginBottom: 24 }}>
              Escolha uma nota para este carro:
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
              {[1,2,3,4,5].map(n =>
                <button
                  key={n}
                  onClick={() => setNota(n)}
                  style={{
                    background: nota === n ? '#ff3232' : '#444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    fontWeight: 'bold',
                    fontSize: 18,
                    cursor: 'pointer'
                  }}
                >
                  {n}
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button
                onClick={handleAvaliarConfirm}
                style={{
                  background: '#ff3232',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 24px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Confirmar
              </button>
              <button
                onClick={() => {
                  setCarroParaAvaliar(null)
                  setNota(null)
                }}
                style={{
                  background: '#444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 24px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}