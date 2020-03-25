## async await
- await后面跟的如果不是一个promise，就会转换成Promise.resolve()
- await命令后面的promise对象如果是reject状态，则参数会被catch捕获到，await前面有没有return效果都一样
- 只要一个await后面的promise变成reject，那么整个async函数都会中断
- 将第一个await放在try catch里，这样不会影响后续的await，或者在第一个await后面跟一个catch方法，也可以继续后面的await