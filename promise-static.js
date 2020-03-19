let fs = require('fs')

let promisify = (fn) => {
    return function (...args) {
        return new Promise((resolve, reject) => {
            fn(...args, function (err, data) {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    }
}
let read = promisify(fs.readFile)
const isPromise = value => {
    if ((typeof value === 'object' && typeof value !== null) || typeof value === 'function') {
        return typeof value.then === 'function'
    }
    return false
}

// Promise.resolve
Promise.resolve = function (value) {
    return new Promise((resolve, reject) => {
        resolve(value) // resolve里一个promise，会等待这个promise执行完成
    })
}
// Promise.reject
Promise.reject = function (error) {
    return new Promise((resolve, reject) => {
        reject(value) // reject不会解析promise值
    })
}

// Promise.race
Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            const value = promises[i];
            if (isPromise(value)) {
                value.then(data => {
                    resolve(data)
                }, reject)
            } else {
                resolve(value)
            }
        }
    })
}
// Promise.race([read('name.txt', 'utf8'), read('age.txt', 'utf8')]).then(values => {
//     console.log(values)
// })

// Promise.prototype.finally, finally的回调不接收任何参数
Promise.prototype.finally = function (fn) {
    // 获取Promise的原型对象
    let p = this.constructor
    return this.then(
        // fn可能是一个promise，我们需要等待它完成
        value => p.resolve(fn()).then(() => value),
        // reject不会等待里面的promise执行，所以失败也用resolve，目的只是执行promise，但不会采用它的值
        err => p.resolve(fn()).then(() => {throw err})
    )
}
Promise.resolve(100).finally(() => {
    console.log('finally')
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('hello')
        }, 2000);
    })
}).then(data => {
    console.log(data)
}, err => {
    console.log(err)
})