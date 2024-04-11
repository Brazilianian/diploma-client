<script>

import { deleteUnitById, getUnitById } from '@/service/unit_service.js'
import GoogleMapUnitView from '@/components/GoogleMapUnitView.vue'
import { getOrderById } from '@/service/order_service.js'

export default {
  components: { GoogleMapUnitView },
  data() {
    return {
      unit: {},
      isLoaded: false,
      point: {},
      unitValidation: {},
      orders: []
    }
  },

  methods: {
    deleteUnit() {
      deleteUnitById(this.unit.uuid)
        .then(() => {
          this.$notify({
            type: 'success',
            title: 'Видалення підрозділу',
            text: `Підрозділ '${this.unit.name}' успішно видалено`
          })

          this.$router.push({ path: '/' })
        })
        .catch(err => {
          this.$notify({
            type: 'error',
            title: 'Видалення підрозділу',
            text: `Не вдалось видалити підрозділ '${this.unit.name}'\n${err.response?.data.message}`
          })
        })

    },

    getCurrentUnit() {
      const id = this.$route.params.id

      getUnitById(id)
        .then(res => {
          this.unit = res.data
          this.point = { lat: this.unit.location.latitude, lng: this.unit.location.longitude }
          this.isLoaded = true

          this.getOrders()
        })
        .catch(err => {
          this.$notify({
            type: 'error',
            title: 'Отримання підрозділу',
            text: `Помилка отримання підрозділу '${id}'.\n${err.response?.data.message}`
          })

          this.$router.push('/')
        })
    },

    getOrders() {
      for (const orderId of this.unit.ordersId) {
        getOrderById(orderId)
          .then((res) => {
            this.orders.push(res.data)
          })
          .catch(err => {
            this.$notify({
              type: 'error',
              title: 'Отримання замовлення',
              text: `Помилка отримання підрозділу ${orderId}\n${err.response?.data.message}`
            })
          })
      }
    },

    editUnit() {

    },

    loadModalImage() {
      const unitImg = document.getElementById('unitImage')
      unitImg.src = this.unit?.image?.content
    },

    imageChange(event) {
      const unitImg = document.getElementById('unitImage')
      const fileReader = new FileReader()
      fileReader.readAsDataURL(event.target.files[0])
      fileReader.onload = (event) => {
        unitImg.src = event.target.result
        this.unit.image = event.target.result
      }
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
    },

    goToOrder(id) {
      this.$router.push(`/orders/${id}`)
    }
  },

  mounted() {
    this.getCurrentUnit()
  },

  computed: {
    hasManagePermission() {
      return this.$store.state.auth.isAdmin || this.unit.users.some(u => u.id === this.$store.state.auth.user.id)
    }
  }
}
</script>

<template>

  <!-- Back Button -->
  <div class="position-fixed ms-5">
    <router-link to="/">
      <button class="btn btn-secondary">
        <img src="/img/go_back.svg" alt="go back">
      </button>
    </router-link>
  </div>

  <div class="container mt-3 pb-3" v-if="this.isLoaded">
    <div class="row">
      <div class="col text-center">
        <h2>{{ unit.name }}</h2>
        <img :src="unit.image?.content" alt="" class="w-100 mt-3">
        <h3 class="w-100 text-wrap mt-3">{{ unit.description }}</h3>
        <GoogleMapUnitView :point="this.point" class="mt-3"></GoogleMapUnitView>
      </div>
    </div>

    <div class="row border mt-3 p-3 rounded">
      <table v-if="orders.length > 0" class="table table-dark table-striped table-hover">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Назва</th>
          <th scope="col">Дистанція</th>
          <th scope="col">Від</th>
          <th scope="col">По</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(order, index) in orders" :key="order.id" @click="goToOrder(order.id)">
          <td>{{ index++ }}</td>
          <td>{{ order.name }}</td>
          <td>{{ this.prettifyDistance(order.orderDetailsDto.distance) }}</td>
          <td>{{ order.orderDetailsDto.dateTimeFrom }}</td>
          <td>{{ order.orderDetailsDto.dateTimeTo }}</td>
        </tr>
        </tbody>
      </table>
      <h3 class="text-center" v-else>
        Поки що жодних замовлень в даній частині!
      </h3>
      <router-link :to="`/order-create?unitId=${unit.uuid}`">
        <button class="btn btn-secondary w-100">Створити замовлення</button>
      </router-link>
    </div>

    <div class="row mt-3 pb-3" v-if="hasManagePermission">
      <div class="col">
        <div class="text-center">
          <button class="btn btn-primary form-control">
            Редагувати підрозділ (dont work)
          </button>
        </div>
      </div>
      <div class="col"></div>
      <div class="col">
        <div class="text-center">
          <button class="btn btn-danger form-control" @click="deleteUnit()">
            Видалити підрозділ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>