大廳: 公開的多人聊天室 (firebase)
聊天室: 一對一配對的聊天室 (socket.io)

- [demo](#demo)
- [linux 安裝 node.js](#linux-安裝-nodejs)
- [永久運行 node.js server](#永久運行-nodejs-server)
- [socket.io](#socketio)
  - [install](#install)
  - [connection](#connection)
  - [socket.on](#socketon)
  - [chat](#chat)
  - [pair](#pair)
  - [unpair](#unpair)
  - [disconnect](#disconnect)
- [express-server.js](#express-serverjs)
- [Vuetify.js](#vuetifyjs)
  - [v-bottom-navigation](#v-bottom-navigation)
  - [v-tooltip](#v-tooltip)

## demo

- https://ding-chat-room.herokuapp.com/

## linux 安裝 node.js

- setup\_版本.x

```
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

or

sudo apt-get install nodejs

```

## 永久運行 node.js server

- 使用 forever 這個 library
- forever npm: https://www.npmjs.com/package/forever

```
sudo npm install -g forever

forever start server.js

// 設定最大重啟次數(m5 = 5次)
forever -m5 server.js

// 可以看正在運行中程序列表(會列出各個id)
forever list

// 根據上面所列的 ID，指定要停止的程序
forever stop 0

// 同上，只是重新啟動
forever restart 0

// 重啟、停止全部
forever stopall
forever restartall
```

## socket.io

### install

`npm install --save socket.io`

server.js (with express)

```
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

http.listen(3000, function(){
    console.log('listening on :3000');
});
```

client.js

```
import io from 'socket.io-client';

url = 'http://localhost:3000';

let socket = io(url);
```

### connection

- 連上時觸發，並可在裡面設置自訂的事件並監聽
  server.js

```
io.on('connection', function(socket){
    console.log('a user connected');
});
```

### socket.on

- 自訂事件並監聽、傳資料、廣播

server.js

```
io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('chat message', function(msg){
        console.log('message: ' + msg);

        // 傳送資料
        io.emit('chat message', msg);
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});
```

client

```
socket.on('chat message', function(msg){
    console.log('message: ' + msg);
});
```

### chat

- client: 單純把輸入的內容傳給 server
- server: 把接收到的 msg 發送給此 socket 與 socket.pairUser

client

```
this.getSocket.on('chat', (chat) => {
    console.log(chat.content)
    this.chats.push(chat)
})
```

server

```
socket.on('chat', chat => {
    // 確認配對
    if(!socket.pairUser)
        return
    socket.emit('chat', chat)
    socket.pairUser.emit('chat', chat)
})
```

### pair

- client: 單純發送一個信號，表示要配對而已(沒有傳任何資料)
- server: 進行配對，並把配對的對象存到 socket.pairUser，且要把對方的 pairUser 也存進我方的 socket

client

```
this.getSocket.on('pair', (isPaired) => {
    // 配對事件回傳
    this.isPaired = truedis
    this.isPairing = false
})
```

server

```
const pairTime = 3000

socket.on('pair', pairMsg => {
    // 設置配對中
    socket.isPairing = true

    console.log('paring list', users.map(user => user.isPairing))

    // 不斷搜尋配對對象
    let pairInterval = setInterval(() => {
        if(!socket.isPairing) {
            clearInterval(pairInterval)
            return
        }

        console.log(`${ socket.id } is pairing`)

        // 配對條件: 不是自己 && 對方也在配對中(isPairing)
        socket.pairUser = users.find(user => user.id != socket.id && user.isPairing) || null

        if(socket.pairUser) {
            console.log(`pair success: ${ socket.id }, ${ socket.pairUser.id }`)

            // 回傳給前端配對成功的訊息(對面的也要)
            socket.emit('pair', true)
            socket.pairUser.emit('pair', true)

            // 也把對面的pairUser也設置好
            socket.pairUser.pairUser = socket

            socket.isPairing = false
            socket.pairUser.isPairing = false

            console.log(users.map(user => user.isPairing))
        }
    }, pairTime)
});
```

### unpair

client

```
this.getSocket.on('unpair', (pairMsg) => {
    // 解除配對

    // 設置訊息
    if(this.getSocket.id != pairMsg.socketId) {
        this.info = `對方${ pairMsg.content }`
    } else {
        this.info = `${ pairMsg.content }`
    }

    // 顯示訊息
    this.isShowInfo = true

    // 正在配對 與 已配對 設為 false
    this.setIsPaired(false)
    this.setIsPairing(false)
})
```

server

```
socket.on('unpair', () => {
    // 解除配對

    // 把解除配對的 socketId 與 原因傳給前端
    pairMsg = {
        socketId: socket.id,
        content: '已取消配對'
    }
    // 確認是否已有配對
    if(socket.pairUser) {
        socket.pairUser.isPairing = false
        socket.pairUser.pairUser = null
        socket.pairUser.emit('unpair', pairMsg)
    }
    socket.isPairing = false
    socket.pairUser = null
    socket.emit('unpair', pairMsg)
})
```

### disconnect

server

```
socket.on('disconnect', () =>{

    // 離線前先解除配對

    // 把解除配對的 socketId 與 原因傳給前端
    pairMsg = {
        socketId: socket.id,
        content: '已離線'
    }

    // 確認是否已有配對
    if(socket.pairUser) {
        socket.pairUser.isPairing = false
        socket.pairUser.pairUser = null
        socket.pairUser.emit('unpair', pairMsg)
    }

    socket.isPairing = false
    socket.pairUser = null
    socket.emit('unpair', pairMsg)

    // 刪除該使用者
    let index = users.indexOf(socket)
    if(index > -1) {
        users.splice(index, 1)
    }
});
```

## express-server.js

- socket.io server & serve dist server

```
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');
const history = require('connect-history-api-fallback');

app.use(express.static('dist'))

// 允許跨站存取
app.use(cors())
app.use(history());
// io.set('origins', '*:*');

const port = process.env.PORT || 8080

const users = [] // 存放在連線中的所有使用者
const pairTime = 3000 // 多久配對一次


// 用於在解除配對時，告訴前端是誰解除的，原因又是如何
let pairMsg = {
    socketId: null,
    content: ''
}

// 配對
    // pairUser 設在 socket.pairUser

    // 對方的pairUser也要設置 自己的這個socket
    // socket.pairUser.pairUser = socket

// chat
    // 自己與雙方都各自emit
    // socket.emit
    // socket.pairUser.emit

io.on('connection', function(socket){
    console.log('a user connected');

    // 先幫每個 socket.pair 設個初始值
    socket.pairUser = null

    // 是否正在尋找配對
    socket.isPairing = false

    // 加進使用者列表
    users.push(socket)

    console.log('online users:', users.map(user => user.id))
    console.log('online users:', users.length)

    // console.log(users.map(user => user.isPairing))

    // 配對
    socket.on('pair', pairMsg => {
        // 設置配對中
        socket.isPairing = true

        console.log('paring list', users.map(user => user.isPairing))

        // 不斷搜尋配對對象
        let pairInterval = setInterval(() => {
            if(!socket.isPairing) {
                clearInterval(pairInterval)
                return
            }

            console.log(`${ socket.id } is pairing`)

            // 配對條件: 不是自己 && 對方也在配對中(isPairing)
            socket.pairUser = users.find(user => user.id != socket.id && user.isPairing) || null

            if(socket.pairUser) {
                console.log(`pair success: ${ socket.id }, ${ socket.pairUser.id }`)

                // 回傳給前端配對成功的訊息(對面的也要)
                socket.emit('pair', true)
                socket.pairUser.emit('pair', true)

                // 也把對面的pairUser也設置好
                socket.pairUser.pairUser = socket

                socket.isPairing = false
                socket.pairUser.isPairing = false

                console.log(users.map(user => user.isPairing))
            }
        }, pairTime)
    });

    // 自訂事件名稱並監聽其事件
    socket.on('chat', chat => {
        console.log(`chat from ${ socket.id } ${ chat.name }: ${ chat.content } `);
        // 確認配對
        if(!socket.pairUser)
            return
        socket.emit('chat', chat)
        socket.pairUser.emit('chat', chat)
    });

    socket.on('unpair', () => {
        // 解除配對

        // 把解除配對的 socketId 與 原因傳給前端
        pairMsg = {
            socketId: socket.id,
            content: '已取消配對'
        }
        // 確認是否已有配對
        if(socket.pairUser) {
            socket.pairUser.isPairing = false
            socket.pairUser.pairUser = null
            socket.pairUser.emit('unpair', pairMsg)
        }
        socket.isPairing = false
        socket.pairUser = null
        socket.emit('unpair', pairMsg)
    })

    socket.on('disconnect', () =>{
        console.log('user disconnected', socket.id);

        // 離線前先解除配對

        // 把解除配對的 socketId 與 原因傳給前端
        pairMsg = {
            socketId: socket.id,
            content: '已離線'
        }

        // 確認是否已有配對
        if(socket.pairUser) {
            socket.pairUser.isPairing = false
            socket.pairUser.pairUser = null
            socket.pairUser.emit('unpair', pairMsg)
        }

        socket.isPairing = false
        socket.pairUser = null
        socket.emit('unpair', pairMsg)

        // 離線就刪除該使用者
        let index = users.indexOf(socket)
        if(index > -1) {
            users.splice(index, 1)
        }
    });
});


http.listen(port, function(){
    console.log(`listening on :${ port }`);
});
```

## Vuetify.js

- Vue Material Design Component Framework(質感設計框架)
- icons 都在 https://materialdesignicons.com/ (在 v-icon 裡填入"mdi-圖片名稱")

vue cli 3
`vue add vuetify`

### v-bottom-navigation

- bug 修復需在 style 裡+上以下這段

```
.v-item-group.v-bottom-navigation .v-btn.v-size--default {
    height: inherit;
}
```

### v-tooltip

- 如何在 disabled button 上顯示(btn 外多包一個 div，且 v-on 放在 div 上)

如何在 disabled button 上顯示

```
<v-tooltip
top
:disabled="isPaired">
    <template
    v-slot:activator="{ on }">
        <div
        v-on="on">
            <v-btn
            class="yellow darken-2"
            type="submit"
            block
            :disabled="!isPaired">
                <v-icon>mdi-send</v-icon>
            </v-btn>
        </div>
    </template>
        <span>請先配對</span>
</v-tooltip>
```
