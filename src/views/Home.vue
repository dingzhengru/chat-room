<template>
<v-container>
    <h1>聊天大廳</h1>
    <v-card
    class="chat-box">
        <!-- 這裡把每個 msg 都加上一個 isMax 來判斷是否要放大-->
        <div v-for="(msg, index) in getLobby"
             :key="index"
             class="d-flex">
            <div
            class="mt-2 ml-2">
                <v-avatar 
                :size="32"
                :width="140"
                tile
                :class="{ 
                    'indigo': getSocket.id == msg.socketId,
                    'green': getSocket.id != msg.socketId 
                }"
                >
                    <span class="white--text headline">
                        {{ msg.name }}
                    </span>
                </v-avatar>
                <span>
                    {{ msg.content }}
                </span>
            </div>
        </div>
    </v-card>

    <v-form
    class="msg-form"
    ref="lobbyForm"
    v-model="lobbyValid"
    lazy-validation
    @submit.prevent="sendMsg(lobby)"
    >
        <v-container>
            <v-row>
                <v-col
                cols="12"
                sm="10"
                xs="12"
                >
                    <v-text-field
                    v-model="lobby.content"
                    :counter="100"
                    :rules="contentRules"
                    label="輸入訊息..."
                    required
                    ref="lobbyContentRef"
                    ></v-text-field>
                </v-col>
                <v-col
                cols="12"
                sm="2"
                xs="12">
                    <v-btn
                    class="yellow darken-2"
                    type="submit"
                    block>
                        <v-icon>mdi-send</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</v-container>
</template>

<script>

// import io from 'socket.io-client';
// import socketOptions from '../socket-options.js'

export default {
    name: 'home',
    components: {},
    data: function() {
        return {
            lobby: {
                socketId: null,
                name: null,
                content: '',
            },
            avatarClass: {
                size: 32,
                tile: false,
                width: null,
            },
            isShowInputName: true,
            lobbyValid: false,
            contentRules: [
                v => !!v || '不可為空',
                v => (v && v.length <= 100) || '超過100個字',
            ]
        }
    },
    computed: {
        getLobby: function() {
            return this.$store.getters['lobby/getData']
        },
        getName: function() {
            return this.$store.getters['socket/getName']
        },
        getContent: function() {
            return this.$store.getters['lobby/getContent']
        },
        getSocket: function() {
            return this.$store.getters['socket/getData']
        },
    },
    mounted: function() {
        if(this.getName) {
            this.lobby.name = this.getName;
        }

        if(this.getContent) {
            this.lobby.content = this.getContent
        }

        // focus input
        this.$nextTick(() => {
            this.$refs.lobbyContentRef.focus();
        });
    },
    beforeDestroy: function() {
        this.setContent(this.lobby.content);
    },
    methods: {
        sendMsg: function(lobby) {
            if(this.lobbyValid && lobby && this.getName) {
                this.lobby.socketId = this.getSocket.id
                this.lobby.name = this.getName
                this.$store.dispatch('lobby/addDataAction', lobby)
                .then(() => {
                    this.clearLobbyContent()
                })
            }
        },
        clearLobbyContent: function() {
            this.lobby.content = ''
        },
        setContent: function(content) {
            this.$store.commit('lobby/setContent', content)
        }
    }
}
</script>

<style lang="scss">

.chat-box {
    margin-bottom: 100px;
    padding-bottom: 75px;
}

.msg-form {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: skyblue;
    padding-left: 80px;
}

</style>