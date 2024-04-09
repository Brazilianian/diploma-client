<script>
import { getUnitById } from '@/service/unit_service.js'

export default {
  data() {
    return {
      map: null,
      markers: [],
      autocomplete: null,

      unit: null,
      places: []
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

      const placeInput = document.getElementById('autocomplete')
      placeInput.setPlace(null)
      placeInput.value = ''
    },

    deletePlace(index) {
      this.places.splice(index, 1)
    },

    renderRoute() {
      let counter = 1

      window.markers.forEach((marker) => {
        marker.setMap(null)
      })
      window.markers = []

      for (const place of this.places) {
        const marker = new google.maps.Marker({
          position: place.geometry.location,
          map: this.map,
          label: counter.toString()
        })

        window.markers.push(marker)
        counter++
      }

      this.generateRoute()
    },

    generateRoute() {
      if (this.places.length > 1) {
        const ds = new google.maps.DirectionsService()
        const dd = new google.maps.DirectionsRenderer()

        const request = {
          origin: this.places[0].geometry.location,
          destination: this.places[1].geometry.location,
          travelMode: 'TRANSIT'
        }

        dd.setMap(this.map)

        ds.route(request, function(result, status) {
          dd.setDirections(result)
        })
      }
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
    <div class="row text-center">
      <h1>Створення замолвення автомолбільного перевезення військової частини {{ this.unit?.name }}</h1>

      <h5>Вкажіть маршрут перевезення</h5>
      <div class="col-4">
        <div v-for="(place, index) in this.places" :key="index"
             class="mt-3">

          <div class="input-group mb-3">
            <img class="input-group-text" id="basic-addon1" src="/public/img/marker.svg" alt="Маркер">
            <input type="text" class="form-control" v-model="place.formatted_address"
                   aria-describedby="basic-addon1" disabled>
            <button @click="deletePlace(index)" class="btn btn-danger"><img src="/public/img/delete.svg" alt="delete">
            </button>
          </div>

        </div>

        <hr>

        <input id="autocomplete" type="text" class="form-control" placeholder="Київ">
        <button class="btn btn-primary mt-3" @click="addPlace()">Добавити точку</button>
      </div>
      <div class="col-8">
        <div id="map" class="google-map"></div>
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