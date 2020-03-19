let fs = require('fs')
let Promise = require('./promise')

let promise = new Promise((resolve, reject) => {
    resolve('hello')
})
let promise2 = promise.then(data => {
    console.log(data)
    // return promise2
    let x = new Promise((resolve, reject) => {
        // resolve('hello')
        // reject('no hello')
        // resolve(new Promise((resolve, reject) => {
        //     // resolve('hello world')
        //     reject('no hello world')
        // }))
        reject(new Promise((resolve, reject) => {
            // resolve('hello world')
            reject('no hello world')
        }))
    })
    return x // return回一个promise，这个promise的返回值和状态决定了下一个then的状态和参数
})
promise2.then(data => {
    console.log('success', data)
}, err => {
    console.log('-------', err)
})
