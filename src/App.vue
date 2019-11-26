<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense nav>
        <v-list-item two-line>
          <v-list-item-action>
            <v-icon size="56" color="primary">mdi-file-key</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Matrix Key Generator</v-list-item-title>
            <v-list-item-subtitle>by discrete methods</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="my-1"/>
        <v-list-item-group color="primary">
        <v-list-item to="/matrix">
          <v-list-item-action>
            <v-icon>mdi-matrix</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Matrix editor</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/history">
          <v-list-item-action>
            <v-icon>mdi-history</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>History</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer
      color="primary"
      app
    >
      <span class="white--text">Magister's degree acquisition attempt</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
  }),
};
</script>
