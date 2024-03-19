<script setup lang="ts">
import { computed, ref } from 'vue'
import { pickBy } from 'lodash-es'

import InlineEdit from '@/components/InlineEdit.vue'
import UserProfile from '@/components/UserProfile.vue'
import ComponentList from '@/components/ComponentList.vue'
import EditWrapper from '@/components/EditWrapper.vue'
import EditGroup from '@/components/EditGroup.vue'
import HistoryArea from '@/components/HistoryArea.vue'
import LayerList from '@/components/LayerList.vue'
import PropsTable from '@/components/PropsTable/index.vue'
import LegoText from '@/components/lego/LegoText.vue'
import LegoImage from '@/components/lego/LegoImage.vue'
import LegoShape from '@/components/lego/LegoShape.vue'

import type { ComponentData } from '@/store/modules/editor'
import type { AllComponentProps } from '@/components/lego/defaultProps'

import { useEditorStore } from '@/store/modules/editor'
import defaultTextTemplates from '@/config/defaultTextTemplates'

const legoComponents = {
  LegoText,
  LegoImage,
  LegoShape,
}

const canvasFix = ref(false)
const editorStore = useEditorStore()
const components = computed(() => editorStore.components)
const currentElement = computed<ComponentData | null>(() => editorStore.getCurrentElement || null)
const page = computed(() => editorStore.page)

function onInlineEditChange(newTitle: string) {
  editorStore.updatePage({ key: 'title', value: newTitle, isRoot: true })
}

function handlePageAttrChange(e: any) {
  editorStore.updatePage(e)
}

function onAddComponentItem(component: ComponentData) {
  editorStore.addComponent(component)
}

function setActive(id: string) {
  editorStore.setActive(id)
}

function updatePosition(data: { left: number, top: number, id: string }) {
  const { id } = data

  // _.pickBy(object, [predicate=_.identity]) 创建一个对象，这个对象组成为从 object 中经 predicate 判断为真值的属性。predicate调用2个参数：(value, key)。
  // eg:
  // var object = { 'a': 1, 'b': '2', 'c': 3 };
  // _.pickBy(object, _.isNumber);
  // => { 'a': 1, 'c': 3 }
  const updatedData = pickBy<number>(data, (_, key) => key !== 'id')
  const keysArr = Object.keys(updatedData)
  const valuesArr = Object.values(updatedData).map(v => `${v}px`)

  editorStore.updateComponent({
    key: keysArr as (keyof AllComponentProps | Array<keyof AllComponentProps>),
    value: valuesArr,
    id,
  })
}

function handleAttrsChange(e: any) {
  editorStore.updateComponent(e)
}

function handleLayerChange(e: any) {
  editorStore.updateComponent(e)
}
</script>

<template>
  <a-layout>
    <a-layout-header class="page-header-container">
      <div class="page-header-left">
        <router-link to="/">
          <img alt="乐高 lego" src="@/assets/images/logo-simple.png" class="logo-img">
        </router-link>
        <InlineEdit :value="page.title || ''" @change="onInlineEditChange" />
      </div>
      <a-menu
        :selectable="false"
        theme="dark"
        mode="horizontal"
        :style="{ height: '100%' }"
        class="page-header-right"
      >
        <a-menu-item key="1">
          <a-button type="primary">
            预览和设置
          </a-button>
        </a-menu-item>
        <a-menu-item key="2">
          <a-button type="primary">
            保存
          </a-button>
        </a-menu-item>
        <a-menu-item key="3">
          <a-button type="primary">
            发布
          </a-button>
        </a-menu-item>
        <a-menu-item key="4" class="user-profile-menu">
          <UserProfile />
        </a-menu-item>
      </a-menu>
    </a-layout-header>
  </a-layout>
  <a-layout>
    <a-layout-sider width="300" style="background: #fff">
      <div class="sidebar-container">
        <ComponentList :list="defaultTextTemplates" @on-item-click="onAddComponentItem" />
      </div>
    </a-layout-sider>
    <a-layout style="padding: 0 24px 24px">
      <a-layout-content class="preview-container">
        <HistoryArea />
        <div id="canvas-area" class="preview-list" :class="{ 'canvas-fix': canvasFix }">
          <div class="body-container" :style="page.props">
            <EditWrapper
              v-for="componentItem in components"
              :id="componentItem.id"
              :key="componentItem.id"
              :hidden="componentItem.isHidden"
              :props="componentItem.props"
              :active="componentItem.id === (currentElement && currentElement.id)"
              @set-active="setActive"
              @update-position="updatePosition"
            >
              <component
                :is="legoComponents[componentItem.name]"
                v-bind="componentItem.props"
              />
            </EditWrapper>
          </div>
        </div>
      </a-layout-content>
    </a-layout>
    <a-layout-sider width="300" class="settings-panel">
      <a-tabs type="card">
        <a-tab-pane key="component" tab="属性设置" class="no-top-radius">
          <EditGroup
            v-if="currentElement && !currentElement.isLocked"
            :props="currentElement.props as AllComponentProps"
            @change="handleAttrsChange"
          />
          <div v-else>
            <a-empty>
              <template #description>
                <p>该元素被锁定，无法编辑</p>
              </template>
            </a-empty>
          </div>
        </a-tab-pane>
        <a-tab-pane key="layer" tab="图层设置">
          <LayerList
            :list="components"
            :selected-id="currentElement && currentElement.id ? currentElement.id : ''"
            @select="setActive"
            @change="handleLayerChange"
          />
        </a-tab-pane>
        <a-tab-pane key="page" tab="页面设置" class="page-setting-container">
          <PropsTable :props="page.props as any" @change="handlePageAttrChange" />
        </a-tab-pane>
      </a-tabs>
    </a-layout-sider>
  </a-layout>
</template>

<style lang="less" scoped>
.page-header-container {
  display: flex;
  justify-content: space-between;

  .page-header-left {
    display: flex;

    .logo-img {
      margin-right: 20px;
    }

    .inline-edit-container {
      color: #fff;
      font-weight: bold;
    }
  }

  .page-header-right {
    display: flex;
    flex: auto;
    justify-content: right;

    .user-profile-menu {
      .user-profile-dropdown {
        position: relative;
        top: -5px;
      }
    }
  }
}

.preview-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 85vh;
  margin: 0;
  padding: 24px;
}

.preview-container .preview-list {
  position: fixed;
  min-width: 375px;
  min-height: 200px;
  max-height: 80vh;
  margin: 0;
  margin-top: 50px;
  padding: 0;
  overflow: hidden auto;
  background: #fff;
  border: 1px solid #efefef;
}

.settings-panel {
  overflow: auto;
  background: #fff
}

.page-setting-container {
  padding: 16px;
}
</style>
