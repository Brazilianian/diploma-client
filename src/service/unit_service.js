import axios from 'axios'

export async function createUnit(unit) {
  return await axios.post('/units', {
    name: unit.name
  })
}