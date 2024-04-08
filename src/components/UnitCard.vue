<script>
export default {
  props: {
    unit: undefined
  }
}
</script>

<template>
  <div v-if="unit" class="card" style="width: 18rem;">
    <img :src="unit.image.content" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">{{ unit.name }}</h5>
      <p class="card-text">{{ unit.description?.length > 100 ? unit.description.slice(0, 100) + '...' : unit.description }}</p>
      <router-link :to="`/units/${unit.uuid}`">
        <button class="btn btn-primary">Переглянути</button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>

</style>