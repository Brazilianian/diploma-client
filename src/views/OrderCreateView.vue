<script>
import { getUnitById } from '@/service/unit_service.js'
import { createOrderForUnit } from '@/service/order_service.js'

export default {
  data() {
    return {
      map: null,
      markers: [],
      autocomplete: null,

      directionInfo: {
        duration: null,
        distance: null
      },
      durationInfo: {
        dateFrom: null,
        dateTo: null
      },

      items: [],
      unit: null,
      places: [],

      name: null,

      newItem: {
        name: null,
        description: null
      }
    }
  },

  methods: {
    getUnit() {
      const unitUuid = this.$route.query.unitId
      if (!unitUuid) {
        return
      }

      getUnitById(unitUuid)
        .then(res => {
          this.unit = res.data

          this.initMap()
          this.initAutocomplete()
        })
        .catch(err => {
          this.$notify({
            type: 'warn',
            title: 'Отримання підрозділу',
            text: `Помилка отримання підрозділу ${unitUuid}\n${err.response?.data.message}`
          })
        })
    },

    initMap() {
      const map = document.getElementById('map')

      this.map = new google.maps.Map(map, {
        center: { lat: this.unit.location.latitude, lng: this.unit.location.longitude },
        zoom: 12,
        streetViewControl: false
      })

      // Марке частини
      new google.maps.Marker({
        position: { lat: this.unit.location.latitude, lng: this.unit.location.longitude },
        map: this.map,
        label: this.unit.name
      })

      window.directionsService = new google.maps.DirectionsService()
      window.directionsRenderer = new google.maps.DirectionsRenderer()
    },

    initAutocomplete() {
      const autocomplete = document.getElementById('autocomplete')

      this.autocomplete = new google.maps.places.Autocomplete(autocomplete, {
        type: ['establishment']
      })
    },

    addPlace() {
      const place = this.autocomplete.getPlace()

      if (!place) {
        return this.$notify({
          type: 'warn',
          title: 'Додавання точок',
          text: 'Вкажіть місце'
        })
      }

      this.places.push(place)
    },

    deletePlace(index) {
      this.places.splice(index, 1)
    },

    renderRoute() {
      this.deleteAllMarkers()
      this.deleteAllDirections()
      this.generateRoute()
    },

    deleteAllMarkers() {
      window.markers.forEach((marker) => {
        marker.setMap(null)
      })
      window.markers = []
    },

    deleteAllDirections() {
      window.directionsRenderer.setMap(null)
    },

    generateRoute() {
      if (this.places.length > 1) {
        const waypoints = []

        for (let i = 0; i < this.places.length - 1; i++) {
          const place = this.places[i]
          waypoints.push({
            location: place.geometry.location
          })
        }

        const request = {
          origin: this.places[0].geometry.location,
          destination: this.places[this.places.length - 1].geometry.location,
          travelMode: 'DRIVING',
          waypoints: waypoints
        }

        window.directionsRenderer.setMap(this.map)

        window.directionsService.route(request, (result) => {
          window.directionsRenderer.setDirections(result)

          this.calculateDirectionInfo(result)
        })
      } else {
        let counter = 1

        for (const place of this.places) {
          const marker = new google.maps.Marker({
            position: place.geometry.location,
            map: this.map,
            label: counter.toString()
          })

          window.markers.push(marker)

          counter++
        }
      }
    },

    calculateDirectionInfo(data) {
      let distance = 0
      let duration = 0

      for (const route of data.routes) {
        for (const leg of route.legs) {
          distance += leg.distance.value
          duration += leg.duration.value
        }
      }

      this.directionInfo.duration = duration
      this.directionInfo.distance = distance
    },

    addItem() {
      if (!this.newItem?.name) {
        return this.$notify({
          type: 'warn',
          title: 'Додавання грузу',
          text: 'Вкажіть назву грузу'
        })
      }

      this.items.push(this.newItem)
      this.newItem = {
        name: null,
        description: null
      }
    },

    deleteItem(index) {
      this.items.splice(index - 1, 1)
    },

    createOrder() {
      createOrderForUnit(this.unit.uuid, this.places, this.durationInfo, this.directionInfo, this.items, this.name)
        .then(() => {
          this.$notify({
            type: 'success',
            title: 'Створення автомобільного перевезення',
            text: 'Автомобільне перевезення було успішно додано'
          })
        })
        .catch(err => {

          this.$notify({
            type: 'error',
            title: 'Створення автомобільного перевезення',
            text: `Помилка створення автомобільне перевезення\n${err.response?.data.message}`
          })
        })
    }
  },

  computed: {
    prettifyDistance() {
      const kilometers = Math.floor(this.directionInfo.distance / 1000)
      const meters = this.directionInfo.distance % 1000
      return (kilometers ? kilometers + ' км ' : '') + meters + ' м'
    },

    prettifyDuration() {
      const hours = Math.floor(this.directionInfo.duration / 3600)
      const minutes = Math.floor((this.directionInfo.duration % 3600) / 60)
      const remainingSeconds = this.directionInfo.duration % 60

      let result = ''
      if (hours > 0) {
        result += hours + ' год. '
      }
      if (minutes > 0) {
        result += minutes + ' хв. '
      }
      result += remainingSeconds + ' с.'

      return result.trim()
    },

    orderValid() {
      return !(this.places.length >= 2
        && this.items.length > 0
        && this.durationInfo.dateTo
        && this.durationInfo.dateFrom
        && this.name)
    }
  },

  mounted() {
    window.markers = []

    this.getUnit()
  },

  watch: {
    places: {
      handler() {
        this.renderRoute()
      },
      deep: true
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="row text-center vh-100">
      <h1>Створення замолвення автомолбільного перевезення військової частини {{ this.unit?.name }}</h1>

      <h5>Вкажіть маршрут перевезення</h5>
      <div class="col-4">

        <div v-if="directionInfo?.duration && directionInfo?.distance">
          <h3 class="fst-italic fw-bold">Час: {{ directionInfo?.duration && prettifyDuration }}</h3>
          <h3 class="fst-italic fw-bold">Довжина: {{ directionInfo?.distance && prettifyDistance }}</h3>
        </div>

        <div v-for="(place, index) in this.places" :key="index"
             class="mt-3">

          <div class="input-group mb-3">
            <img class="input-group-text" id="basic-addon1" src="/img/marker.svg" alt="Маркер">
            <input type="text" class="form-control" v-model="place.formatted_address"
                   aria-describedby="basic-addon1" disabled>
            <button @click="deletePlace(index)" class="btn btn-danger"><img src="/img/delete.svg" alt="delete">
            </button>
          </div>

        </div>

        <hr>

        <input id="autocomplete" type="text" class="form-control" placeholder="Київ">
        <button class="btn btn-primary mt-3" @click="addPlace()">Добавити точку</button>
        <div v-if="this.places.length < 2" class="text-danger text-start">
          Вкажіть точки на карті
        </div>
      </div>
      <div class="col-8">
        <div id="map" class="google-map"></div>
      </div>
    </div>

    <hr>

    <div class="row text-center">
      <div class="col-12">
        <h3>Вкажіть груз, що буде перевозитись</h3>
        <table class="table table-striped table-dark">
          <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Назва</th>
            <th scope="col">Дистанція</th>
            <th scope="col"></th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="(item, index) in this.items"
            :key="index"
          >
            <th>{{ ++index }}</th>
            <th>{{ item.name }}</th>
            <th>{{ item.description }}</th>
            <th>
              <button class="btn btn-danger" @click="deleteItem(index)"><img src="/img/delete.svg" alt="delete">
              </button>
            </th>
          </tr>
          <tr>
            <th>
              <input type="text" class="form-control" placeholder="Назва" v-model="newItem.name">
            </th>
            <th>
              <textarea class="form-control" placeholder="Опис" rows="5" v-model="newItem.description"></textarea>
            </th>
            <th>
              <button class="btn btn-primary" @click="addItem">Добавити груз</button>
            </th>
          </tr>
          </tbody>
        </table>
        <div class="text-danger text-start" v-if="this.items.length < 1">
          Вкажіть мінімум один груз, що буде перевозитись
        </div>
      </div>
    </div>

    <hr>

    <div class="row text-center">
      <div class="col-12 mt-5 mb-3">
        <h3>Вкажіть назву замовлення</h3>
        <input type="text" class="form-control" placeholder="Автомобільне перевезення особового складу до ВІТІ"
               v-model="name">
        <div v-if="!name" class="text-danger text-start">
          Вкажіть назву замовлення
        </div>
      </div>
    </div>

    <hr>

    <div class="row text-center">
      <div class="col-12">
        <h3>Завершення замовлення</h3>
      </div>
      <div class="col-6">
        <h5>Дата відправки</h5>
        <input type="date" class="form-control" v-model="durationInfo.dateFrom" :max="durationInfo.dateTo">
        <div class="text-start text-danger" v-if="!this.durationInfo.dateFrom">
          Вкажіть дату
        </div>
      </div>
      <div class="col-6">
        <h5>Дата прибутяя</h5>
        <input type="date" class="form-control" v-model="durationInfo.dateTo" :min="durationInfo.dateFrom">
        <div class="text-start text-danger" v-if="!this.durationInfo.dateTo">
          Вкажіть дату
        </div>
      </div>
      <div class="col-12">
        <button class="btn btn-primary form-control mt-5 mb-3" data-bs-toggle="modal"
                data-bs-target="#orderDetailsModal"
                :disabled="orderValid"
        >
          Добавити автомобільне перевезення
        </button>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade modal-xl" id="orderDetailsModal" data-bs-backdrop="static" data-bs-keyboard="false"
       tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header text-black">
          <h5 class="modal-title" id="staticBackdropLabel">Деталі замовлення</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-black">
          <h3>Маршрут:</h3>
          <div class="d-flex">
            <div
              v-for="(place, index) in this.places"
              :key="index"
            >
              <div class="d-flex align-items-center">
                <div class="border p-2 m-1 rounded">{{ place.formatted_address }}</div>
                <img v-if="index !== this.places.length - 1" src="/img/arrow.svg" alt="arrow">
              </div>
            </div>
          </div>

          <div v-if="directionInfo?.duration && directionInfo?.distance">
            <h3 class="fst-italic fw-bold">Час: {{ directionInfo?.duration && prettifyDuration }}</h3>
            <h3 class="fst-italic fw-bold">Довжина: {{ directionInfo?.distance && prettifyDistance }}</h3>
          </div>

          <hr>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Ні</button>
          <button type="button" class="btn btn-primary" @click="createOrder">Так</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.google-map {
  width: 100%;
  height: 75vh;
}
</style>