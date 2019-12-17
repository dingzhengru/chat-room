<template>
<v-app>
    <v-content>
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

            <v-list-item-title>
                <v-btn
                icon>
                    <v-icon>mdi-view-list</v-icon>
                </v-btn>
            </v-list-item-title>

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
                @submit.prevent="setName(name)"
                >

                    <v-text-field
                      v-model="name"
                      ref="nameInputRef"
                      :counter="10"
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
            drawer: true,
            items: [
              { title: '大廳', icon: 'mdi-home', path: '/' },
              { title: '聊天', icon: 'mdi-chat', path: 'chat' },
            ],
            mini: true,
            name: '',
            isShowModal: false,
            nameValid: false,
            nameRules: [
                v => !!v || '不可為空',
                v => (v && v.length <= 10) || '不能超過10個字',
            ],
        }
    },
    computed: {
    },
    mounted: function() {
        // localStorage.clear();

        // get name from localStorage
        if(this.getName()) {
            this.name = this.getName();
        }

        // focus name input
        // this.$nextTick(() => {
        //     this.$refs.nameInputRef.focus();
        // });
    },
    methods: {
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
        }
    }
};
</script>

<style lang="scss">


.v-item-group.v-bottom-navigation .v-btn.v-size--default {
    height: inherit;
}

</style>

