<template>
    <div class="home">
        <h1>Chat Room</h1>
        <p>serverMsg: {{ serverMsg }}</p>
        <p>you send lobbyMsg: {{ lobbyMsg }}</p>

        <form @submit.prevent="sendLobbyMsg(lobbyMsg)">
            <input type="text" 
                   v-model="lobbyMsg"> 
            <button type="submit">送出訊息</button>
        </form>
    </div>
</template>

<script>
import io from 'socket.io-client';

import socketOptions from '../socket-options.js'

export default {
    name: 'home',
    components: {},
    data: function() {
        return {
            serverMsg: '',
            lobbyMsg: 'default msg',
            socket: io(socketOptions.url)
        }
    },
    mounted: function() {
        console.log('home')

        console.log(this.socket)

        this.socket.on('lobby', serverMsg => {
            this.serverMsg = serverMsg
        })
    },
    methods: {
        sendLobbyMsg: function(msg) {
            this.socket.emit('lobby', msg)
        }
    }
}
</script>
