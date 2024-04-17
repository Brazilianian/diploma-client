<script>
import { getOrderById } from '@/service/order_service.js'
import { getUnitById } from '@/service/unit_service.js'

export default {
  data() {
    return {
      order: null,
      unit: null,
    }
  },

  methods: {
    getGeocoder() {
      const geocoder = new google.maps.Geocoder();

      for (let index in this.order.orderDetailsDto.points) {
        const point = this.order.orderDetailsDto.points[index]
        geocoder.geocode({location: {lat: point.latitude, lng: point.longitude}}, (res) => {
          this.order.orderDetailsDto.points[index].places = res
        })
      }
    },

    getOrder() {
      const id = this.$route.params.uuid
      getOrderById(id)
        .then((res) => {
          this.order = res.data

          this.getGeocoder()
          this.getUnit()
        })
        .catch((err) => {
          this.$notify({
            type: 'error',
            title: 'Отримання замовлення',
            text: `Помилка отримання замовлення.\n${err.response.data.message}`
          })

          this.$router.push('/')
        })
    },

    getUnit() {
      getUnitById(this.order.unitId).then((res) => {
        this.unit = res.data
      })
        .catch((err) => {
          this.$notify({
            type: 'error',
            title: 'Отримання підрозділу',
            text: `Помилка отримання підрозділу.\n${err.response.data.message}`
          })

          this.$router.push('/')
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

      const waypoints = []

      for (let i = 0; i < this.order.orderDetailsDto.points.length - 1; i++) {
        const point = this.order.orderDetailsDto.points[i]
        waypoints.push({
          location: { lat: point.latitude, lng: point.longitude }
        })
      }

      const start = this.order.orderDetailsDto.points[0]
      const finish = this.order.orderDetailsDto.points[this.order.orderDetailsDto.points.length - 1]

      const request = {
        origin: { lat: start.latitude, lng: start.longitude },
        destination: { lat: finish.latitude, lng: finish.longitude },
        travelMode: 'DRIVING',
        waypoints: waypoints
      }

      window.directionsService = new google.maps.DirectionsService()
      window.directionsRenderer = new google.maps.DirectionsRenderer()

      window.directionsRenderer.setMap(this.map)

      window.directionsService.route(request, (result) => {
        window.directionsRenderer.setDirections(result)
      })
    },

    prettifyDistance(distance) {
      const kilometers = Math.floor(distance / 1000)
      const meters = distance % 1000
      return (kilometers ? kilometers + ' км ' : '') + meters + ' м'
    },

    prettifyDuration(duration) {
      const hours = Math.floor(duration / 3600)
      const minutes = Math.floor((duration % 3600) / 60)
      const remainingSeconds = duration % 60

      let result = ''
      if (hours > 0) {
        result += hours + ' год. '
      }
      if (minutes > 0) {
        result += minutes + ' хв. '
      }
      result += remainingSeconds + ' с.'

      return result.trim()
    }
  },

  mounted() {
    this.getOrder()

    setTimeout(this.initMap, 500)
  }
}
</script>

<template>

  <!-- Back Button -->
  <div class="position-fixed ms-5">
    <router-link :to="`/units/${this.unit?.uuid}`">
      <button class="btn btn-secondary">
        <img src="/img/go_back.svg" alt="go back">
      </button>
    </router-link>
  </div>

  <div class="container" v-if="order && unit">
    <div class="row text-center vh-100">
      <h1>Замовлення {{ this.order.name }} для війскової частини {{ this.unit.name }}</h1>

      <div class="col-4">

        <div>
          <h3 class="fst-italic fw-bold">Час: {{ prettifyDuration(order.orderDetailsDto.duration) }}</h3>
          <h3 class="fst-italic fw-bold">Довжина: {{ prettifyDistance(order.orderDetailsDto.distance) }}</h3>
        </div>

        <div v-for="(point, index) in this.order.orderDetailsDto.points" :key="index"
             class="mt-3">

          <div class="input-group mb-3">
            <img class="input-group-text" id="basic-addon1" src="/img/marker.svg" alt="Маркер">
            <input type="text" class="form-control" v-model="point.places[0].formatted_address"
                   aria-describedby="basic-addon1" disabled>
          </div>

        </div>

        <hr>

        <input id="autocomplete" type="text" class="form-control" placeholder="Київ">
      </div>
      <div class="col-8">
        <div id="map" class="google-map"></div>
      </div>
    </div>

    <hr>

    <div class="row text-center">
      <div class="col-12">
        <h3>Груз, що буде перевозитись</h3>
        <table class="table table-striped table-dark">
          <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Назва</th>
            <th scope="col">Дистанція</th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="(item, index) in this.order.items"
            :key="index"
          >
            <th>{{ ++index }}</th>
            <th>{{ item.name }}</th>
            <th>{{ item.description }}</th>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="row text-center">
      <div class="col-12">
        <h3>Завершення замовлення</h3>
      </div>
      <div class="col-6">
        <h5>Дата відправки</h5>
        <input type="date" class="form-control" v-model="order.orderDetailsDto.dateTimeFrom"
               :max="order.orderDetailsDto.dateTimeTo" disabled>
      </div>
      <div class="col-6">
        <h5>Дата прибутяя</h5>
        <input type="date" class="form-control" v-model="order.orderDetailsDto.dateTimeTo"
               :min="order.orderDetailsDto.dateTimeFrom" disabled>
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