export enum MessageType {
  /**
   * @description slave页面加载完成
   */
  MESSAGE_PAGE_READY,
  /**
   * @description slave页面向master页面发送消息
   */
  MESSAGE_PAGE_POST,
  /**
   * @@description  master页面向slave页面发送消息
   */
  MESSAGE_PAGE_REQUEST,
  /**
   * @description master页面关闭消息
   */
  MESSAGE_OWNER_END,
}
