let Promise = require('./promise')

// let promise = new Promise((resolve, reject) => {
//     // resolve('hello')
//     resolve(new Promise((resolve, reject) => {
//         console.log('开始定时器')
//         setTimeout(() => {
//             console.log('定时器结束')
//             resolve('hello')
//         }, 1000);
//     }))
// })
// promise.then(data => {
//     console.log(data)
// })

console.log(1)
let promise = new Promise((resolve, reject) => {
    // resolve('hello')
    setTimeout(() => {
        console.log(2)
        resolve(new Promise((resolve, reject) => {
            console.log(3)
            setTimeout(() => {
                console.log(4)
                resolve('hello')
                // resolve(new Promise((resolve, reject) => {
                //     console.log('第三层')
                //     resolve('hello')
                // }))
            }, 1000);
        }))
    }, 1000);
})
promise.then(data => {
    console.log(data, '---')
})
// console.log(1)
// setTimeout(() => {
//     console.log(3)
// }, 2000);
setTimeout(() => {
    console.log(5)
}, 100);