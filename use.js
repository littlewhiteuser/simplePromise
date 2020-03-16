// promise 解决那些问题
// 1.回调地狱（代码不好维护，错误处理麻烦）
// 2.多个请求的并发问题

// Promise是一个类

// 1.在new Promise时需要传递一个执行器函数，默认被执行
// 2.每个promise都有三个状态，pending，fulfilled，rejected
// 3.默认创建一个promise是等待态，resolve变成功态，reject变失败态
// 4.每个promise的实例都具备一个then方法，then传递两个参数，成功的回调和失败的回调
// 5.如何让promise变成失败态 reject() / 抛出一个错误throw new Error()
// 6.如果多次调用成功或者失败，只会执行一次，状态改变了，就不能再变成功或者失败了


let Promise = require('./promise')
let promise = new Promise((resolve, reject) => {
    // resolve('success')
    // throw new Error('我失败了')
    setTimeout(() => {
        // 此时更改了状态，就去依次执行刚刚保存的回调函数
        resolve('success')
    }, 1000);
})
// 同一个promise实例，可以then多次
// 如果调用then的时候没有状态改变，就将成功和失败的回调保存起来
// 核心就是发布订阅模式
promise.then((value) => {
    console.log('fulfill', value)
}, (err) => {
    console.log('reject', err)
})
promise.then(
  value => {
    console.log('fulfill', value)
  },
  err => {
    console.log('reject', err)
  }
)
console.log(4)