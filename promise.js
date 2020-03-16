// 定义一些状态常量
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'
const resolvePromise = (promise2, x, resolve, reject) => {
    // resolve(x)
    // reject(x)
    // 如果返回的x就是promise2，那么代码就永远走不完了，所以要直接抛错
    if (promise2 === x) {
        reject(new Error('Chaining cycle detected for promise #<Promise>'))
    }
    // 开始判断x
    let then = x.then
    then.call(x, (y) => {
        resolve(y)
    }, (r) => {
        reject(r)
    })
}
class Promise {
  constructor(executor) {
      this.status = 'PENDING'
      this.value = ''
      this.err = ''
      this.onResolvedCallbacks = [],
      this.onRejectedCallbacks = []
      // 只有等待态，才能更新状态
      let resolve = (value) => {
          if (this.status === PENDING) {
              this.status = FULFILLED
              this.value = value
              this.onResolvedCallbacks.forEach(fn=>fn()) // 发布
          }
      }
      let reject = (err) => {
          if (this.status === PENDING) {
              this.status = REJECTED
              this.err = err
              this.onRejectedCallbacks.forEach(fn=>fn())
          }
      }
      try {
          executor(resolve, reject)
      } catch (error) {
          console.log(error)
          // 将throw的异常作为reject的参数，当做promise失败的原因
          reject(error)
      }
  }
  then(onFulFilled, onRejected){
      // 为了让第一个promise的data向下传递，需要调用promise2的resolve或reject
      // 所以直接将原逻辑放在promise2的executor中，这样就能获取到promise2的resolve
    let promise2 = new Promise((resolve, reject) => {
        if (this.status === FULFILLED) {
          // 用定时器保证能获取到promise
          setTimeout(() => {
              try {
                  let x = onFulFilled(this.value)
                  // x就是promise1return回的值（普通值或者promise或者抛出异常）
                  // 这只是普通值的情况，为了判断x的状态，写一个通用的方法
                  //   resolve(x)

                  //
                  resolvePromise(promise2, x, resolve, reject)
              } catch (error) {
                  reject(error)
              }
          }, 0);
        }
        if (this.status === REJECTED) {
        //   let x = onRejected(this.err)
          // 无论promise1是什么状态，返回的普通值都会让promise2进入成功态
          // resolve(x)

          setTimeout(() => {
              try {
                  let x = onRejected(this.err)
                  resolvePromise(promise2, x, resolve, reject)
              } catch (error) {
                  reject(error)
              }
          }, 0);
        }
        if (this.status === PENDING) {
          // 这样写太死板了，只能去直接执行回调函数
          // this.onResolvedCallbacks.push(onFulFill)
          // this.onRejectedCallbacks.push(onReject)
          // 所以可以采用切片编程 AOP,
          this.onResolvedCallbacks.push(() => {
            // TODO ...
            let x = onFulFilled(this.value) // 先订阅
            resolvePromise(promise2, x, resolve, reject)
          })
          this.onRejectedCallbacks.push(() => {
            let x = onRejected(this.err)
            resolvePromise(promise2, x, resolve, reject)
          })
        }
    })
    return promise2
  }
}
// 
module.exports = Promise