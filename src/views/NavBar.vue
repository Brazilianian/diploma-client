<script>
export default {
  data() {
    return {

    }
  },
  computed: {
    auth() {
      return this.$store.state.auth.isAuth
    }
  }
}
</script>

<template>
  <header>
    <div>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
          <router-link class="navbar-brand" to="/">Головна</router-link>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            </ul>
            <div class="d-flex">
              <button class="btn btn-outline-light me-2" type="button" v-if="!auth">
                <router-link class="nav-link" to="/login">Авторизуватися</router-link>
              </button>
              <button class="btn btn-outline-light me-2" type="button" v-if="!auth">
                <router-link class="nav-link" to="/registration">Зареєструватися</router-link>
              </button>
              <button class="btn btn-outline-light" type="button" v-if="auth">
                <router-link class="nav-link" to="/profile" >Профіль</router-link>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>

</style>