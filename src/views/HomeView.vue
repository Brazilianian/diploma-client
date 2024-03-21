<script>
import { createUnit } from '@/service/unit_service.js'

export default {
  data() {
    return {
      unit: {
        name: '',
        location: {
          latitude: 0,
          longitude: 0
        }
      },
      unitValidation: {
        name: '',
        location: {
          latitude: 0,
          longitude: 0
        }
      }
    }
  },
  methods: {
    addUnit() {
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
          if (err.response.status === 422) {
            this.unitValidation = err.response.data.errors

            this.$notify({
              type: 'error',
              title: 'Створення підрозділу',
              text: `Помилка під час створення підрозділу. ${err.response.data.message}`
            })
          }
        })
    }
  }
}
</script>

<template>
  <main>
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="card" style="width: 18rem;">
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
  <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
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
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрити</button>
          <button type="button" class="btn btn-primary" @click="addUnit">Добавити</button>
        </div>
      </div>
    </div>
  </div>
</template>
