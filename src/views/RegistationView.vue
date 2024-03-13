<script setup>

</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 offset-md-3 registration-container">
        <h2 class="text-center mb-4">Реєстрація</h2>
        <form>
          <div class="mb-3">
            <label for="exampleInputName" class="form-label">Ім'я</label>
            <input type="text" class="form-control" id="exampleInputName" placeholder="John" required>
          </div>
          <div class="mb-3">
            <label for="exampleInputName" class="form-label">Прізвище</label>
            <input type="text" class="form-control" id="exampleInputName" placeholder="Doe" required>
          </div>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Пошта</label>
            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="example@gmail.com" required>
            <div id="emailHelp" class="form-text text-light">Ми ніколи не передамо вашу електрону скриньку стороннім особам</div>
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Пароль</label>
            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="**********" required>
          </div>
          <div class="mb-3">
            <label for="exampleInputConfirmPassword" class="form-label">Підтвердіть пароль</label>
            <input type="password" class="form-control" id="exampleInputConfirmPassword" placeholder="**********" required>
          </div>
          <button type="submit" class="btn btn-primary w-100">Зареєструватися</button>
        </form>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>