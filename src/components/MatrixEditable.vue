<template>
<v-layout wrap justify-space-around>
  <v-overlay z-index="10" :value="loading">
    <v-container wrap justify-center>
      <v-progress-circular indeterminate width="20" size="164"></v-progress-circular>
      <v-card-title>Calculating...</v-card-title>
    </v-container>
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
              v-for="(n,i) in Object.keys(input)"
              :key="i"
              :label="`Pattern ${n}`"
              :value="n"
            ></v-radio>
          </v-radio-group>
        </v-card-actions>
    </v-card>
    <v-card outlined class="ma-2" width="400" max-width="500">
        <v-card-title>New pattern:</v-card-title>
        <v-divider/>
        <v-card-actions>
          <v-container>
          <v-card outlined class="pa-2">
            <v-text-field
            class="ma-0 mt-2"
            label="Equation elements"
            dense
            v-model="editableElements"
            prepend-inner-icon="mdi-marker"
          ></v-text-field>
          <v-text-field
            label="Equation signs"
            dense
            class="ma-0 mt-2"
            v-model="editableSigns"
            prepend-inner-icon="mdi-marker"
          ></v-text-field>
          <v-btn text color="primary" @click="addEquation">
          <v-icon class="mr-1">mdi-plus</v-icon> Add Equation row
          </v-btn>
          </v-card>
          <v-card outlined class="pa-2 mt-1">
          <v-text-field
            label="Equation vertical signs"
            dense
            class="ma-0 mt-2"
            v-model="editableInterSigns"
            prepend-inner-icon="mdi-marker"
          ></v-text-field>
          <v-btn text color="primary" @click="addVerticalSigns">
          <v-icon class="mr-1">mdi-plus</v-icon> Add Vertical Signs row
          </v-btn>
          </v-card>
          <v-layout class="ma-0" justify-center>
                <v-container class="mt-2 pa-0" >
                  <v-card-text class="ma-0">Rows</v-card-text>
                    <v-sheet tile class="pattern text-center white--text"
                    v-for="(item, index) in newPattern.horisontalPatterns"
                    color="primary"
                    :key="index">
                      {{outMatrixRow(item.signs,item.digits)}}
                      </v-sheet>
                      <v-divider/>
                      <v-card-text class="ma-0">Column signs</v-card-text>
                      <v-sheet tile class="pattern text-center white--text"
                    v-for="(item, index) in newPattern.verticalSigns"
                    color="primary"
                    :key="index">
                      {{item.toString().replace('[','').replace(']','').replace(/,/g,'  ')}}
                      <v-divider/>
                    </v-sheet>
                    <v-spacer/>
            <v-btn text color="primary" @click="savePattern">
              <v-icon class="mr-1">mdi-plus</v-icon> Save Pattern
            </v-btn>
                </v-container>
            </v-layout>
          </v-container>
        </v-card-actions>
    </v-card>
    <v-card outlined class="ma-2" width="400" max-width="500">
        <v-card-title>Evaluation Log</v-card-title>
        <v-divider/>
        <v-card-actions>
          <v-card flat  class="pa-2" scrollable >
            <span v-for="(item, index) in currentOperation"
            :key="index"
            class="number">
            {{ item }}<br>
            </span>
          </v-card>
        </v-card-actions>
    </v-card>
    <v-container class="pa-2">
    <v-card outlined class="ma-0 px-0">
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
    </v-container>
</v-layout>
</template>
<script>
/* eslint-disable */
import MatrixCell from './MatrixCell.vue';
import { buildExpression, latestAction, zipSignsNumbers, evaluateExpressionMatrix, transpose } from '../generator';

export default {
  components: {
    MatrixCell,
  },
  data: () => ({
    expr: '',
    results: [],
    loading: false,
    radioGroup: 1,
    currentOperation: latestAction,
    matrices: undefined,
    editableSigns: '',
    editableInterSigns: '',
    editableElements: '',
    newPattern:{
        horisontalPatterns:[],
        verticalSigns:[]
    },
    input: [
      {
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
      {
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
      {
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
      {
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
      {
        horisontalPatterns:[
          { digits:[5, '▢▢', '▢▢',], signs: ['+','='] },
          { digits:['▢', 5, '▢▢'], signs: ['+', '='] },
          { digits:['▢▢', 2, '▢▢'], signs: ['+', '='] },
          { digits:['▢▢', 35, '▢▢▢'], signs: ['*', '='] },
        ],
        verticalSigns:[
          ['+', '+','='],
          ['+', '+', '='],
          ['*', '+', '='],
        ],
      },
      {
        horisontalPatterns:[
          { digits:['▢', '▢', '▢▢',], signs: ['*','='] },
          { digits:['▢▢', '▢', '▢▢'], signs: ['-', '='] },
          { digits:['▢▢', '▢', '▢'], signs: ['/', '='] },
        ],
        verticalSigns:[
          ['+','='],
          ['-','='],
          ['-', '='],
        ]
      },
      {
        horisontalPatterns:[
          { digits:['▢','▢','▢','▢','▢',], signs: ['+','+','+','='] },
          { digits:['▢','▢','▢','▢','▢',], signs: ['-','-','-','='] },
          { digits:['▢','▢','▢','▢','▢',], signs: ['-','+','-','='] },
        ],
        verticalSigns:[
          ['+','='],
          ['-','='],
          ['+','='],
          ['-','='],
          ['+','=']
        ]
      },
    ],
    matrixData: [],
    editMatrixData: [],
  }),
  computed: {
    prettyPatterns() {
      let patternSet = [];
      let signs = transpose(this.input[this.radioGroup].verticalSigns);
      this.input[this.radioGroup].horisontalPatterns.map((element,index) => {
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
      this.currentOperation.length = 0;
      setTimeout(() => {
          let selectedMatrix = JSON.parse(JSON.stringify(this.input[this.radioGroup]));
          let res = evaluateExpressionMatrix(selectedMatrix);
          this.results = [...res];
          this.loading = false;
        }, 1000);
      
    },
    prettyPattern(index){
      return zipSignsNumbers(element.signs, element.digits);
    },
    outMatrixRow(index, value) {
      return zipSignsNumbers(index, value);
    },
    addEquation(){
      if(this.editableElements.split(',').length - this.editableSigns.split(',').length !== 1) {
        alert('Wrong equation input!');
      }
      else
      this.newPattern.horisontalPatterns.push({ digits:this.editableElements.split(','), signs: this.editableSigns.split(',') });
        
    },
    addVerticalSigns(){
      this.newPattern.verticalSigns.push(
        this.editableInterSigns.split(',')
      );
    },
    savePattern(){
      this.input.push(JSON.parse(JSON.stringify(this.newPattern)));
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