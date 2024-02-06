
const tasksTableBodyElement = document.getElementById('tasks-table-body')
const taskTitleInputElement = document.getElementById('task-title-input')
const taskAddButtonElement = document.getElementById('task-add-button')


// APIにアクセスして、データを取得
async function loadTasks() {
    //fetch=ブラウザでJSに使える関数(対象のURLに対してHTTPリクエストを送る)
    const response = await fetch('http://localhost:8080/api/tasks')
    //fetchにより、promise(非同期処理の結果)が返ってきたものを変数に定義
    const responseBody = await response.json()

    const tasks = responseBody.tasks

    //小要素がある限り、取り除き続ける（=追記データを入れる前に、既存データを削除し、重複しないようにする）
    while(tasksTableBodyElement.firstChild) {
        tasksTableBodyElement.removeChild(tasksTableBodyElement.firstChild)
    }

    // それぞれのタスクに対して何をするか
    tasks.forEach((task) => {
        // HTMLの要素のようなものをJSで組み立てて、<td>内を作成
        const titleTdElement = document.createElement('td')
        titleTdElement.innerText = task.title

        const createdAtTdElement = document.createElement('td')
        createdAtTdElement.innerText = task.createdAt

        const trElement = document.createElement('tr')
        //<tr>の子要素に入れるものを定義
        trElement.appendChild(titleTdElement)
        trElement.appendChild(createdAtTdElement)

        tasksTableBodyElement.appendChild(trElement)
    })
}

// inputに入力されたテキストを抽出
async function registerTask() {
    const title = taskTitleInputElement.value

    const requestBody = {
        title: title
    }
    //追加ボタンを押した時に、/api/tasksのページをPOSTメソッドで呼ぶ
    await fetch('http://localhost:8080/api/tasks', {
        method: 'POST',
        body: JSON.stringify(requestBody)
    })

    await loadTasks()
}

// クリックでregisterTask()関数の処理を実行
async function main() {
    // バリデーションの設置（入力した値が、正しいものかどうかを判断する）
    // inputにデータが入る度に起こる処理
    taskTitleInputElement.addEventListener('input', (event) => {
        // 入力した値を取り出す
        const inputValue = event.target.value
        // 入力した値の長さが、1以上30以下でないものは不正と判断（disabledでボタンを押せないようにする）
        const isInvalidInput = inputValue.length < 1 || 30 < inputValue.length
        taskAddButtonElement.disabled = isInvalidInput
    })

    taskAddButtonElement.addEventListener('click', registerTask)
    await loadTasks()
}

main()