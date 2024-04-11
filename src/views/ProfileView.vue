<script>
import { removeAccessTokenFromLocalStorage, removeRefreshTokenFromLocalStorage } from '@/service/token_service.js'
import { removeUserFromLocalStorage, saveUser, updateUser } from '@/service/user_service.js'

export default {
  name: 'ProfileView',
  data() {
    return {
      user: null,
      userValidation: {}
    }
  },
  methods: {
    getUser() {
      this.user = this.$store.state.auth.user
      saveUser(this.user)
    },

    logout() {
      removeUserFromLocalStorage()
      removeAccessTokenFromLocalStorage()
      removeRefreshTokenFromLocalStorage()

      this.$store.commit('auth/logout')
      this.$router.push('/auth/login')
    },

    saveChanges() {
      updateUser(this.user)
        .then((res) => {
          this.$notify({
            type: 'success',
            title: 'Оновлення профілю',
            text: 'Інформаія успішно оновлена'
          })
          this.$store.state.auth.user = res.data
          saveUser(this.user)
        })
        .catch((err) => {
          if (err?.status === 422) {
            this.$notify({
              type: 'warn',
              title: 'Оновлення профілю',
              text: 'Помилка оновлення профілю'
            })

            this.userValidation = err.response.data
          }
        })
    },


    initFileInput() {
      const fileInput = document.getElementById('image')
      fileInput.click()
    },

    imageChange(event) {
      const unitImg = document.getElementById('userImage')
      const fileReader = new FileReader()
      fileReader.readAsDataURL(event.target.files[0])
      fileReader.onload = (event) => {
        unitImg.src = event.target.result
        this.user.image.content = event.target.result
      }
    }
  },

  mounted() {
    this.getUser()
  },

  computed: {
    isAdmin() {
      return this.$store.state.auth.isAdmin
    }
  }
}
</script>

<template>
  <!-- TODO: complete profile page -->
  <div class="container mt-5">
    <div class="row">
      <div class="col" v-if="user">
        <h2 class="text-center">Профіль</h2>
        <h3 class="text-success text-center" v-if="isAdmin">Ви адміністратор!</h3>
        <div class="text-center">
          <img :src="user?.image?.content ? user.image.content : '/img/incognito.png'" alt="image" id="userImage" class="img-thumbnail" @click="initFileInput">
        </div>
        <input type="file" accept="image/*" class="invisible" id="image" @change="imageChange">

        <div class="mt-3">
          <h4>Ім'я:</h4>
          <input v-model="user.firstName" type="text" class="form-control" placeholder="Іван">
          <div class="text-danger">
            {{ userValidation?.firstName }}
          </div>
        </div>

        <div class="mt-3">
          <h4>Прізвище:</h4>
          <input v-model="user.lastName" type="text" class="form-control" placeholder="Іванов">
          <div class="text-danger">
            {{ userValidation?.lastName }}
          </div>
        </div>

        <div class="mt-3 text-center">
          <button type="button" class="btn btn-primary" @click="saveChanges">Зберегти налаштування</button>
        </div>

        <div class="text-end mt-3 mb-2">
          <button type="button" class="btn btn-danger" @click="logout">Вийти</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>