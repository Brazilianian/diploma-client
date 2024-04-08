import axios from 'axios'

export async function createUnit(unit) {
  return axios.post('/units', {
    name: unit.name,
    description: unit.description,
    image: {
      content: unit.image
    },
    location: {
      latitude: unit.location.latitude,
      longitude: unit.location.longitude
    }
  })
}

export async function getAllUnits() {
  return axios.get('/units')
}

export function getUnitById(id) {
  return axios.get(`/units/${id}`)
}

export async function deleteUnitById(id) {
  return axios.delete(`/units/${id}`)
}