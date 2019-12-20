<template>
<v-container>
    <h1>Chat</h1>
    <p>{{ getIsPaired }}</p>
    <p>{{ getIsPairing }}</p>
    <p>{{ chat.name }}</p>
    <p>{{ getName }}</p>
    <div>
        <v-row>
            <v-col
            cols="12"
            sm="6"
            xs="12"
            >
                <v-btn
                class="success"
                block
                :loading="getIsPairing"
                :disabled="getIsPairing || getIsPaired"
                @click="pair()"
                >
                    <span
                    v-if="!getIsPaired">
                        配對
                    </span>
                    <span
                    v-if="getIsPaired">
                        配對成功
                    </span>
                </v-btn>
            </v-col>
            <!-- <v-col
            cols="12"
            sm="4"
            xs="12"
            >
                <v-btn
                class="info"
                block
                >
                    重新配對
                </v-btn>
            </v-col> -->
            <v-col
            cols="12"
            sm="6"
            xs="12"
            >
                <v-btn
                class="warning"
                block
                @click="unpair()"
                >
                    取消配對
                </v-btn>
            </v-col>
        </v-row>
    </div>
    <v-card
    class="chat-box"
    dark>
        <div v-for="(msg, index) in getChats"
             :key="index">
            <span
            :class="{ 'red--text': chat.name == msg.name }">
                {{ msg.name }}: {{ msg.content }}
            </span>
        </div>
    </v-card>

    <v-form
    class="msg-form"
    ref="chatForm"
    v-model="chatValid"
    lazy-validation
    @submit.prevent="sendMsg(chat)"
    >
        <v-container>
            <v-row>
                <v-col
                cols="12"
                sm="10"
                xs="12"
                >
                    <v-text-field
                      v-model="chat.content"
                      :counter="100"
                      :rules="contentRules"
                      label="輸入訊息..."
                      required
                      ref="chatContentRef"
                    ></v-text-field>
                </v-col>
                <v-col
                cols="12"
                sm="2"
                xs="12">
                    <v-tooltip 
                    top
                    :disabled="getIsPaired">
                        <template 
                        v-slot:activator="{ on }">
                            <div
                            v-on="on">
                                <v-btn
                                class="yellow darken-2"
                                type="submit"
                                block
                                :disabled="!getIsPaired">
                                    <v-icon>mdi-send</v-icon>
                                </v-btn>
                            </div>
                        </template>
                            <span>請先配對</span>
                    </v-tooltip>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</v-container>
</template>

<script>

export default {
    name: 'chat',
    components: {},
    data: function() {
        return {
            chat: {
                name: '',
                content: ''
            },
            chatValid: false,
            contentRules: [
                v => !!v || '不可為空',
                v => (v && v.length <= 100) || '超過100個字',
            ]
        }
    },
    computed: {
        getSocket: function() {
            return this.$store.getters['socket/getData']
        },
        getName: function() {
            return this.$store.getters['socket/getName']
        },
        getContent: function() {
            return this.$store.getters['socket/getContent']
        },
        getIsPaired: function() {
            return this.$store.getters['socket/getIsPaired']
        },
        getIsPairing: function() {
            return this.$store.getters['socket/getIsPairing']
        },
        getChats: function() {
            return this.$store.getters['socket/getChats']
        },
    },
    mounted: function() {
        let name = this.getName || localStorage.getItem('name')
        if(name) {
            this.chat.name = name;
        }

        if(this.getContent) {
            this.chat.content = this.getContent;
        }

        // focus input
        this.$nextTick(() => {
            this.$refs.chatContentRef.focus();
        });
    },
    beforeDestroy: function() {
        this.setContent(this.chat.content);
    },
    methods: {
        pair: function() {
            console.log('配對')

            // 配對中
            // this.isPairing = true
            this.setIsPairing(true)

            try {
                this.getSocket.emit('pair')
            } catch {
                // this.isPairing = false
                this.setIsPairing(false)
                console.error('配對失敗')
            }
        },
        unpair: function() {
            console.log('取消配對')

            try {            
                this.getSocket.emit('unpair')
            } catch {                
                console.error('取消配對失敗')
            }
        },
        sendMsg: function(chat) {
            try {
                this.getSocket.emit('chat', chat)
            } catch {
                console.error('傳送資料失敗')
            }
        },
        setIsPaired: function(boolean) {
            this.$store.commit('socket/setIsPaired', boolean)
        },
        setIsPairing: function(boolean) {
            this.$store.commit('socket/setIsPairing', boolean)
        },
        clearChats: function() {
            this.$store.commit('socket/setChats', [])
        },
        setContent: function(content) {
            this.$store.commit('socket/setContent', content)
        },
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