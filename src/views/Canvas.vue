<template>
  <div>
    <Sketch />
    <v-card flat>
      <v-layout row wrap justify-center >
        <v-flex xs2>
          <v-navigation-drawer
            value="true"
            stateless
          >
            <v-list>
              <v-list-tile>
                <v-list-tile-action>
                  <v-icon>home</v-icon>
                </v-list-tile-action>
                <v-list-tile-title>Plugins</v-list-tile-title>
              </v-list-tile>

              <v-divider />
              <v-list-group
                no-action
                v-model="active"
              >
                <v-list-tile
                  v-for="(plugin, i) in plugins"
                  :key="i"
                  @click="onClickNavigation(plugin)"
                >
                  <v-list-tile-content>
                    <v-list-tile-title v-text="plugin"></v-list-tile-title>

                  </v-list-tile-content>
                </v-list-tile>

              </v-list-group>

            </v-list>
          </v-navigation-drawer>
        </v-flex>
        <v-flex xs10>
          <CodeCard :text-name="textName" :source-code="sourceCode"/>
        </v-flex>
      </v-layout>

    </v-card>
  </div>
</template>

<script>

import Sketch from '../components/Sketch'
import CodeCard from '../components/CodeCard'
export default {
  components: { CodeCard, Sketch },
  data: () => ({
    plugins: [],
    active: true,
    textName: '简介',
    sourceCode: '通过WASD移动躲避攻击，只有两条命可以复活，尽力打败这只golang地鼠吧！！！' +
      '\n' +
      '\n' +
      '\n' +
      '\n' +
      '\n' +
      '\n' +
      '\n' +
      '\n' +
      '\n' +
      '\n'
  }),
  methods: {
    async onClickNavigation (textName) {
      this.textName = textName
      const { status, data } = await this.axios.get(this.textName)
      if (status === 200 && data) {
        this.sourceCode = '\n' + data
      }
    }
  },
  async mounted () {
    const { status, data } = await this.axios.get('/fileList')
    if (status === 200 && data) {
      this.plugins = data
    }
  }
}
</script>
