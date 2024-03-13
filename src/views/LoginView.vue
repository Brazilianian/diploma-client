<script setup>

</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 offset-md-3 login-container">
        <h2 class="text-center mb-4">Авторизація</h2>
        <form>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Пошта</label>
            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="example@gmail.com">
            <div id="emailHelp" class="form-text text-light">Ми ніколи не передамо вашу електрону скриньку стороннім особам</div>
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Пароль</label>
            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="**********">
          </div>
          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="exampleCheck1">
            <label class="form-check-label" for="exampleCheck1">Запам'ятати мене</label>
          </div>
          <button type="submit" class="btn btn-primary w-100">Увійти</button>
        </form>
        <div class="text-center mt-3">
          Ще не зареєстровані? <router-link to="/registration">Зареєструватися</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>