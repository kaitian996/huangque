<script setup lang="ts">
import { logger } from './main';

const sendLog=()=>{
  logger.reportLog({
    "message":"我是一个消息"
  })
}
</script>

<template>
  <div>
    <button @click="sendLog">生成消息</button>
  </div>
</template>

<style scoped>
</style>
