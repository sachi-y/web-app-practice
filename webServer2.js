const http = require('http')
const fs = require('fs')

const PORT = 3000

// コールバック関数
// httpパッケージ内のcreateServer
// 接続(Enter)毎ではなく、request毎にまとまった単位で処理を行う
http
    .createServer((request, response) => {
        const method = request.method
    const path = request.url
    console.log(`[request] ${method} ${path}`)

    const requestFile = path.endsWith('/') ? path + 'index.html' : path

    if (
        // 受け取るリクエストはPOSTのみなので、固定のHTMLを探す必要なく、すぐにリクエストを送れる状態になる
        // =自分宛(GET)でないリクエストは、webアプリ（taskWebApp.js）に送る（POST）
        method !== 'GET' ||
        !fs.existsSync(`.${requestFile}`) ||
        fs.statSync(`.${requestFile}`).isDirectory()
    // ファイルが見つからないか、見つかったがディレクトリであった場合は、以下のアクションを行う
    ) {
        //HTTPリクエストの設定を作成
        /*
        const requestOptions = {
            method: method,
            path: path,
            headers: request.headers
        }
        //HTTPリクエストをwebアプリ（taskWebApp.js）に飛ばす、受け取った内容をそのまま飛ばす
        const taskWebAppRequest = http.request(
            'http://localhost:8080',
            requestOptions
        )
        request.on('data', (data) => {
            taskWebAppRequest.write(data)
        })

        //レスポンスが返ってきた時に何をするか＝返ってきた内容をtaskWebAppResponceに詰め込む
        //webサーバがその内容を、webブラウザに渡す
        taskWebAppRequest.on('response', (taskWebAppResponce) => {
            Object.entries(taskWebAppResponce.headers).forEach((header) => {
                response.setHeader(header[0], header[1])
            })
            response.writeHead(taskWebAppResponce.statusCode)
            taskWebAppResponce.on('data', (data) => {
                response.write(data)
            })
            taskWebAppResponce.on('end', () => {
                response.end()
            })
        })

        //requestが終了したら、taskWebAppRequestも終了
        request.on('end', () => {
            taskWebAppRequest.end()
        })
        return
        */

        response.writeHead(404)
        response.end()
        return
    }

    const fileContent = fs.readFileSync(`.${requestFile}`)
    // パッケージでステータスコードを自動的に書いてくれる
    response.writeHead(200)
    response.write(fileContent)
    response.end()

    //.listen サーバーを起動
}).listen(PORT, '127.0.0.1')

console.log(`Server started on port ${PORT}`)