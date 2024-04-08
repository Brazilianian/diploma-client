<script>

import { deleteUnitById, getUnitById } from '@/service/unit_service.js'
import GoogleMapUnitView from '@/components/GoogleMapUnitView.vue'
import GoogleMap from '@/components/GoogleMapUnitEdit.vue'

export default {
  components: { GoogleMap, GoogleMapUnitView },
  data() {
    return {
      unit: {},
      isLoaded: false,
      point: {},
      unitValidation: {}
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
    }
  },

  async mounted() {
    await this.getCurrentUnit()
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