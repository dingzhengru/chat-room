<template>
<v-container>
    <h1>Chat</h1>
    <h2>在來要配對</h2>
    <v-card
    class="chat-box"
    dark>
        <div v-for="(msg, index) in chats"
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
                      :contentes="contentRules"
                      label="輸入訊息..."
                      required
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

export default {
    name: 'chat',
    components: {},
    data: function() {
        return {
            chat: {
                name: '',
                content: ''
            },
            chats: [],
            isPaired: false,
            chatValid: false,
            contentRules: [
                v => !!v || '不可為空',
                v => (v && v.length <= 100) || '不能超過100個字',
            ]
        }
    },
    computed: {
        getSocket: function() {
            return this.$store.getters['socket/getData']
        },
    },
    mounted: function() {
        if(this.getName()) {
            this.chat.name = this.getName();

            this.chats.push({
                name: this.chat.name,
                content: '123',
            })
        }



        this.setSocketChecker(() => {
            console.log('set socket.on(chat)')

            this.getSocket.on('chat', (chat) => {
                console.log(chat.content)
                this.chats.push(chat)
            })
        })
    },
    methods: {
        sendMsg: function(chat) {
            this.getSocket.emit('chat', chat)
        },
        setName: function(name) {
            // set localStorage
            if(this.nameValid && name) {
                localStorage.setItem('name', name)
                this.isShowModal = false
            }
        },
        getName: function() {
            // get localStorage
            return localStorage.getItem('name')
        },
        setSocketChecker: function(callback) {
            let time = 300

            let checker = setInterval(() => {
                try {
                    console.log('wait socket connect')
                    if(this.getSocket) {
                        callback()
                        clearInterval(checker)
                    }
                } catch {
                    clearInterval(checker)
                }
            }, time)
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
}

</style>