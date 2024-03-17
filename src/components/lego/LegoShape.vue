<script setup lang="ts">
import { shapeComponentProps, shapeStylePropsNames } from './defaultProps'
import useComponentCommon from '@/hooks/useComponentCommon.ts'

const props = defineProps({
  ...shapeComponentProps,
})

const { styleProps, handleClick } = useComponentCommon(props, shapeStylePropsNames)
</script>

<template>
  <div
    :style="styleProps as any"
    class="l-shape-component"
    @click.prevent="handleClick"
  />
</template>

<style lang="less" scoped></style>
