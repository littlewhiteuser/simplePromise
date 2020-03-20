let fs = require('fs')
let util = require('util')
let readFile = util.promisify(fs.readFile)

// async + await ES7语法
async function read () {
    let content = await readFile('./name.txt', 'utf8')
    let age = await readFile(content, 'utf8')
    return age
}

// 可以看出 async + await (语法糖) = generator + co
// async 返回的就是一个promise，await后面跟的内容会被包装成一个promise
read().then(data => {
    console.log(data)
})

// 应用场景
let fn1 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('1')
        }, 1000);
    })
}
let fn2 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('2')
        }, 2000);
    })
}
let fn3 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('3')
        }, 3000);
    })
}
async function asyncAll(promises) {
    let arr = []
    // 不可以用forEach, 因为forEach是同步代码，而且不具备等待效果
    // 想要在循环中使用async await，使用for of或者for循环
    // promises.forEach(async result => {
    //     // await会找最近的函数，找到forEach的回调函数
    //     arr.push(await result)
    // });
    for (let p of promises) {
        arr.push(await p)
    }
    return arr
}

async function readAll() {
    console.time('timer')
    // 通过Promise.all
    // let r = await Promise.all([fn1(), fn2(), fn3()])

    // 通过自己的方法
    let r = await asyncAll([fn1(), fn2(), fn3()])
    console.timeEnd('timer')
    return r
}

readAll().then(data => {
    console.log(data)
})