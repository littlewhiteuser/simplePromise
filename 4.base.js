// let Promise = require('./promise')

let promise = new Promise((resolve, reject) => {
    // resolve('hello')
    resolve(new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('hello')
        }, 1000);
    }))
})
promise.then(data => {
    console.log(data)
})