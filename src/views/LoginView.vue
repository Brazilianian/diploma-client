<script>
import { getTokensFromResponse, getUserFromResponse, loginUser } from '@/service/auth_service.js'
import { saveAccessToken, saveRefreshToken } from '@/service/token_service.js'
import { saveUser } from '@/service/user_service.js'

export default {
  data() {
    return {
      user: {
        email: null,
        password: null
      },
      userValidation: {
        email: null,
        password: null
      }
    }
  },
  methods: {
    login() {
      this.userValidation = {}

      loginUser(this.user)
        .then(res => {

          const tokens = getTokensFromResponse(res)
          const user = getUserFromResponse(res)
          if (!tokens) {
            this.$store.commit('loginFailure')
            return
          }

          saveAccessToken(tokens.accessToken)
          saveRefreshToken(tokens.refreshToken)
          saveUser(user)

          this.$store.commit('loginSuccess', { tokens, user })

          this.$router.push('/')
        })
        .catch(err => {
          this.$store.commit('loginFailure')

          if (err.response.status === 403) {
            this.userValidation.password = 'Невірний Пароль'

            return this.$notify({
              type: 'error',
              title: 'Авторизація',
              text: `Помилка аутентифікації. Невірний Email або пароль`
            })
          }

          this.$notify({
            type: 'error',
            title: 'Авторизація',
            text: `Помилка аутентифікації. ${err.response.data.message}`
          })
        })
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 offset-md-3 login-container">
        <h2 class="text-center mb-4">Авторизація</h2>
        <form>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Пошта</label>
            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                   placeholder="example@gmail.com"
                   v-model="user.email"
            >
            <div id="emailHelp" class="form-text text-light">Ми ніколи не передамо вашу електрону скриньку стороннім
              особам
            </div>
            <div class="text-danger">
              {{ userValidation.email }}
            </div>
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Пароль</label>
            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="**********"
                   v-model="user.password"
            >
            <div class="text-danger">
              {{ userValidation.password }}
            </div>
          </div>
          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="exampleCheck1">
            <label class="form-check-label" for="exampleCheck1">Запам'ятати мене</label>
          </div>
          <button type="button" class="btn btn-primary w-100" @click="login()">Увійти</button>
        </form>
        <div class="text-center mt-3">
          Ще не зареєстровані?
          <router-link to="/registration">Зареєструватися</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>