import axios from 'axios'

export async function getOrderById(id) {
  return axios.get("/orders/" + id);
}

export async function createOrderForUnit(unitUuid, places, durationInfo, distanceInfo, items, name) {
  const points = []
  for (let i in places) {
    const place = places[i]
    points.push({
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    })
  }

  return axios.post("/orders", {
    unitId: unitUuid,
    orderDetailsCreateRequestDto: {
      points: points,
      dateTimeFrom: durationInfo.dateFrom,
      dateTimeTo: durationInfo.dateTo,
      distance: distanceInfo.distance,
      duration: distanceInfo.duration,
    },
    name: name,
    items: items,
  })
}