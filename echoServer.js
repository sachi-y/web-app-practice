const { connect } = require('http2')
const net = require('net')

const PORT = 3000

// createServerという関数を呼び出す
net.createServer((socket) => {
    // 接続されたことを表示する
    console.log('connected')

    //データを受け取ったら何をするか設定する
    socket.on('data', (data) => {
        // 受け取ったデータを表示する
        console.log(`received: ${data}`)
        // 受け取ったデータをそのまま返す
        socket.write(data)

        //接続が閉じたら何をするか設定する
        socket.on('close', () => {
            console.log('connection closed')
        })
    })
})
// ポートを指定して、サーバを起動する
.listen(PORT, '127.0.0.1')

console.log(`Server started on port ${PORT}`)