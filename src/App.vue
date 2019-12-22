<template>
<v-app>
    <v-content class="main-content">
        <v-alert 
        type="info"
        dismissible
        v-model="isShowInfo">
            {{ info }}
        </v-alert>
        <router-view/>
    </v-content>

    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      fixed
      permanent
      expand-on-hover
    >
        <v-list-item>
            <v-list-item-avatar>
                <v-avatar 
                v-show="mini"
                color="indigo" 
                size="48">
                    <span class="white--text headline">{{ getMiniName }}</span>
                </v-avatar>
                <v-avatar 
                v-show="!mini"
                color="indigo" 
                :min-width="150"
                tile>
                    <span class="white--text headline">{{ getName }}</span>
                </v-avatar>
            </v-list-item-avatar>
            <!-- <v-list-item-title>
                <v-btn
                icon>
                    <v-icon>mdi-view-list</v-icon>
                </v-btn>
            </v-list-item-title> -->

        <!-- <v-btn
        icon
        @click.stop="mini = !mini">
            <v-icon>mdi-chevron-left</v-icon>
        </v-btn> -->
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense>
            <v-list-item
              v-for="item in items"
              :key="item.title"
              link
              :to="item.path"
            >
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
    
    <!-- Modal -->

    <!-- <v-btn
      color="primary"
      dark
      @click.stop="isShowModal = true"
    >
      Open Dialog
    </v-btn> -->

    <v-dialog
      v-model="isShowModal"
      max-width="400"
      persistent
    >
        <v-card>
            <v-card-title class="headline">設定暱稱</v-card-title>

            <v-card-text>
                <v-form
                class="name-form"
                ref="form"
                v-model="nameValid"
                @submit.prevent="sendName(name)"
                >

                    <v-text-field
                      v-model="name"
                      ref="nameInputRef"
                      :counter="8"
                      :rules="nameRules"
                      label="輸入暱稱..."
                      required
                    ></v-text-field>

                    <v-btn
                    class="blue darken-2"
                    type="submit"
                    :disabled="!nameValid"
                    block>
                        <v-icon>mdi-send</v-icon>
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';

export default {
    name: 'App',
    components: {},
    data: function() {
        return {
            name: '',
            info:'',
            isShowInfo: false,
            avatarWidth: 200,
            isShowModal: true,
            drawer: true,
            items: [
              { title: '大廳', icon: 'mdi-home', path: '/' },
              { title: '聊天', icon: 'mdi-chat', path: 'chat' },
            ],
            mini: true,
            nameValid: false,
            nameRules: [
                v => !!v || '不可為空',
                v => (v && v.length <= 8) || '不能超過8個字',
            ],
        }
    },
    computed: {
        getSocket: function() {
            return this.$store.getters['socket/getData']
        },
        getName: function() {
            return this.$store.getters['socket/getName']
        },
        getMiniName: function() {
            let name = this.$store.getters['socket/getName']
            return name.substring(0, 1)
        },
    },
    mounted: function() {
        // localStorage.clear();

        // get name from localStorage
        let name = localStorage.getItem('name') || null
        if(name) {
            this.name = name
            this.setName(name)
        }

        // focus name input
        this.$nextTick(() => {
            this.$refs.nameInputRef.focus();
        });

        // set socket(chat event)
        this.setSocketChecker(() => {
            console.log('set socket.on')

            this.getSocket.on('pair', (isPaired) => {
                // 配對成功
                this.setIsPaired(true)
                this.setIsPairing(false)
            })

            this.getSocket.on('unpair', (pairMsg) => {
                // 解除配對

                console.log('已解除配對', pairMsg)

                if(this.getSocket.id != pairMsg.socketId) {
                    this.info = `對方${ pairMsg.content }`
                    this.isShowInfo = true
                } else {
                    this.info = `${ pairMsg.content }`
                    this.isShowInfo = true
                }

                this.setIsPaired(false)
                this.setIsPairing(false)
            })

            this.getSocket.on('chat', chat => {
                this.pushChats(chat)
            })
        })
    },
    beforeDestroy: function() {
        this.getSocket.removeAllListeners()
        this.getSocket.disconnect()
    },
    methods: {
        setName: function(name) {
            // set localStorage
            // set store-socket.name
            if(this.nameValid && 
               name &&
               name.length <= 8) {
                localStorage.setItem('name', name)
                this.$store.commit('socket/setName', name)
                return true
            }
            return false
        },
        sendName: function(name) {
            let nameIsOk = this.setName(name)
            if(nameIsOk)
                this.isShowModal = false
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
        pushChats: function(chat) {
            this.$store.commit('socket/pushChats', chat)
        },
        setSocketChecker: function(callback) {
            let time = 5000

            let checker = setInterval(() => {
                try {
                    console.log('wait socket connect', this.getSocket)
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
};
</script>

<style lang="scss">

.main-content {
    padding-left: 80px !important;
}

.v-item-group.v-bottom-navigation .v-btn.v-size--default {
    height: inherit;
}

</style>

