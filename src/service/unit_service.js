import axios from 'axios'

export async function createUnit(unit) {
  return axios.post('/units', {
    name: unit.name,
    image: {
      content: unit.image
    },
    location: {
      latitude: unit.location.lat,
      longitude: unit.location.lng
    }
  })
}

export async function getAllUnits() {
  return axios.get('/units')
}