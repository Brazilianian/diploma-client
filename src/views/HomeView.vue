<script>
import { createUnit, getAllUnits } from '@/service/unit_service.js'
import GoogleMap from '@/components/GoogleMap.vue'

export default {
  components: { GoogleMap },
  data() {
    return {
      units: [],

      // New Unit to Create
      unit: {
        name: '',
        location: {
          latitude: 50.450001,
          longitude: 30.523333
        }
      },
      unitValidation: {
        name: '',
        location: ''
      }
    }
  },
  methods: {
    fillUnits() {
      getAllUnits()
        .then(res => {
          this.units = res.data
        })
        .catch(err => {
          this.$notify({
            type: 'error',
            title: 'Помилка отримання всіх підрозділів',
            text: err.response?.message
          })
        })
    },

    addUnit() {
      if (!this.unit.name) {
        this.$notify({
          type: 'warn',
          title: 'Створення підрозділу',
          text: `Введіть назву підрозділу`
        })

        return
      }

      createUnit(this.unit)
        .then(() => {
          this.$notify({
            type: 'info',
            title: 'Створення підрозділу',
            text: `Успішно створено підрозділ '${this.unit.name}'`
          })

          this.unitValidation = {}
          this.unit = {}
        })
        .catch(err => {
          if (err.response?.status === 422) {
            this.unitValidation = err.response.data.errors

            this.$notify({
              type: 'error',
              title: 'Створення підрозділу',
              text: `Помилка під час створення підрозділу. ${err.response.data.message}`
            })

            return
          }

          this.$notify({
            type: 'error',
            title: 'Створення підрозділу',
            text: err
          })
        })
    },
  },

  computed: {
    isAuth() {
      return this.$store.state.auth.isAuth
    }
  },

  mounted() {
    this.fillUnits()
  }
}
</script>

<template>
  <main>
    <div class="container">
      <div class="row">
        <div class="col">

          <div v-for="unit in units"
               :key="unit.uuid"
               class="card" style="width: 18rem;">
            <img src="..." class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">{{ unit.name }}</h5>
              <p class="card-text">{{ unit.description }}</p>


                <router-link :to="`/units/${unit.uuid}`">
                  <button class="btn btn-primary">Переглянути</button>
                </router-link>

            </div>
          </div>

          <div v-if="isAuth" class="card" style="width: 18rem;">
            <img src='/img/add.png' class="card-img-top" alt="add">
            <div class="card-body text-center">
              <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                Добавити підрозділ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!--Modal-->
  <div v-if="isAuth" class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
       aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-dark" id="staticBackdropLabel">Додати новий підрозділ</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-dark">
          <div class="mb-3">
            <label for="name">Назва Підрозділу (або номер)</label>
            <input v-model="unit.name" type="text" class="form-control" placeholder="ВІТІ ім. Героїв Крут">
            <div class="text-danger">
              {{ unitValidation.name }}
            </div>
          </div>
          <div class="mb-3">
            <GoogleMap
              @markerPositionChange="(position) => {
                this.unit.location.latitude = position.lat
                this.unit.location.longitude = position.lng
              }"
            >
            </GoogleMap>

            <div class="text-danger">{{ unitValidation.location }}</div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрити</button>
          <button type="button" class="btn btn-primary" @click="addUnit">Добавити</button>
        </div>
      </div>
    </div>
  </div>
</template>
