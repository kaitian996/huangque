<template>
  <div>
    我是slave界面
  </div>
</template>
 
 
<script lang='ts' setup>
// @ts-nocheck
import { ref, reactive, onMounted } from 'vue'
import { MessageSlave, MessageType } from '../../../dist/huangque.esm-bundler'
onMounted(() => {
  const messageSlave = new MessageSlave(window.opener, '_test_1', true)
  messageSlave.postMessage(MessageType.MESSAGE_SLAVE_READY)
})
</script>
 
<style scoped></style>