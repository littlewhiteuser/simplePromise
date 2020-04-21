// 题1:
console.log('script start');

setTimeout(function () {
    console.log('setTimeout');
}, 0);

Promise.resolve().then(function () {
    console.log('promise1');
}).then(function () {
    console.log('promise2');
});

console.log('script end')

//start end 1 2 setTimeout

//  题2：
{/* < a id = "link" href = "http://www.zhufengpeixun.cn" > link</a >
<script>
            let link = document.getElementById('link');
    const nextTick = new Promise(resolve => {
                link.addEventListener('click', resolve);
    });
    nextTick.then(event => {
                event.preventDefault();
        console.log('event.preventDefault()');
    });
    //link.click();
</script> */}

// 题3:
async function async1 () {
    console.log('async1 start')
    await async2() // Promise.resolve(async2()).then(console.log('async1 end'))
    console.log('async1 end') // 第一个微任务
    await async2()
}
async function async2 () {
    console.log('async2')
}
console.log('script start')
setTimeout(function () { // 第一个宏任务
    console.log('setTimeout')
}, 0)
async1()
new Promise(function (resolve) {
    console.log('promise1')
    resolve()
}).then(function () {
    console.log('promise2') // 第二个微任务
})
console.log('script end')

// script/start async1/start async2 promise1 script/end async1/end promise2 setTimeout

let p = Promise.reject('测试')

async function test() {
    try {
        let res = await p
        console.log(res)
        console.log(11111)
    } catch (error) {
        console.log(error, 'catch捕获')
    }
}
// function test() {
//     p.then(null, err => {
//         console.log(err)
//         console.log(1111)
//     })
// }

test()

function Foo () {
    getName = function () { console.log(1); };
    return this;
}
Foo.getName = function () { console.log(2); };
Foo.prototype.getName = function () { console.log(3); };
var getName = function () { console.log(4); };
function getName () { console.log(5); }

//请写出以下输出结果：
Foo.getName();
getName();
Foo().getName();
getName();
new Foo.getName();
new Foo().getName();
new new Foo().getName();