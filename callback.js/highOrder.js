
// 保留原有逻辑，对函数进行包装，切片编程（抽离核心，加入自己的逻辑），也叫切片AOP
const say = (...args) => {
    // todo...
    console.log('说话', ...args)
}

Function.prototype.before = function (cb) {
    // before接受一个函数作为参数，返回一个函数，妥妥的高阶函数
    // return function () { // 这样写取不到this，因为newSay在window下执行，this是window
    //     this()
    //     cb()
    // }
    return (...args) => { // 所以应该通过箭头函数固定this，say.before，所以before内的this就是say
        cb()
        this(...args) // 执行say方法
    }
}

// before接收一个cb，符合高阶函数，
let newSay = say.before(() => {
    console.log('before say')
})
newSay('a', 'b', 'c')