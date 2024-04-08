<script>

export default {
  data() {
    return {
      mapRef: null,
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      center: { lat: 50.450001, lng: 30.523333 },
      markerOptions: {
        draggable: true,
        position: { lat: 50.450001, lng: 30.523333 }
      }
    }
  },
  methods: {
    updateMarkerLocation(event) {
      this.markerOptions.position.lat = event.latLng.lat()
      this.markerOptions.position.lng = event.latLng.lng()

      this.$emit('markerPositionChange', this.markerOptions.position)
    }
  },
}


</script>

<template>
  <GoogleMap
    :api-key="apiKey"
    style="width: 100%; height: 500px"
    :center="center"
    :zoom="9"
    :ref="mapRef"
    @click="updateMarkerLocation"
  >
    <Marker
      :options=markerOptions
      @dragend="updateMarkerLocation"
    ></Marker>
  </GoogleMap>
</template>