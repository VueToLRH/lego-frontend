<script lang="ts" setup>
import { computed } from 'vue'
import { RedoOutlined, UndoOutlined } from '@ant-design/icons-vue'

import { useEditorStore } from '@/store/modules/editor'

const editorStore = useEditorStore()
// const histories = computed(() => editorStore.histories)
// const historyIndex = computed(() => editorStore.historyIndex)
const undoIsDisabled = computed(() => editorStore.checkUndoDisable)
const redoIsDisabled = computed(() => editorStore.checkRedoDisable)

function undoHistory() {
  editorStore.undo()
}
function redoHistory() {
  editorStore.redo()
}
</script>

<template>
  <div class="history-area">
    <div class="operation-list">
      <a-tooltip>
        <template #title>
          撤销
        </template>
        <a-button shape="circle" :disabled="undoIsDisabled" @click="undoHistory">
          <template #icon>
            <UndoOutlined />
          </template>
        </a-button>
      </a-tooltip>
      <a-tooltip>
        <template #title>
          重做
        </template>
        <a-button shape="circle" :disabled="redoIsDisabled" @click="redoHistory">
          <template #icon>
            <RedoOutlined />
          </template>
        </a-button>
      </a-tooltip>
    </div>
    <!-- <li v-for="(item, index) in histories" :key="item.id">
      <span :class="{ bold: index === historyIndex }">{{ item.type }} - {{ item.data.key }}</span>
    </li> -->
  </div>
</template>

<style lang="less" scoped>
.history-area {
  position: absolute;
  right: 0;
  z-index: 500;
}

.operation-list {
  display: flex;
}

.history-area .bold {
  font-weight: bold;
}
</style>
