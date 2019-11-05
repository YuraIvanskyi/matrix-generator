<template>
<v-layout>
    <v-card outlined class="ma-2" width="500">
        <v-card-title>Current equations</v-card-title>
        <v-divider/>
        <v-card-actions>
            <v-layout justify-center align-center>
                <v-layout wrap class="ma-0" justify-center>
                    <matrix-cell v-for="row in matrixData" :key="row.id"
                    :values="row.data"/>
                </v-layout>
            </v-layout>
        </v-card-actions>
    </v-card>
    <v-card outlined class="ma-2">
        <v-card-title>Actions</v-card-title>
        <v-card-actions>
            <v-btn @click="addRow">
                <v-icon>mdi-plus</v-icon>
                </v-btn>
        </v-card-actions>
    </v-card>
</v-layout>
</template>
<script>
import MatrixCell from './MatrixCell.vue';

export default {
  components: {
    MatrixCell,
  },
  data: () => ({
    matrixData: [
      {
        data: [1, '+', 3, '-', 21, '=', 52],
        id: 1,
      },
      {
        data: [11, '+', 31, '-', 211, '=', 512],
        id: 2,
      },
      {
        data: [12, '+', 32, '-', 222, '=', 52],
        id: 3,
      },
      {
        data: [13, '-', 33, '+', 23, '=', 35],
        id: 4,
      },
      {
        data: [41, '-', 34, '+', 24, '=', 54],
        id: 5,
      },
      {
        data: [51, '-', 35, '-', 522, '=', 515],
        id: 6,
      },
    ],
    editMatrixData: [],
  }),
  methods: {
    addRow() {
      this.matrixData.push({
        data: [3, '-', 66, '+', 99, '=', 322],
        id: 7,
      });
    },
  },
};
</script>
