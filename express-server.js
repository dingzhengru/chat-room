const express = require('express');
const app = express();
const cors = require('cors');
const history = require('connect-history-api-fallback');

// 允許跨站存取
app.use(cors())
app.use(history());

app.use(express.static('dist'))

// set app > http > socket.io
const http = require('http').createServer(app);
const io = require('socket.io')(http);

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