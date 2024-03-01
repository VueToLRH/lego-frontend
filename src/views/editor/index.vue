<script setup lang="ts">
import InlineEdit from '@/components/InlineEdit.vue'
import UserProfile from '@/components/UserProfile.vue'

function onInlineEditChange() {
  // console.log('onInlineEditChange')
}
</script>

<template>
  <a-layout>
    <a-layout-header class="page-header-container">
      <div class="page-header-left">
        <router-link to="/">
          <img alt="乐高 lego" src="@/assets/images/logo-simple.png" class="logo-img">
        </router-link>
        <InlineEdit value="inline-edit" @change="onInlineEditChange" />
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
      <div class="sidebar-container" />
    </a-layout-sider>
    <a-layout style="padding: 0 24px 24px">
      <a-layout-content class="preview-container" />
    </a-layout>
    <a-layout-sider width="300" style="background: #fff" class="settings-panel">
      <a-tabs type="card">
        <a-tab-pane key="component" tab="属性设置" class="no-top-radius" />
        <a-tab-pane key="layer" tab="图层设置" />
        <a-tab-pane key="page" tab="页面设置" />
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
  }

  .user-profile-menu {
    .user-profile-dropdown {
      position: relative;
      top: -5px;
    }
  }
}
</style>
