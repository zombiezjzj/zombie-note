 阻塞与非阻塞描述的是调用者的

如A调用B：

如果是阻塞，A在发出调用后，要一直等待，等着B返回结果。

如果是非阻塞，A在发出调用后，不需要等待，可以去做自己的事情。

### 同步，异步 和 阻塞，非阻塞之间的区别

[同步、异步](synchronized-vs-asynchronization.md)，是描述被调用方的。

阻塞，非阻塞，是描述调用方的。

同步不一定阻塞，异步也不一定非阻塞。没有必然关系。

举个简单的例子，老张烧水。
1 老张把水壶放到火上，一直在水壶旁等着水开。（同步阻塞）
2 老张把水壶放到火上，去客厅看电视，时不时去厨房看看水开没有。（同步非阻塞）
3 老张把响水壶放到火上，一直在水壶旁等着水开。（异步阻塞）
4 老张把响水壶放到火上，去客厅看电视，水壶响之前不再去看它了，响了再去拿壶。（异步非阻塞）

1和2的区别是，调用方在得到返回之前所做的事情不一行。
1和3的区别是，被调用方对于烧水的处理不一样。
