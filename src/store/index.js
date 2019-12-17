import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import lobby from './store-firebase-lobby.js'
import socket from './store-socket.js'
export default new Vuex.Store({
    state: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        lobby: lobby,
        socket: socket
    }
})
