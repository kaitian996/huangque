import { _HUANGQUE_MESSAGE_PLATFORM } from '../constant'
import { MessageType } from '../enum'
/**
 * @description 消息格式
 */
export type Message<T = any> = {
  [_HUANGQUE_MESSAGE_PLATFORM]: typeof _HUANGQUE_MESSAGE_PLATFORM
  messageType: MessageType
  uuid: string
  isMaster: boolean
  data: T
}
/**
 * @description slave stack中的订阅
 */
export type MessageSlaveStack<T=any> = {
  messageType: MessageType
  callback: (message: T) => Promise<any> | any
  callbackType: 'AsyncFunction' | 'Function'
  remove: boolean
}
