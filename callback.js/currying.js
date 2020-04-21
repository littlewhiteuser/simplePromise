// 函数柯里化

// 场景：判断变量的类型
// 判断类型的四种方法：constructor，instanceof，typeof，Object.prototype.toString.call()
// Object.prototype.toString.call()，为什么要这么用，其它类型在继承Object的时候，都改写了toString方法，不再具备输出数据类型的能力。
// 所以通过原型链向上查找，调用这个方法，可以输出[object Object]这种来判断

// function checkType(content, type) {
//     return Object.prototype.toString.call(content) === `[object ${type}]`
// }
// let bool = checkType('aa', 'String')
// console.log(bool)
// 这样调用时每次都要传递类型，容易出错

// 通过函数柯里化，缩小函数范围，使函数更加具体化
// function checkType(type) {
//     return function (content) {
//         return Object.prototype.toString.call(content) === `[object ${type}]`
//     }
// }
// let isString = checkType('String')
// 可以批量生成其它函数，isBoolean等等

// 通用的柯里化
const curring = (fn, arr = []) => {
    let len = fn.length // 取到函数参数的长度
    return (...args) => { // 保存用户传入的参数
        arr = arr.concat(args)
        if (arr.length < len) {
            return curring(fn, arr)
        }
        return fn(...arr)
    }
}
const add = (a,b,c,d,e) => {
    return a + b + c + d + e
}
console.log(curring(add,[1,2])(3,4)(5))

let typeArr = ['Number', 'String', 'Boolean']
let util = {}
function checkType(type, content) {
    return Object.prototype.toString.call(content) === `[object ${type}]`
}
// 通过柯里化，生成了很多函数
typeArr.forEach((item) => {
    util['is' + item] = curring(checkType)(item)
})
console.log(util)

// 反柯里化，让一个函数的范围变大