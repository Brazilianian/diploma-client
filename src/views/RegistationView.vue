<script>

import { createUser } from '@/service/auth_service.js'

export default {
  name: 'RegistrationView',
  data() {
    return {
      user: {
        name: null,
        surname: null,
        email: null,
        password: null,
        password2: null
      },

      validationErrors: {
        email: null,
        firstName: null,
        lastName: null,
        password: null
      }
    }
  },
  methods: {
    createUser() {

      this.validationErrors = {}

      if (this.user.password !== this.user.password2) {
        this.validationErrors.password = 'Паролі мають співпадати'

        return this.$notify({
          title: 'Реєстрація',
          text: 'Паролі мають співпадати',
          type: 'warn'
        })
      }

      createUser(this.user)
        .then(res => {
          if (res.status === 201) {
            this.$notify({
              type: 'info',
              title: 'Реєстрація',
              text: 'Користувач успішно зареєстрований'
            })

            this.$router.push('/login')
            return
          }

          this.$notify({
            type: 'error',
            title: 'Реєстрація',
            text: `Помилка реєстрація ${res.data.message}`
          })
        })
        .catch((err) => {
          this.$notify({
            type: 'error',
            title: 'Реєстрація',
            text: `Помилка реєстрації. ${err}`
          })

          if (err.response.status === 422) {
            this.validationErrors = err.response.data.errors
          }
        })
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 offset-md-3 registration-container">
        <h2 class="text-center mb-4">Реєстрація</h2>
        <form>
          <div class="mb-3">
            <label for="exampleInputName" class="form-label">Ім'я</label>
            <input v-model="user.name" type="text" class="form-control" id="exampleInputName" placeholder="John"
                   required>
            <div class="text-danger">
              {{ validationErrors?.firstName }}
            </div>
          </div>
          <div class="mb-3">
            <label for="exampleInputSurName" class="form-label">Прізвище</label>
            <input v-model="user.surname" type="text" class="form-control" id="exampleInputSurName" placeholder="Doe"
                   required>
            <div class="text-danger">
              {{ validationErrors?.lastName }}
            </div>
          </div>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Пошта</label>
            <input v-model="user.email" type="email" class="form-control" id="exampleInputEmail1"
                   aria-describedby="emailHelp"
                   placeholder="example@gmail.com" required>
            <div id="emailHelp" class="form-text text-light">Ми ніколи не передамо вашу електрону скриньку стороннім
              особам
            </div>
            <div class="text-danger">
              {{ validationErrors?.email }}
            </div>
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Пароль</label>
            <input v-model="user.password" type="password" class="form-control" id="exampleInputPassword1"
                   placeholder="**********" required>
            <div class="text-danger">
              {{ validationErrors?.password }}
            </div></div>
          <div class="mb-3">
            <label for="exampleInputConfirmPassword" class="form-label">Підтвердіть пароль</label>
            <input v-model="user.password2" type="password" class="form-control" id="exampleInputConfirmPassword"
                   placeholder="**********"
                   required>
            <div class="text-danger">
              {{ validationErrors?.password }}
            </div>
          </div>
          <div class="text-center mb-3">
            Вже маєте акаунт?
            <router-link to="/login">Увійти</router-link>
          </div>
          <button
            type="button" class="btn btn-primary w-100"
            @click="createUser()"
          >Зареєструватися
          </button>
        </form>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>