let fs = require('fs').promises

// generator 特点
// 1.每次调用next 碰到yield就停止
// 2.碰到return 函数就执行完毕 
// 3.当前调用next时传递的参数永远给的是上一次yield 的返回值

// function * read() {
//     let content = yield fs.readFile('./name.txt', 'utf8')
//     let age = yield fs.readFile(content, 'utf8')
//     let adress = yield 123
//     return adress
// }

// 这种是需要优化的最原始的用法
// let it = read()
// let {value, done} = it.next() //第一个next不用传参数，没意义
// // value是一个promise，done是false
// value.then(data => {
//     // data是age.txt
//     let {value, done} = it.next(data)
//     // value是一个promise，done是false

//     value.then(data => {
//         // data是10
//         let {value, done} = it.next(data)
//         console.log(value, done)
//     })
// })

// co库，co(read()).then(data => {console.log(data)})  10
// co实现
function co(it) {
    return new Promise((resolve, reject) => {
        // 如果是异步的 而且是重复性的，不能用循环，因为循环是同步的，没法做到第一个走完再走第二个
        // 异步重复性工作，迭代，就用回调
        function next(data) {
            let {value, done} = it.next(data)
            if (!done) {
                // 可能yield后面跟的是普通值或者promise，直接用Promise.resolve进行处理
                Promise.resolve(value).then(data => {
                    // 继续回调
                    next(data)
                }, err => {
                    reject(err) // 有失败了，就抛错
                })
            } else {
                resolve(value) // done为true了，返回结果给co的promise
            }
        }
        next() // 对应第一次yield不需要参数
    })
}

// co(read()).then(data => {
//     console.log(data)
// })

// async + await
async function read () {
    let content = await fs.readFile('./name.txt', 'utf8')
    let age = await fs.readFile(content, 'utf8')
    return age
}

read().then(data => {
    console.log(data)
})