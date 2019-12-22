import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

// socket
import io from 'socket.io-client';
import socketOptions from './socket-options.js'

// let socket = io(socketOptions.url)
let socket = io('https://8080-dot-10296537-dot-devshell.appspot.com/?environment_id=default')
// let socket = io('114.38.103.71:50001')
// let socket = io('34.97.218.13:3000')

new Vue({
    router,
    store,
    vuetify,
    beforeCreate: function() {

        // set lobby data to store
        this.$store.dispatch('lobby/getDataAction')
        .then(data => {

        })

        // watch lobby
        this.$store.dispatch('lobby/setWatchDataAction')


        // socket
        socket.on('connect', () => {
            console.log(socket.connected, '已連線'); // true

            this.$store.dispatch('socket/setDataAction', socket)
            .then(data => {
                console.log(data.id)
            })
        }); 
    },
    render: h => h(App)
}).$mount('#app')
