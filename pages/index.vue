<template>
  <v-container>
    <event-editor v-model="event" />
    <v-btn
      fixed
      elevation="2"
      fab
      large
      bottom
      right
      color="primary"
      :disabled="!event.dates.length"
      @click="submit"
    >
      Go!
    </v-btn>
  </v-container>
</template>
<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      event: {
        title: '',
        description: '',
        dates: [],
      },
    }
  },
  methods: {
    // storeのactionに設定したが、中身はAjax通信のため.thenを使用し完了を待つ
    submit() {
      this.$store
        .dispatch('createEvent', {
          title: this.event.title.trim(),
          description: this.event.description.trim(),
          dates: this.event.dates,
        })
        .then((id) => {
          this.$router.push(`/${id}`)
        })
    },
  },
}
</script>
