const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

const users = [] // 存放在連線中的所有使用者

// 連上時
io.on('connection', function(socket){
    console.log('a user connected');


    users.push(socket)

    console.log('online users:', users.map(user => user.id))

    // 自訂事件名稱並監聽其事件
    socket.on('lobby', msg => {
        console.log(`lobby from ${ socket.id }: ${ msg } `);

        socket.emit('lobby', `server: you send this: '${ msg }'`)

    });

    socket.on('disconnect', () =>{
        console.log('user disconnected', socket.id);

        // 離線就刪除該使用者
        let index = users.indexOf(socket)
        if(index > -1) {
            users.splice(0, index)
        }
    });
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});