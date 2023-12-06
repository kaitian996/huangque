import { useDateFormat } from '../utils/hooks/useDateFormat'
import { _HUANGQUE_MESSAGE_PLATFORM } from '../constant'
import { MessageType } from '../enum'
import { Message, MessageSlaveStack, SlaveInfo } from '../types'
import { isAsyncFunction, isFunction } from '../utils/is'

export class MessageMaster {
  private debug: boolean
  public slaveStack: SlaveInfo[]
  private listener: ((event: MessageEvent) => Promise<void>) | undefined =
    undefined
  constructor(debug: boolean = false) {
    this.slaveStack = []
    this.debug = debug
    if (this.debug) window['_HUANGQUE_MESSAGE_PLATFORM_MASTER'] = this
  }
  /**
   * @param slaveName 子页面唯一名字
   * @param messageType 订阅的消息类型
   * @param callback 收到消息后回调
   * @param remove 是否执行一次就删除此回调
   */
  async subscribeMessage<T>(
    slaveName: string,
    messageType: MessageType,
    callback: (message: T) => Promise<any> | any,
    remove: boolean = false,
  ) {
    const functionFlag = isFunction(callback)
    if (!functionFlag) throw new Error(`${callback} is not a function`)
    // 看看是否存在重复的slave name
    const existSlaveName = this.slaveStack.findIndex(
      (i) => i.slaveName === slaveName,
    )
    let slave: SlaveInfo | undefined = undefined
    if (existSlaveName === -1) {
      slave = {
        address: '',
        slaveName,
        uuid: '',
        messageHistory: [],
        messageStack: [],
        instance: null,
      }
      this.slaveStack.push(slave)
    } else {
      slave = this.slaveStack[existSlaveName]
    }
    slave.messageStack.push({
      messageType,
      callback,
      callbackType: isAsyncFunction(callback) ? 'AsyncFunction' : 'Function',
      remove,
    })
  }
  /**
   * @param slaveName {String} slave名称
   * @param messageType 发送的消息类型
   * @param data 发送的数据
   */
  async postMessage(
    slaveName: string,
    messageType:
      | MessageType.MESSAGE_MASTER_POST
      | MessageType.MESSAGE_MESTER_END,
    data: any,
  ) {
    const slave = this.slaveStack.find((i) => i.slaveName === slaveName)
    if (!slave) return console.error(`slaveName ${slaveName} is not found`)
    if (!slave.instance)
      return console.error(`slaveName  ${slaveName} is not has instance`)
    const targetData: Message = {
      data,
      messageType,
      uuid: slave.uuid,
      isMaster: true,
      slaveName: slave.slaveName,
      time: useDateFormat(),
      [_HUANGQUE_MESSAGE_PLATFORM]: _HUANGQUE_MESSAGE_PLATFORM,
    }
    slave.messageHistory.push(targetData)
    slave.instance.postMessage(data, slave.address)
  }
  async createSlaveWindow(address: string, slaveName: string) {
    const slave = this.slaveStack.find((i) => i.slaveName === slaveName)
    if (!slave) return console.error(`slaveName ${slaveName} 未订阅任何消息`)
    slave.address = address
    slave.instance = window.open(address)
  }
  /**
   * @description 启动监听
   */
  startEventListener(): void {
    window.addEventListener(
      'message',
      (this.listener = async (event: MessageEvent) => {
        const isTrustedMessage = event.data
          ? event.data[_HUANGQUE_MESSAGE_PLATFORM] ===
            _HUANGQUE_MESSAGE_PLATFORM
            ? true
            : false
          : false
        //非此平台、非slave发送、非uuid，视为非法消息，进行屏蔽
        if (!isTrustedMessage || event.data.isMaster) {
          return
        }
        const targetData = event.data as Message
        const slave = this.slaveStack.find(
          (i) => i.slaveName === targetData.slaveName,
        )
        if (!slave)
          return console.error(`slaveName ${targetData.slaveName} is not found`)
        if (!slave.uuid) slave.uuid = targetData.uuid
        // 进行消息匹配
        for (let index = 0; index < slave.messageStack.length; index++) {
          const messageItem = slave.messageStack[index]
          if (messageItem.messageType === targetData.messageType) {
            try {
              if (messageItem.callbackType === 'AsyncFunction') {
                await messageItem.callback.call(null, targetData)
              } else {
                messageItem.callback.call(null, targetData)
              }
            } catch (error) {
              console.error(error)
            } finally {
              // 需要删除只执行一次的数据
              if (messageItem.remove) {
                slave.messageStack.splice(index, 1)
                index--
              }
              slave.messageHistory.push(targetData)
            }
          }
        }
      }),
    )
  }
  /**
   * @description 断开监听
   */
  stopEventListener() {
    if (this.listener) window.removeEventListener('message', this.listener)
  }
}
