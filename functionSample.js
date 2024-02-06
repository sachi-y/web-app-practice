// js関数の基本３種類
function add1(v1, v2) {
    return v1 + v2
}

const result1 = add1(1, 2)
console.log(`result1 = ${result1}`)
// `` でくくると関数を中に埋め込むことができる。

const add2 = function(v1 ,v2) {
    return v1 + v2
}

console.log(add2)

const result2 = add2(1, 2)
console.log(`result2 = ${result2}`)

const add3 = (v1 ,v2) => {
    return v1 + v2
}
const result3 = add3(1 ,2)
console.log(`result3 = ${result3}`)