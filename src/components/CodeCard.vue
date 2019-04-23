<template>
    <v-card flat>
      <v-card-title class="display-1">{{ textName }}</v-card-title>
      <v-divider />
      <v-card-text class="title">
        <pre v-highlightjs="sourceCode">
          <code class="javascript"></code>
        </pre>
      </v-card-text>
    </v-card>
</template>

<script>
export default {
  name: 'CodeCard',
  props: {
    textName: String,
    sourceCode: String
  }
}
</script>

<style scoped>

</style>
