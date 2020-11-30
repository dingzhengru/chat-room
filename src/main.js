import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

// socket
import io from 'socket.io-client';

// const host = 'http://localhost';
// const port = '80';
// const url = `${host}:${port}`;

const socket = io();
// let socket = io()

new Vue({
  router,
  store,
  vuetify,
  beforeCreate: function() {
    // set lobby data to store
    this.$store.dispatch('lobby/getDataAction').then(data => {});

    // watch lobby
    this.$store.dispatch('lobby/setWatchDataAction');

    // socket
    socket.on('connect', () => {
      // console.log(socket.connected, '已連線'); // true

      this.$store.dispatch('socket/setDataAction', socket).then(data => {
        setTimeout(() => {
          this.scrollToBottom();
        }, 1000);
      });
    });
  },
  methods: {
    scrollToBottom: function() {
      let scrollingElement = document.scrollingElement || document.body;
      scrollingElement.scrollTop = scrollingElement.scrollHeight;
    },
  },
  render: h => h(App),
}).$mount('#app');
