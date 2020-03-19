## 手动实现一个符合规范的promise的思路
- Promise是一个类，有一个默认执行的函数，参数是成功和失败的两个函数
- 有一个then方法，参数是两个回调函数，不同状态时执行成功或者失败的回调函数
- 只有等待态才可以改变状态，为resolve和reject加上状态判断

-----------------

- executor在执行时，内部的一些情况考虑
    - 异步改变promise状态
        - 在pending时，把then的两个函数通过切片编程，保存起来
        - 通过函数的方式保存在数组内（订阅），状态改变时将数组内的函数一次执行（发布）
    - 抛出错误
        - 通过try catch捕获错误，作为promise失败的原因传给reject

## 实现链式调用
- 返回一个全新的promise
- 基于返回值的三种情况做判断，promise，普通值，抛出异常
    - 将promise1的返回值保存给x，放在promise2的执行函数中运行

    - 重点！！！resolve和reject是promise2的方法，如果promise1的返回值是一个promise，那么根据规范要求，promise2将采用返回的promise的返回值和状态。返回的promise会根据执行函数内的代码状态改变，来决定执行then的哪一个回调，所以，需要将promise2的resolve(data)放在promise的onFulFilled内执行，reject(err)放在onRejected内执行，也就是then.call(x,onFulFilled,onRejected)。这样就实现了promise1的返回值为promise时，参数和状态的向下传递

    - 将promise2，x，resolve，reject都作为参数传递给外层方法，这样才能调用promise2的resolve(x)

    - 这样会发现promise2的执行函数还没结束，无法将promise2作为参数，所以讲let x 和 resolvePromise（）放在定时器中，作为宏任务保证new Promise执行完

    - 此时，回调函数和resolvePromise（）在异步代码中，所以constructor内的try catch无法捕获回调函数内的异常，可以再异步代码内单独再添加一个try catch

- resolvePromise（）逻辑处理
    - 内部要做很多兼容处理，比如多个promise库

    - 1.当返回值x就是promise2时，相当于我在等我自己去买东西回来，不可能，直接抛错
    - 2.判断x是否是一个promise
        - 判断x是否是object且x！== null 或者函数
        - 判断x.then是否存在且x.then是否是一个函数
            - x.then的时候可能会因为defineProperty抛错，需要做try catch处理
        - 认定是promise后，调用x的then方法，返回值给promise2的resolve或reject
        - 返回值可能还是一个promise，递归解析
    - 3.因为状态不能被多次修改（返回值内的promise不能保证是自己的promise，所以需要再加一层判断called）

- promise允许空执行then(),比如：promise.then().then().then().then(()=>{},()=>{})
    - 判断then内的回调，如果为空，手动给它补齐回调

- then里的返回值处理完，考虑executor内的resolve是否执行了一个promise

## 周边方法实现，all，race，finally，resolve，reject
- all: 接受数组为参数，其中一个promise失败就直接失败，全部成功才算成功，按顺序返回成功结果
    - 将数组内的promise或者值依次执行，如果是promise，成功了处理结果，失败了直接让all失败，如果是普通值，直接处理结果
    - 因为存在异步问题，所以不能直接push，通过索引一一对应
    - 判断是否结束，不能直接用arr.length，因为通过索引对应，会存在[empty*5,5]这样的结果
    - 通过新开一个计数器，来判断是否全部执行完毕，返回结果的数组


## promise测试
- npm install promises-aplus-tests -g
- promises-aplus-tests promise.js