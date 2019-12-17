*  <a href="#socketio">socket.io</a>
    *  <a href="#install">install</a>
    *  <a href="#connection">connection</a>
    *  <a href="#socketon">socket.on</a>
*  <a href="#express-serverjs">express-server.js</a>
*  <a href="#vuetifyjs">Vuetify.js</a>
    *  <a href="#v-bottom-navigation">v-bottom-navigation</a>

## socket.io

### install
```npm install --save socket.io```

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
*  連上時觸發，並可在裡面設置自訂的事件並監聽
server.js
```
io.on('connection', function(socket){
    console.log('a user connected');
});
```


### socket.on
*  自訂事件並監聽、傳資料、廣播

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

## express-server.js



## Vuetify.js
*  Vue Material Design Component Framework(質感設計框架)
*  icons 都在 https://materialdesignicons.com/ (在v-icon裡填入"mdi-圖片名稱")

vue cli 3
```vue add vuetify```


### v-bottom-navigation
*  bug 修復需在 style 裡+上以下這段

```
.v-item-group.v-bottom-navigation .v-btn.v-size--default {
    height: inherit;
}
```