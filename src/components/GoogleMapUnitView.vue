<script>

export default {
  props: {
    point: undefined
  },

  data() {
    return {
      mapRef: null,
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      center: this.point,
      zoom: 18,
      markerOptions: {
        draggable: false,
        position: this.point
      }
    }
  }
}


</script>

<template>
  <GoogleMap v-if="point"
             :api-key="apiKey"
             style="width: 100%; height: 500px"
             :zoom="9"
             :center="center"
             :ref="mapRef"
  >
    <Marker
      :options=markerOptions
    ></Marker>
  </GoogleMap>
</template>