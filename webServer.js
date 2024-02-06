const net = require('net')
const fs = require('fs')

const PORT = 3000

net
  // 接続されたら何をするか設定する
  .createServer((socket) => {
    // まずは接続されたことを表示する
    console.log('connected')

    // データを受け取ったら何をするかを設定する
    socket.on('data', (data) => {
      const httpRequest = data.toString()
      // HTTPコードを改行\で分割し、１行目[0]を取り出す
      const requestLine = httpRequest.split(`\r\n`)[0]
      console.log(requestLine)

      // ファイル名をHTTPリクエストから抽出
      const path = requestLine.split(' ')[1]
      console.log(path)

      // endWith=最後のパスが/が正?の時、pathの最後にindex.htmlを加える。否:の時、pathそのまま
      const requestFile = path.endsWith('/') ? path + 'index.html' : path

      // !=not ファイルが存在しなかったとき
      if (!fs.existsSync(`.${requestFile}`)) {
        const httpResponse = `HTTP/1.1 404 Not Found
content-length: 0

`
        socket.write(httpResponse)
        return
      }
        // socket=リアルタイムでの通信 httpResponseの内容をリアルタイムで書き込む

      // pathが/index.htmlなら、./index.htmlとして相対パスを作る
      const fileContent = fs.readFileSync(`.${requestFile}`)
      const httpResponse = `HTTP/1.1 200 OK
content-length: ${fileContent.length}

${fileContent}`
      socket.write(httpResponse)
    })

    // 接続が閉じたら何をするか設定する
    socket.on('close', () => {
      console.log(`connection closed`)
    })
  })
  // ポートを指定して、サーバを起動する
  .listen(PORT, '127.0.0.1')

// サーバが起動したことを表示する
console.log(`Server started on port ${PORT}`)
