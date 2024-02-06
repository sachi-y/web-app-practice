function add(v1 ,v2) {
    return v1 + v2
}

//関数を別の関数の引数にすることもできる
function calculate(v1, v2, callback) {
    return callback(v1, v2)
}

const addResult = calculate(1, 2, add)
console.log(addResult)

function multiply(v1 ,v2) {
    return v1 * v2
}

const multiplyResult = calculate(1, 2, multiply)
console.log(multiplyResult)

// const hello = () => {
//     console.log('hello')
// }

// setTimeout(hello(),5000) 引数にreturnがない関数(結果がない)を入れてしまうと、エラーが起きる。

// 引数に入れる関数を直接各パターンが多いので覚えておく。
setTimeout(() => {
    console.log('hello')
},5000)

