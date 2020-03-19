// 实验性的api
// let fs = require('fs').promises
let fs = require('fs')

// node的库，promise化
// let util = require('util')
// let read = util.promisify(fs.readFile)

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
// 可以将node中的api，遵循这个参数规范的，将异步方法转换成promise
// read('name.txt', 'utf8').then(data => {
//     console.log(data)
// })
const isPromise = value => {
    if ((typeof value === 'object' && typeof value !== null) || typeof value === 'function') {
        return typeof value.then === 'function'
    }
    return false
}
Promise.all = function (promises) {
    return new Promise((resolve, reject) => {
        let arr = []
        let num = 0
        let processData = (value, index) => {
            arr[index] = value
            // 不能直接用arr.length和promises.length做比较
            // 因为有些是异步，有些是同步，会出现先执行arr[5] = 5这种类似代码，此时arr的length已经是6
            // 所以需要新开一个计数器，来看看是否数组内的全部执行完毕
            if (++num === promises.length) {
                resolve(arr)
            }
        }
        for (let i = 0; i < promises.length; i++) {
            let current = promises[i];
            // 如果是promise，执行then，将成功的值返回给数组，失败就直接全部失败
            if (isPromise(current)) {
                current.then(data => {
                    processData(data, i)
                }, reject)
            } else {
                // 如果直接push，因为数组里可能有不是promise的，会导致顺序错乱
                // arr.push(current)
                processData(current, i)
            }
        }
    })
}
Promise.all([1, 2, 3, read('name1.txt','utf8'), 4, read('age.txt','utf8'), 5]).then(data => {
    console.log(data)
}, err => {
    console.log(err)
})