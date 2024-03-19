<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import draggable from 'vuedraggable'
import { DragOutlined, EyeInvisibleOutlined, EyeOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons-vue'
import InlineEdit from './InlineEdit.vue'

import type { ComponentData } from '@/store/modules/editor'

export default defineComponent({
  components: { Draggable: draggable, InlineEdit, DragOutlined, EyeInvisibleOutlined, EyeOutlined, LockOutlined, UnlockOutlined },
  props: {
    list: {
      type: Array as PropType<ComponentData[]>,
      required: true,
    },
    selectedId: {
      type: String,
      required: true,
    },
  },
  emits: ['select', 'change', 'drop'],
  setup(_props, ctx) {
    function handleClick(id: string) {
      ctx.emit('select', id)
    }

    function handleChange(id: string, key: string, value: boolean) {
      const data = {
        id,
        key,
        value,
        isRoot: true,
      }
      ctx.emit('change', data)
    }

    return { handleClick, handleChange }
  },
})
</script>

<template>
  <Draggable
    :list="list"
    class="ant-list-items ant-list-bordered"
    ghost-class="ghost"
    handle=".handle"
    item-key="id"
  >
    <template #item="{ element }">
      <li
        class="ant-list-item"
        :class="{ active: element.id === selectedId }"
        @click="handleClick(element.id)"
      >
        <a-tooltip :title="element.isHidden ? '显示' : '隐藏'">
          <a-button shape="circle" @click.stop="handleChange(element.id, 'isHidden', !element.isHidden)">
            <template v-if="element.isHidden" #icon>
              <EyeOutlined />
            </template>
            <template v-else #icon>
              <EyeInvisibleOutlined />
            </template>
          </a-button>
        </a-tooltip>
        <a-tooltip :title="element.isLocked ? '解锁' : '锁定'">
          <a-button shape="circle" @click.stop="handleChange(element.id, 'isLocked', !element.isLocked)">
            <template v-if="element.isLocked" #icon>
              <UnlockOutlined />
            </template>
            <template v-else #icon>
              <LockOutlined />
            </template>
          </a-button>
        </a-tooltip>
        <InlineEdit class="edit-area" :value="element.layerName" @change="(value) => { handleChange(element.id, 'layerName', value) }" />
        <a-tooltip title="拖动排序">
          <a-button shape="circle" class="handle">
            <template #icon>
              <DragOutlined />
            </template>
          </a-button>
        </a-tooltip>
      </li>
    </template>
  </Draggable>
</template>

<style lang="less" scoped>
.ant-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  border: 1px solid #fff;
  border-bottom-color: #f0f0f0;
  cursor: pointer;
  transition: all 0.5s ease-out;
}

.ant-list-item.active {
  border: 1px solid #1890ff;
}

.ant-list-item.ghost {
  opacity: .5;
}

.ant-list-item:hover {
  background: #e6f7ff;
}

.ant-list-item > * {
  margin-right: 10px;
}

.ant-list-item button {
  font-size: 12px;
}

.ant-list-item .handle {
  margin-left: auto;
  cursor: move;
}

.ant-list-item .edit-area {
  width: 100%;
}
</style>
