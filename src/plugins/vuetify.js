import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    themes: {
      light: {
        primary: '#009688', // #E53935
        secondary: '#004D40', // #FFCDD2
        accent: '#00BFA5', // #3F51B5
      },
    },
  },
});
