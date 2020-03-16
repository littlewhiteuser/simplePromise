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
      reject('no hello')
    })
    return x
})
promise2.then(data => {
    console.log('success', data)
}, err => {
    console.log('-------', err)
})
