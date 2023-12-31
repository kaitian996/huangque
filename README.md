# huangque 黄雀
> 非同源、同源窗口通信方案，主从模式，一主可以对应一从或多从

# 安装
 ```bash
 npm install @zhuequejs/huangque
 ```
# 模式
## 主从结构  
> 允许一主对应一从或多从的结构进行通信
  
![这是图片](./docs/images/huangque.png "Magic Gardens")
# 用法

## 主页面
```ts
import { MessageMaster, MessageType } from '@zhuequejs/huangque'
// 创建master
const messageMaster = new MessageMaster(true)
// 订阅name=_test_1的slave的消息，消息类型MessageType.MESSAGE_SLAVE_READY，callback
messageMaster.subscribeMessage('_test_1', MessageType.MESSAGE_SLAVE_READY, (message) => {console.log(message);})
// 开始监听
messageMaster.startEventListener()
// 启动窗口,url和slave_name
messageMaster.createSlaveWindow(url, '_test_1')
```
## 从页面
```ts
import { MessageSlave, MessageType } from '@zhuequejs/huangque'
// 创建slave，传入它的名称
const messageSlave = new MessageSlave('_test_1')
// slave订阅消息
messageSlave.subscribeMessage(MessageType.MESSAGE_SLAVE_READY, (message) => {console.log(message);})
// 开始监听
messageSlave.startEventListener()
// 向master发送已准备的状态消息，主从开始通信
messageSlave.postMessage(MessageType.MESSAGE_SLAVE_READY)
```

