export enum MessageType {
  /**
   * @description slave页面加载完成
   */
  MESSAGE_SLAVE_READY = 'slave_ready',
  /**
   * @description slave页面向master页面发送消息
   */
  MESSAGE_SLAVE_POST = 'slave_post',
  /**
   * @description slave 结束
   */
  MESSAGE_SLAVE_END = 'slave_end',
  /**
   * @@description  master页面向slave页面发送消息
   */
  MESSAGE_MASTER_POST = 'master_post',
  /**
   * @description master页面关闭消息
   */
  MESSAGE_MESTER_END = 'master_end',
}
