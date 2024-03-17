<script setup lang="ts">
import { imageComponentProps, imageStylePropsNames } from './defaultProps'
import useComponentCommon from '@/hooks/useComponentCommon.ts'

const props = defineProps({
  ...imageComponentProps,
})

const { styleProps, handleClick } = useComponentCommon(props, imageStylePropsNames)
</script>

<template>
  <img
    :src="src"
    :style="styleProps as any"
    class="l-image-component"
    @click.prevent="handleClick"
  >
</template>

<style lang="less" scoped>
.l-image-component {
  position: relative !important;
  max-width: 100%;
}
</style>
