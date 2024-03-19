import { onMounted, onUnmounted } from 'vue'
import { useEditorStore } from '@/store/modules/editor'

import type { ActionItem } from '@/components/ContextMenu/createContextMenu'

import createContextMenu from '@/components/ContextMenu/createContextMenu'

const editorStore = useEditorStore()

const defaultActions: ActionItem[] = [
  {
    shortcut: 'Backspace / Delete',
    text: '删除图层',
    action: (cid) => { editorStore.deleteComponent(cid || '') },
  },
]

const settingsActions: ActionItem[] = [
  {
    shortcut: 'Ctrl+C',
    text: '复制配置',
    action: () => {},
  },
]

function useContextMenu() {
  let destroyDefaultActions: () => void
  let destroySettingsActions: () => void

  onMounted(() => {
    destroyDefaultActions = createContextMenu(defaultActions)
    destroySettingsActions = createContextMenu(settingsActions, 'settings-panel')
  })

  onUnmounted(() => {
    destroyDefaultActions()
    destroySettingsActions()
  })
}

export default useContextMenu
