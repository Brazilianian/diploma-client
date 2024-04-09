import axios from 'axios'

export async function getOrderById(id) {
  return axios.get("/orders/" + id);
}