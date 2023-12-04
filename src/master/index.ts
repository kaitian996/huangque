import { SlaveInfo } from '../types'

export class MessageMaster {
  private slaveInfoStack: SlaveInfo[]
  constructor(debug: boolean = false) {
    this.slaveInfoStack = []
    if (debug) window['_HUANGQUE_MESSAGE_PLATFORM'] = this
  }
}
