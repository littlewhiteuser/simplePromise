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
    // 先判断x是对象或者函数，别人的promise实现可能是一个函数，这里用的是对象
    if ((typeof x === 'object' && typeof x !== null) || typeof x === 'function') {
        let called // 为了考虑别人的promise库不够健壮，防止多次调用成功或者失败
        try {
            let then = x.then // 取then的时候，可能会报错（采用的defineProperty定义then，get里抛出错误，存在这种情况）
            // 存在promise.then是一个对象的情况，如果then不是函数，说明不是promise，那么作为普通值进入下一个then的成功态
            if (typeof then === 'function') {
                // 此时认为x是一个promise了，只要执行x的then返回值就好了，并根据回调执行promise2的resolve或者reject
                // 使用then.call(x)，而不是x.then()的原因：这样又会去取then，可能defineProperty的里面有逻辑让第二次取then抛错，所以不这样用
                then.call(x, y => {
                    if (called) return
                    called = true
                    // y也存在是一个promise的情况，所以不能直接resolve，应当继续解析promise，递归调用resolvePromise
                    // resolve(y)
                    resolvePromise(promise2, y, resolve, reject)
                }, r => {
                    if (called) return
                    called = true
                    reject(r)
                    // console.log(r, '执行失败态回调')
                    // resolvePromise(promise2, r, resolve, reject)
                })
            } else {
                resolve(x)
            }
        } catch (error) {
            if (called) return
            called = true
            reject(error) //取then报错了，直接抛出异常作为reject的原因
        }
    } else {
        // 肯定不是promise，直接返回成功状态
        resolve(x)
    }
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
  then (onFulFilled, onRejected) {
      // 判断回调是否为空，如果为空手动弄个补齐，实现.then()穿透
      onFulFilled = typeof onFulFilled === 'function' ? onFulFilled : v => v
      // reject不能像resolve一样，直接return err，会因为普通值直接进入下一个then的成功态，所以要用throw err
      onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err}

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
        // 走到PENDING里，说明外面已经是异步逻辑了，肯定能取到promise2，所以不用包裹定时器（为了代码一致性也可以加上）
        if (this.status === PENDING) {
          // 这样写太死板了，只能去直接执行回调函数
          // this.onResolvedCallbacks.push(onFulFill)
          // this.onRejectedCallbacks.push(onReject)
          // 所以可以采用切片编程 AOP,
          this.onResolvedCallbacks.push(() => {
            try {
                // TODO ...
                let x = onFulFilled(this.value) // 先订阅
                resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
                reject(error)
            }
          })
          this.onRejectedCallbacks.push(() => {
            try {
                let x = onRejected(this.err)
                resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
                reject(error)
            }
          })
        }
    })
    return promise2
  }
  catch () {

  }
}
// promise测试
// Promise.deferred = function (params) {
//     let dfd = {}
//     dfd.promise = new Promise((resolve, reject) => {
//         dfd.resolve = resolve
//         dfd.reject = reject
//     })
//     return dfd
// }

module.exports = Promise