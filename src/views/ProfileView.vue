<script>
import { removeAccessTokenFromLocalStorage, removeRefreshTokenFromLocalStorage } from '@/service/token_service.js'
import { removeUserFromLocalStorage } from '@/service/user_service.js'

  export default {
    name: 'ProfileView',
    data() {
      return {}
    },
    methods: {
      logout() {
        removeUserFromLocalStorage()
        removeAccessTokenFromLocalStorage()
        removeRefreshTokenFromLocalStorage()

        this.$store.commit('auth/logout')
        this.$router.push('/auth/login')
      }
    }
  }
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col">
        <h2>Профіль</h2>
        <div class="mb-3">
          <label for="firstName" class="form-label">First Name</label>
          <input type="text" class="form-control" id="firstName" value="John" readonly>
        </div>
        <div class="mb-3">
          <label for="lastName" class="form-label">Last Name</label>
          <input type="text" class="form-control" id="lastName" value="Doe" readonly>
        </div>
        <!-- Admin Status -->
        <div class="mb-3">
          <label class="form-label">Admin Status</label>
          <input type="text" class="form-control" value="Yes" readonly> <!-- Change value dynamically based on admin status -->
        </div>
        <!-- History of Items -->
        <div class="mb-3">
          <h4>History of Items</h4>
          <!-- Bootstrap Cards -->
          <div class="card">
            <div class="card-body">
              Item 1
            </div>
          </div>
          <div class="card mt-3">
            <div class="card-body">
              Item 2
            </div>
          </div>
          <!-- Add more cards dynamically based on history -->
        </div>
        <!-- Logout Button -->
        <button type="button" class="btn btn-danger" @click="logout">Вийти</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>