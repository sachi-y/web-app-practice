// 非同期処理のコード
const fs = require('fs')
const util = require('util')

// readfileという関数をpromisify仕様のreadfile関数にする
const promisifyReadFile = util.promisify(fs.readFile)

// function main() {
//     let fileContent = ''

//     // fs（非同期処理）…処理の読み込みが完了したら、実行(readfile:ファイルの読み込み)する（主な流れとは別で処理が実行される）
//     fs.readFile('index.html', (error, data) => {
//         fileContent = data.toString()
//         console.log('readFile callback')
//         console.log(fileContent)
//     })

//     console.log('after readFile')
//     console.log(fileContent)
// }

// function main() {
//     const readFilePromise = promisifyReadFile('index.html')

//     readFilePromise.then((data) => {
//         const fileContent = data.toString()
//         console.log(fileContent)
//     })
// }


async function main() {
    // async/await…promisifyReadFileが返す関数の終了を待ってから得られるデータを入手できる
    // awaitを使用すると、処理するコードを順番通りに記載することができる
    const data = await promisifyReadFile('index.html')
    const fileContent = data.toStoring()
    console.log(fileContent)
}

main()