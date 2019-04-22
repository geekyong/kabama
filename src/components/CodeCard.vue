<template>
    <v-card flat>
      <v-card-title class="display-1">{{ textName }}</v-card-title>
      <v-divider />
      <!--<v-img src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"></v-img>-->
      <v-card-text class="subheading">
        <pre v-highlightjs>
          <code class="javascript">
            <p v-html="sourceC">
            </p>
          </code>
        </pre>
      </v-card-text>
    </v-card>
</template>

<script>
export default {
  name: 'CodeCard',
  data: () => ({
    sourceC: '',
    test: ''
  }),
  props: {
    textName: String
  }
}
</script>

<style scoped>

</style>
