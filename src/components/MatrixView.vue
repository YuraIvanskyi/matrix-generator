<template>
<v-layout wrap justify-start>
  <v-overlay z-index="10" :value="loading">
    <v-container wrap justify-center>
      <v-progress-circular indeterminate width="20" size="164"></v-progress-circular>
      <v-card-title>Calculating...</v-card-title>
    </v-container>
    </v-overlay>
    <v-card outlined class="ma-2">
        <v-card-title>Recent equation patterns requests:
          <v-spacer/>
        </v-card-title>
        <v-divider/>
        <v-card-actions>
            <v-layout justify-start align-center>
                    <v-list two-line nav>
      <v-list-item-group
        active-class="accent"
      >
        <template v-for="(item, index) in input">
          <v-list-item :key="index" @click="selected = item">
            <template v-slot:default="{ active, toggle }">
              <v-list-item-content>
                  <v-layout align-center>
                <v-list-item-title
        v-text="`${item.pattern.horisontalPatterns.length}*${item.pattern.verticalSigns.length}`">
                </v-list-item-title>
                <v-card-text class="mx-2">Expressions:</v-card-text>
                <v-divider vertical class="mx-1"/>
                <v-list-item-subtitle class="pattern text--primary">
                    <v-sheet tile class="text-center white--text text-no-wrap"
                    v-for="(i, ind) in item.pattern.horisontalPatterns"
                    color="primary"
                    :key="ind">
                      {{zip(i)}}
                      <v-divider/>
                    </v-sheet>
                </v-list-item-subtitle>
                <v-divider vertical class="mx-1"/>
                <v-card-text class="mx-2">Signs:</v-card-text>
                <v-divider vertical class="mx-1"/>
                <v-list-item-subtitle>
                    <v-sheet tile class="pattern text-center white--text px-2"
                    v-for="(i, ind) in item.pattern.verticalSigns"
                    color="primary"
                    :key="ind">
                      {{i.toString().replace('[','').replace(']','').replace(/,/g,'  ')}}
                      <v-spacer/>
                    </v-sheet>
                    </v-list-item-subtitle>
                    <v-divider vertical class="mx-1"/>
                  </v-layout>
              </v-list-item-content>

              <v-list-item-action>
                <v-list-item-action-text v-text="item.action"></v-list-item-action-text>
              </v-list-item-action>
            </template>
          </v-list-item>

          <v-divider
            v-if="index + 1 < input.length"
            :key="index"
          ></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
            </v-layout>
        </v-card-actions>
    </v-card>
    <v-card outlined class="ma-2" max-width="900">
        <v-layout justify-center class="ma-2">
        <v-card-title>Solutions:</v-card-title>
        <v-spacer/>
          <v-btn class="mt-3 mr-3" color="primary" @click="exportJSON">
          <v-icon class="mr-1">mdi-download</v-icon> Export results
          </v-btn>
        </v-layout>
        <v-divider/>
        <v-card-actions class="pa-2">
            <v-layout wrap>
            <v-sheet class="ma-2"
              v-for="(n,i) in selected.results"
              :key="i"
            ><v-sheet
              v-for="(ni,ind) in n"
              :key="ind"
            >{{ni}}</v-sheet>
            <v-divider/>
            </v-sheet>
            </v-layout>
        </v-card-actions>
    </v-card>
</v-layout>
</template>
<script>
/* eslint-disable */
import MatrixCell from './MatrixCell.vue';
import { latestAction, zipSignsNumbers, evaluateExpressionMatrix, transpose } from '../generator';
import { solutions, patterns } from '../main.js';
import { saveAs } from 'file-saver';

export default {
  components: {
    MatrixCell,
  },
  data: () => ({
    loading: false,
    matrices: undefined,
    selected:{},
    input: solutions,
  }),
  computed: {
   
  },
  methods: {
    zip(value){ return zipSignsNumbers(value.signs,value.digits) },
    exportJSON() {
        let fileName = `GenerationExport_${Date.now()}.json`;
        let fileToSave = new Blob([JSON.stringify(this.selected.results)], {
            type: 'application/json',
            name: fileName
        });
        saveAs(fileToSave, fileName);
    }
  },
};
</script>
<style>
.number {
  font-family: 'Anonymous Pro', monospace;
  font-size: 16px;
  letter-spacing: 0.1em;
}
.pattern {
  font-family: 'Anonymous Pro', monospace;
  font-size: 16px;
  overflow: visible;
  letter-spacing: 0.2em;
}
</style>