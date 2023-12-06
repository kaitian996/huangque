<template>
    <div>
        <el-button type="primary" @click="open">打开test_1</el-button>
    </div>
</template>
   
   
<script lang='ts' setup>
// @ts-nocheck
import { ref, reactive, onMounted } from 'vue'
import { MessageMaster, MessageType } from '../../../dist/huangque.esm-bundler'
const master = ref<MessageMaster>()
const open = () => {
    master.value?.createSlaveWindow('http://127.0.0.1:5173/#/slave', '_test_1')
}
onMounted(() => {
    const messageMaster = new MessageMaster(true)
    messageMaster.subscribeMessage('_test_1', MessageType.MESSAGE_SLAVE_READY, (message) => {
        console.log(message);
    })
    messageMaster.startEventListener()
    master.value = messageMaster
})
</script>
   
<style scoped></style>
  