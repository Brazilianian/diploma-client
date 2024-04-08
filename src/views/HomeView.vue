<script>
import { createUnit, getAllUnits } from '@/service/unit_service.js'
import GoogleMap from '@/components/GoogleMapUnitEdit.vue'
import UnitCard from '@/components/UnitCard.vue'

export default {
  components: { UnitCard, GoogleMap },
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
        const message = 'Введіть назву підрозділу'

        this.$notify({
          type: 'warn',
          title: 'Створення підрозділу',
          text: message
        })

        this.unitValidation.name = message

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

          this.fillUnits()
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

  computed: {},

  mounted() {
    this.fillUnits()
  }
}
</script>

<template>
  <main>
    <div class="container">
      <div class="row">
        <div class="col mt-3" v-for="(unit, index) in units"
             :key="index">
          <UnitCard :unit="unit"></UnitCard>
        </div>

        <div class="col mt-3">
          <div class="card" style="width: 18rem;">
            <img src='/img/add.png' class="card-img-top" alt="add">
            <div class="card-body text-center">

              <!-- Modal activate button -->
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
  <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"
       tabindex="-1"
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
            <input v-model="unit.name" type="text" class="form-control"
                   :class="unitValidation.name ? 'is-invalid' : ''" placeholder="ВІТІ ім. Героїв Крут">
            <div class="text-danger">
              {{ unitValidation.name }}
            </div>
          </div>

          <div class="mb-3">
            <img :src="unit.image?.content" class="card-img-top" alt="" id="unitImage">
            <label for="image">Виберіть зображення</label>
            <input @change="imageChange" type="file" name="image" id="unitImagePicker"
                   class="form-control">
            <div class="text-danger">
              {{ unitValidation.image }}
              {{ unitValidation['image.content'] }}
            </div>
          </div>

          <div class="mb-3">
            <label for="description">Введіть опис частини</label>
            <textarea
              v-model="this.unit.description"
              name="description" id="description" cols="30" rows="10" class="form-control"
              placeholder="Інститут зв'язку. Київ"
            >
            </textarea>
            <div class="text-danger">
              {{ unitValidation.description }}
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
