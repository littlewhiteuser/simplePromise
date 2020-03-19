let Promise = require('./promise')

let promise = new Promise((resolve, reject) => {
    // resolve('hello')
    reject('no hello')
})
promise.then().then().then(null, err => {
    console.log(err)
    return undefined
}).then(data => {
    console.log(data)
})
// 'no hello' 'undefined'