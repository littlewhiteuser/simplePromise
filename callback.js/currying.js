// 函数柯里化

// 场景：判断变量的类型
// 判断类型的四种方法：constructor，instanceof，typeof，Object.prototype.toString.call()
// Object.prototype.toString.call()，为什么要这么用，其它类型在继承Object的时候，都改写了toString方法，不再具备输出数据类型的能力。
// 所以通过原型链向上查找，调用这个方法，可以输出[object Object]这种来判断

function checkType(content, type) {
    return Object.prototype.toString.call(content) === `[object ${type}]`
}
let bool = checkType('aa', 'String')
console.log(bool)
// 这样调用时每次都要传递类型，容易出错

// 通过函数柯里化，缩小函数范围，使函数更加具体化