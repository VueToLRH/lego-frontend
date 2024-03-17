<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import LegoText from './lego/LegoText.vue'

import type { TextComponentProps } from './lego/defaultProps'
import type { ComponentData } from '@/store/modules/editor'

defineProps({
  list: {
    type: Array,
    required: true,
  },
})
const emits = defineEmits(['onItemClick'])

function onItemClick(props: TextComponentProps) {
  const componentData: ComponentData = {
    name: 'LegoText',
    id: uuidv4(),
    props,
  }
  emits('onItemClick', componentData)
}
</script>

<template>
  <div class="create-component-list">
    <div v-for="(item, index) in list" :key="index" class="component-item" @click="onItemClick(item as TextComponentProps)">
      <LegoText v-bind="item as object" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.component-item {
  width: 100px;
  margin: 0 auto;
  margin-bottom: 15px;
}

.component-item > * {
  position: static !important;
}
</style>
