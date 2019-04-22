<template>
  <div>
    <Sketch />
    <v-card flat>
      <v-layout row wrap justify-center >
        <v-flex xs2>
          <v-navigation-drawer
            stateless
            value="true"
          >
            <v-list>
              <v-list-tile>
                <v-list-tile-action>
                  <v-icon>home</v-icon>
                </v-list-tile-action>
                <v-list-tile-title>Home</v-list-tile-title>
              </v-list-tile>

              <v-list-group
                prepend-icon="account_circle"
                value="true"
              >
                <template>
                  <v-list-tile>
                    <v-list-tile-title>Users</v-list-tile-title>
                  </v-list-tile>
                </template>
                <v-list-group
                  no-action
                  sub-group
                  value="true"
                >
                  <template >
                    <v-list-tile>
                      <v-list-tile-title>Admin</v-list-tile-title>
                    </v-list-tile>
                  </template>

                  <v-list-tile
                    v-for="(admin, i) in admins"
                    :key="i"
                    @click="onClickNavigation(admin[0])"
                  >
                    <v-list-tile-title v-text="admin[0]"></v-list-tile-title>
                    <v-list-tile-action>
                      <v-icon v-text="admin[1]"></v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list-group>

                <v-list-group
                  sub-group
                  no-action
                >
                  <template>
                    <v-list-tile>
                      <v-list-tile-title>Actions</v-list-tile-title>
                    </v-list-tile>
                  </template>
                  <v-list-tile
                    v-for="(crud, i) in cruds"
                    :key="i"
                    @click="onClickNavigation(crud[0])"
                  >
                    <v-list-tile-title v-text="crud[0]"></v-list-tile-title>
                    <v-list-tile-action>
                      <v-icon v-text="crud[1]"></v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list-group>
              </v-list-group>
            </v-list>
          </v-navigation-drawer>
        </v-flex>
        <v-flex xs10>
          <CodeCard :text-name="textName" />
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
    admins: [
      ['Management', 'people_outline'],
      ['Settings', 'settings']
    ],
    cruds: [
      ['Create', 'add'],
      ['Read', 'insert_drive_file'],
      ['Update', 'update'],
      ['Delete', 'delete']
    ],
    plugins: [],
    textName: 'textName'
  }),
  methods: {
    onClickNavigation (textName) {
      this.textName = textName
    }
  },
  async mounted () {
    const plugins = await this.axios.get('/fileList')
    if (plugins) {
      this.plugins = plugins
    }
  }
}
</script>
