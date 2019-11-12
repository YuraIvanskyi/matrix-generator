<template>
<v-layout wrap>
  <v-overlay :value="loading">
      <v-progress-circular indeterminate size="104"></v-progress-circular>
    </v-overlay>
    <v-card outlined class="ma-2" width="500">
        <v-card-title>Selected equation patterns:
          <v-spacer/>
          <v-btn class="" color="primary" @click="addRow">
          <v-icon class="mr-1">mdi-calculator-variant</v-icon> Evaluate
          </v-btn>
        </v-card-title>
        <v-divider/>
        <v-card-actions>
            <v-layout justify-center>
                <v-container class="ma-0" >
                    <v-sheet tile class="pattern text-center white--text"
                    v-for="(item, index) in prettyPatterns"
                    color="primary"
                    :key="index">
                      {{item}}
                      <v-divider/>
                    </v-sheet>
                </v-container>
            </v-layout>
        </v-card-actions>
    </v-card>
    <v-card outlined class="ma-2">
        <v-card-title>Pre-defined patterns:</v-card-title>
        <v-divider/>
        <v-card-actions>
          <v-radio-group v-model="radioGroup">
            <v-radio
              v-for="n in Object.keys(input)"
              :key="n"
              :label="`Pattern ${n}`"
              :value="n"
            ></v-radio>
          </v-radio-group>
        </v-card-actions>
    </v-card>
    <v-card outlined class="ma-2 px-0" min-width="1600">
      <v-data-iterator
      :items="results"
      :items-per-page="3000"
      :loading="loading"
      :no-data-text="'No solutions for input.'"
    >
    <template v-slot:header>
        <v-toolbar
          class="ma-0"
          color="primary"
          dark
          flat
          dense
        >
          <v-toolbar-title>Found {{ results.length }} solutions:</v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:default="props">
        <v-row class="px-2">
          <v-col
            v-for="(item, index) in props.items"
            :key="index"
            cols="12"
            sm="6"
            md="4"
            lg="2"
          >
            <v-sheet color="primary"
              class="pa-1 ma-0 white--text text-center number">
              <v-sheet color="accent"
                v-for="(i, ind) in item"
                :key="ind"
                class="pa-1 ma-0 mb-1 white--text text-center number">
              {{ outMatrixRow(input[radioGroup].horisontalPatterns[ind].signs, i) }}
              </v-sheet>
            </v-sheet>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
    </v-card>
</v-layout>
</template>
<script>
/* eslint-disable */
import MatrixCell from './MatrixCell.vue';
import { buildExpression, solutions, zipSignsNumbers, evaluateExpressionMatrix, transpose } from '../generator';

export default {
  components: {
    MatrixCell,
  },
  data: () => ({
    expr: '',
    results: [],
    loading: false,
    radioGroup: 1,
    matrices: undefined,
    input: {
      1:{
        horisontalPatterns:[
          { digits:['▢', 2, '▢', 5, 30,], signs: ['+','*','*','='] },
          { digits:['▢', '▢', 16,'▢', '▢▢'], signs: ['+','-','*', '='] },
          { digits:['▢▢', '▢', '▢', 8, '▢▢'], signs: ['+','/','*', '='] },
          { digits:['▢', 7,'▢','▢▢', '▢▢'], signs: ['+', '*', '-', '='] },
          { digits:['▢▢', 16,'▢▢','▢▢', 155], signs: ['+', '+', '+', '='] },
        ],
        verticalSigns:[
          ['+','+','+', '='],
          ['+','+','+', '='],
          ['+','+','+', '='],
          ['+','+','+', '='],
          ['+','+','+', '=']
        ]
      },
      2:{
        horisontalPatterns:[
          { digits:['▢','▢', '▢▢',], signs: ['+','='] },
          { digits:['▢▢', '▢', '▢'], signs: ['-', '='] },
          { digits:['▢▢','▢', '▢▢▢'], signs: ['+', '='] },
        ],
        verticalSigns:[
          ['*','='],
          ['-','='],
          ['*', '='],
        ]
      },
     3:{
        horisontalPatterns:[
          { digits:['▢▢','▢', '▢▢',], signs: ['-','='] },
          { digits:['▢', '▢', '▢▢'], signs: ['+', '='] },
          { digits:[154,'▢▢', '▢▢▢'], signs: ['+', '='] },
        ],
        verticalSigns:[
          ['*','='],
          ['+','='],
          ['*', '='],
        ]
      },
      4:{
        horisontalPatterns:[
          { digits:[5, '▢', '▢▢',], signs: ['+','='] },
          { digits:['▢', 5, '▢▢'], signs: ['+', '='] },
          { digits:['▢▢', '▢▢', '▢▢▢'], signs: ['*', '='] },
        ],
        verticalSigns:[
          ['+','='],
          ['+','='],
          ['*', '='],
        ]
      },
      5:{
        horisontalPatterns:[
          { digits:[5, '▢▢', '▢▢',], signs: ['+','='] },
          { digits:['▢', 5, '▢▢'], signs: ['+', '='] },
          { digits:['▢▢', 2, '▢▢'], signs: ['+', '='] },
          { digits:['▢▢', '▢▢', '▢▢▢'], signs: ['*', '='] },
        ],
        verticalSigns:[
          ['+', '+','='],
          ['+', '+', '='],
          ['*', '+', '='],
          ['*', '+', '='],
        ]
      },
    },
    matrixData: [],
    editMatrixData: [],
  }),
  computed: {
    prettyPatterns() {
      let patternSet = [];
      let signs = transpose(this.input[this.radioGroup].verticalSigns);
      this.input[this.radioGroup].horisontalPatterns.forEach((element,index) => {
        patternSet.push(zipSignsNumbers(element.signs, element.digits));
        if(signs[index]!== undefined)
          patternSet.push(signs[index].toString().replace('[','').replace(']','').replace(/,/g,'  '))
      });
      return patternSet;
    }
  },
  methods: {
    addRow() {
      this.loading = true;
      setTimeout(() => {
          let res = evaluateExpressionMatrix(this.input[this.radioGroup]);;
          this.results = res;
          this.loading = false;
        }, 1000)
      
    },
    outMatrixRow(index, value) {
      return zipSignsNumbers(index, value)//.toString().replace('[','').replace(']','').replace(/,/g,'|');
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
  letter-spacing: 0.2em;
}
</style>