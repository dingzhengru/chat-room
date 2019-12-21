<template>
<v-container>
    <h1>聊天室</h1>
    <blockquote class="blockquote">
        配對對象: 正在等待配對的使用者中隨機選取一位
    </blockquote>
    <!-- <p>{{ getIsPaired }}</p>
    <p>{{ getIsPairing }}</p>
    <p>{{ getName }}</p>
    <p>{{ getSocket.id }}</p> -->
    <div>
        <v-row>
            <v-col
            cols="12"
            sm="5"
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
            <v-col
            cols="12"
            sm="5"
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
            <v-col
            cols="12"
            sm="2"
            xs="12"
            >
                <v-btn
                class="error"
                block
                @click="clearChats()"
                >
                    清空
                </v-btn>
            </v-col>
        </v-row>
    </div>
    <v-card
    class="chat-box"
    >
        <!-- <div v-for="(msg, index) in getChats"
             :key="index">
            <span
            :class="{ 'red--text': getSocket.id == msg.id }">
                {{ msg.name }}: {{ msg.content }}
            </span>
        </div> -->
        <!-- 這裡把每個 msg 都加上一個 isMax 來判斷是否要放大-->
        <div v-for="(msg, index) in getChats"
             :key="index"
             class="d-flex">
            <div
            class="mt-2 ml-2">
                <v-avatar 
                :size="32"
                :width="msg.isMax ? 150 : null"
                :tile="msg.isMax ? true : false"
                :class="{ 
                    'indigo': getSocket.id == msg.socketId,
                    'green': getSocket.id != msg.socketId 
                }"
                @mouseover="mouseoverAvatar(msg)"
                @mouseleave="mouseleaveAvatar(msg)"
                >
                    <span 
                    class="white--text headline"
                    v-show="!msg.isMax">
                        {{ getMiniName(msg.name) }}
                    </span>
                    <span 
                    class="white--text headline"
                    v-show="msg.isMax">
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
    ref="chatForm"
    v-model="chatValid"
    lazy-validation
    @submit.prevent="sendMsg(content)"
    >
        <v-container>
            <v-row>
                <v-col
                cols="12"
                sm="10"
                xs="12"
                >
                    <v-text-field
                      v-model="content"
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
            content: '',
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
        // let name = this.getName || localStorage.getItem('name')
        // if(name) {
        //     this.chat.name = name;
        // }

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
        sendMsg: function(content) {
            let chat = {
                socketId: this.getSocket.id,
                name: this.getName,
                content: this.content
            }
            try {
                this.getSocket.emit('chat', chat)
                this.clearChatContent()
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
            if(confirm('確定清空嗎'))
                this.$store.commit('socket/setChats', [])
        },
        setContent: function(content) {
            this.$store.commit('socket/setContent', content)
        },
        clearChatContent: function() {
            this.content = ''
        },
        mouseoverAvatar: function(msg) {
            this.$set(msg, 'isMax', true)
        },
        mouseleaveAvatar: function(msg) {
            this.$set(msg, 'isMax', false)
        },
        getMiniName: function(name) {
            return name.substring(0, 1)
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