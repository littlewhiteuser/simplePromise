let fs = require('fs')
// let Promise = require('./promise')

// 这样的写法就会陷入回调地狱（层次多的话）
// fs.readFile('name.txt', 'utf-8', function (err,data) {
//     fs.readFile(data, 'utf-8', function (err,data) {
//         console.log(err, data)
//     })
// })

function read(...args) {
    return new Promise((resolve, reject)=>{
        fs.readFile(...args, function (err, data) {
            if (err) {
                reject(err)
            }
            resolve(data)
        })
    })
}

// 这样虽然用了promise，但是还是没有解决回调的问题
// 所以需要通过链式调用的方式来解决这个问题
// read('name.txt', 'utf8').then((data) => {
//     read(data, 'utf8').then(data => {
//         console.log(data)
//     })
// })

// then成功的回调和失败的回调都可以返回一个结果
// 情况1：如果返回的是一个promise，那么会让这个promise执行，并且采用它的状态，将成功或者失败的结果传递给外层的下一个then中
// 情况2：如果返回的是一个普通值，会把这个值作为外层的下一个then的成功回调的参数（无论是在resolve中还是reject中返回）
// 情况3：抛出一个异常（进入下一个then的失败回调中）
read('name.txt', 'utf8').then(data => {
  return read(data+'1', 'utf8')
}).then((data) => {
    console.log(data)
}, err => {
    return 100 // 普通值，进入下一个then的resolve
}).then(data => {
    console.log(data)
    throw new Error('error') // 抛出异常，进入下一个then的reject
}).catch(err => { // catch就是then的语法糖，可以省略一个resolve
    console.log('只要上面没有捕获错误，就会执行这个catch')
})

// promise如何实现链式调用的，返回一个新的promise（因为promise不允许多次改变状态）