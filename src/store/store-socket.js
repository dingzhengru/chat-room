// import { db, firebase } from '../firebase.js'

import io from 'socket.io-client';
import socketOptions from '../socket-options.js'

// socket object

export default {
    namespaced: true,
    state: {
        data: null,
    },
    getters: {
        getData: (state) => {
            console.log(state.data)
            return state.data;
        },
    },
    mutations: {
        setData(state, payload) {
            state.data = payload;
        },
    },
    actions: {
        setDataAction({ state, commit }, payload) {
            let data = payload;
            return new Promise((resolve, reject) => {
                commit('setData', data)
                resolve(data)
            })
        },
        connectAction({ state, commit }, payload) {
            return new Promise((resolve, reject) => {
                let socket = io(socketOptions.url)
                commit('setData', socket)
                resolve(socket)
            })
        },
    }
}


