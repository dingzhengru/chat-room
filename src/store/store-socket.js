// import { db, firebase } from '../firebase.js'

import io from 'socket.io-client';

// socket object

export default {
    namespaced: true,
    state: {
        data: null,
        name: '',
        content: '',
        isPaired: false,
        isPairing: false,
        chats: [],
    },
    getters: {
        getData: (state) => {
            return state.data;
        },
        getName: (state) => {
            return state.name;
        },
        getContent: (state) => {
            return state.content;
        },
        getChat: (state) => {
            return state.chat;
        },
        getIsPaired: (state) => {
            return state.isPaired;
        },
        getIsPairing: (state) => {
            return state.isPairing;
        },
        getChats: (state) => {
            return state.chats;
        },
    },
    mutations: {
        setData(state, payload) {
            state.data = payload;
        },
        setName(state, payload) {
            state.name = payload;
        },
        setContent(state, payload) {
            state.content = payload;
        },
        setChat(state, payload) {
            state.chat = payload;
        },
        setIsPaired(state, payload) {
            state.isPaired = payload;
        },
        setIsPairing(state, payload) {
            state.isPairing = payload;
        },
        setChats(state, payload) {
            state.chats = payload;
        },
        pushChats(state, payload) {
            state.chats.push(payload)
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
    }
}


