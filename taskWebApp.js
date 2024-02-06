const http = require('http')
const { getDefaultAutoSelectFamily } = require('net')
// ランダムな文字列でセッションIDを作成するライブラリ
const uid = require('uid-safe').sync

const PORT = 8080

const sessions = {}

const users = [
    {
        id: 1,
        name: 'alice'
    },
    {
        id: 2,
        name: 'bob'
    },
]

const tasks = [
    {
        title: 'フロントエンドの実装',
        createdAt: new Date()
    },
    {
        title: 'サーバサイドの実装',
        createdAt: new Date()
    }
]

function getTasksHTML() {
    const tasksHTMLElment = tasks
    .map((task) => {
        return `<tr>
        <td>${task.title}</td>
        <td>${task.createdAt}</td>
    </tr>`
    }).join('')
// mapは一つの配列を返す関数だから、joinで繋げる

    return `<!DOCTYPE html>
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8" />
        <title>hello</title>
    </head>
    <body>
        <h1>タスク一覧</h1>
        <a href="/tasks/new.html">タスク登録へ</a>
        <table>
            <thead>
                <tr>
                    <th>タイトル</th>
                    <th>作成日時</th>
                </tr>
            </thead>
            <tbody>
                ${tasksHTMLElment}
            </tbody>
        </table>
    </body>
    </html> `
}

// コールバック関数
// httpパッケージ内のcreateServer
// 接続(Enter)毎ではなく、request毎にまとまった単位で処理を行う
http.createServer((request, response) => {
    // methodに応じて分岐する処理を作る
    const method = request.method
    const path = request.url
    console.log(`[request] ${method} ${path}`)
    // リクエストのヘッダーのそれぞれの属性に対してループを回して、コンソールに表示
    Object.entries(request.headers).forEach((header) => {
        console.log(header)
    })

    // もしたtaskリンクに繋がったら
    if (path ==='/tasks' && method === 'GET') {
        response.writeHead(200)
        const responseBody = getTasksHTML()
        response.write(responseBody)
        response.end()
        return
        // /tasksかつ、POSTであった時
    } else if (path === '/tasks' && method === 'POST') {
        let requestBody = ''
        //データを受け取ったら、requestBodyに書き込む
        request.on('data', (data) => {
            requestBody += data
        })

        request.on('end', () => {
            //title=[フォームで入力した文字]として出力されるものを、=で分割して2番目の文字列を抽出
            const title = requestBody.split('=')[1]

            const task = {
                title: title,
                createdAt: new Date()
            }

            //上で定義した、tasksに書き込む
            tasks.push(task)

            response.writeHead(303, {
                location: '/tasks'
            })
            response.end()
        })

        return
        // /api/tasksというパスにGETメソッドでアクセスがあった場合 ===APIの記述
    } else if(path ==='/api/tasks' && method === 'GET') {
        // CORSの設定（異なるオリジンへのアクセスを許可する仕組み）
        response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.writeHead(200)
        const responseBodyJson = {
            tasks: tasks
        }
        const responseBody = JSON.stringify(responseBodyJson)
        response.write(responseBody)
        response.end()
        return
    // /api/tasksのメソッドがPOSTの場合の処理
    } else if(path ==='/api/tasks' && method === 'POST') {
        let requestBody = ''
        // データを読み込む度に追記していく
        request.on('data', (data) => {
            requestBody += data
        })

        request.on('end', () => {
            // 受け取った文字列をJSONというデータ形式に変換
            const requestBodyJson = JSON.parse(requestBody)
            // サーバ側のバリデーションの設置（webサイトではサーバ側からバリデーションを設置するのは必須（ブラウザを介さずにサーバに直接入力（リクエスト）することもできてしまうから））
            // フロントエンドのバリデーションは、利用者側の利便性向上の為
            const title = requestBodyJson.title
            if (!title || title.length < 1 || 30 < title.length) {
                response.writeHead(400)
                response.end()
                return
            }

            const task = {
                title: requestBodyJson.title,
                createdAt: new Date()
            }
            // 前述で記載したtaskに追記
            tasks.push(task)

            response.writeHead(202)
            response.end()
        })

        return
    // Cookieの設定
    } else if (path==='/set-cookie-sample' && method === 'GET'){
        response.setHeader('Set-Cookie', 'name=alice')
        response.writeHead(200)
        response.write('set cookie sample')
        response.end()
        return
    } else if (path === '/session-start' && 'GET') {
        // 実際にはここでパスワードによる認証(パスワードによってユーザIDを特定)などを行う
        const userId = 2

        const sessionId = uid(24)

        sessions[sessionId] = {
            userId: userId
        }

        response.setHeader('set-Cookie', `sid=${sessionId}`)
        response.writeHead(200)
        response.write('session started')
        response.end()
        return
    // ログインしたら、ログイン中のユーザ名が確認できるようにする
    } else if (path ==='/me' && method === 'GET') {
        // headerからcookieの一覧を取り出す
        const cookie = request.headers.cookie
        //=で区切った2番目の要素（ユーザー名）を取り出す
        const sessionId = cookie.split('=')[1]

        const userId = sessions[sessionId].userId

        //データベースなどに登録されたユーザーのIDとcookieで取り出したIDが一致するものを取り出す
        const user = users.find((user) => {
            return user.id === userId
        })

        response.writeHead(200)
        response.write(`userId: ${userId}, userName: ${user.name}`)
        response.end()
        return
    }


    //もし繋がらなかったら
    response.writeHead(404)
    response.end()
    return
})
.listen(PORT, '127.0.0.1')

console.log(`Server started on port ${PORT}`)
