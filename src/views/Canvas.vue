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
    textName: '这是一篇简介',
    sourceCode: 'function readDir (foldPath) {\n' +
      '  let allFiles = []\n' +
      '  const files = fs.readdirSync(foldPath)\n' +
      '\n' +
      '  if (!files) {\n' +
      '    return\n' +
      '  }\n' +
      '  for (let f of files) {\n' +
      '    const stats = fs.statSync(path.join(foldPath, f))\n' +
      '    if (!stats) continue\n' +
      '    const thisPath = path.join(foldPath, f)\n' +
      '    if (stats.isDirectory()) {\n' +
      '      if (f === \'node_modules\' || f === \'dist\') {\n' +
      '        continue\n' +
      '      }\n' +
      '      const child = readDir(thisPath)\n' +
      '\n' +
      '      allFiles = allFiles.concat(...child)\n' +
      '    } else {\n' +
      '      const data = fs.readFileSync(thisPath)\n' +
      '      if (!data) continue\n' +
      '      const reg = new RegExp(\'\\\\\\\\\', \'g\')\n' +
      '      allFiles.push({\n' +
      '        \'path\': thisPath.slice(thisPath.lastIndexOf(dir) + dir.length, thisPath.length).replace(reg, \'/\'),\n' +
      '        \'data\': data\n' +
      '      })\n' +
      '    }\n' +
      '  }\n' +
      '  return allFiles\n' +
      '}\n'
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
