<template>
<v-layout class="ma-0 pa-0" justify-space-between>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on }">
        <v-avatar v-for="cell in values" :key="cell"
        v-on="on"
        tile color="primary" class="ma-1"
        >{{cell}}</v-avatar>
      </template>

      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Privacy Policy
        </v-card-title>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            I accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</v-layout>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
  }),
  props: {
    values: {
      type: Array,
      required: true,
    },
  },
};
</script>
