import { isAsyncFunction, isFunction } from '../utils/is'
import { MessageType } from '../enum'
import { Message, MessageSlaveStack } from '../types'
import { _HUANGQUE_MESSAGE_PLATFORM } from '../constant'
import { useDateFormat } from '../utils/hooks/useDateFormat'
/**
 * @description MessageSlave 子页面运行对象
 */
export class MessageSlave {
  private master: Window
  private uuid: string
  private messageStack: MessageSlaveStack[]
  private debug: boolean
  public slaveName: string
  constructor(master: Window, slaveName: string, debug: boolean = false) {
    if (!master) throw new Error(`Invalid master ${master}`)
    if (!slaveName) throw new Error(`Invalid slave name ${slaveName}`)
    this.master = master
    this.uuid = Date.now().toString()
    this.slaveName = slaveName
    this.messageStack = []
    this.debug = debug
    if (this.debug) window[_HUANGQUE_MESSAGE_PLATFORM] = this
  }
  /**
   *
   * @param messageType 订阅的消息类型
   * @param callback 收到消息后回调
   * @param remove 是否执行一次就删除此回调
   */
  async subscribeMessage<T>(
    messageType: MessageType,
    callback: (message: T) => Promise<any> | any,
    remove: boolean = false,
  ) {
    const functionFlag = isFunction(callback)
    if (!functionFlag) throw new Error(`${callback} is not a function`)
    const target: MessageSlaveStack<T> = {
      messageType,
      callback,
      callbackType: isAsyncFunction(callback) ? 'AsyncFunction' : 'Function',
      remove,
    }
    this.messageStack.push(target)
  }
  /**
   *
   * @param messageType 发送的消息类型
   * @param data 发送的数据
   */
  async postMessage(
    messageType:
      | MessageType.MESSAGE_SLAVE_READY
      | MessageType.MESSAGE_SLAVE_POST,
    data: any,
  ) {
    const target: Message = {
      messageType,
      uuid: this.uuid,
      isMaster: false,
      data,
      time: useDateFormat(),
      slaveName: this.slaveName,
      [_HUANGQUE_MESSAGE_PLATFORM]: _HUANGQUE_MESSAGE_PLATFORM,
    }
    if (this.debug) {
      console.log(
        `%c [Slave]:时间-${new Date()}，Slave发出消息：`,
        'padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #b37feb; font-weight: bold;',
        target,
      )
    }
    this.master.postMessage(target, '*')
  }
  /**
   * @description 启动监听
   */
  startEventListener() {
    window.addEventListener('message', async (event: MessageEvent) => {
      const isTrustedMessage = event.data
        ? event.data[_HUANGQUE_MESSAGE_PLATFORM] === _HUANGQUE_MESSAGE_PLATFORM
          ? true
          : false
        : false
      //非此平台、非master发送、非uuid，视为非法消息，进行屏蔽
      if (!isTrustedMessage || !event.data.isMaster || !event.data.uuid) {
        return console.error(`[Slave]:不合法消息格式,message:`, event.data)
      }
      if (event.data.uuid !== this.uuid) {
        // uuid 不同，说明master和此slave不是对应的，屏蔽此消息
        return
      }
      if (!this.messageStack.length)
        console.warn(`[Slave]:消息列表为空，应在启动前订阅消息`)
      const { messageType, data } = event.data as Message<any>
      if (messageType === undefined) {
        return console.error(
          `[Slave]:不合法消息格式，messageType=${messageType}`,
        )
      } else {
        if (this.debug) {
          console.log(
            `%c [Slave]:时间-${new Date()}，Slave接收消息:`,
            'padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #42c02e; font-weight: bold;',
            data,
          )
        }
        // 进行消息匹配
        for (let index = 0; index < this.messageStack.length; index++) {
          const messageItem = this.messageStack[index]
          if (messageItem.messageType === messageType) {
            try {
              if (messageItem.callbackType === 'AsyncFunction') {
                await messageItem.callback.call(null, data)
              } else {
                messageItem.callback.call(null, data)
              }
            } catch (error) {
              console.error(error)
            } finally {
              // 需要删除只执行一次的数据
              if (messageItem.remove) {
                this.messageStack.splice(index, 1)
                index--
              }
            }
          }
        }
      }
    })
  }
}
