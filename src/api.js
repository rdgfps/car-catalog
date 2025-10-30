const BASE = 'http://localhost:3001'

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE}${endpoint}`, options)
  if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`)
  return await res.json()  // Corrigido: sempre retorna o JSON resolvido
}

export async function getCarros() {
  return request('/carros')
}

export async function getCarro(id) {
  return request(`/carros/${id}`)
}

export async function addCarro(carro) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carro),
  }
  return request('/carros', options)
}

export async function updateCarro(id, dados) {
  const options = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  }
  return request(`/carros/${id}`, options)
}

export async function deleteCarro(id) {
  const options = { method: 'DELETE' }
  return request(`/carros/${id}`, options)
}
