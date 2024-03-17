import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { cloneDeep, debounce } from 'lodash-es'
import type { AllComponentProps } from '@/components/lego/defaultProps'

export interface ComponentData {
  // 元素的属性，属性请详见下面
  props: Partial<AllComponentProps>
  // id - uuid v4 生成
  id: string
  // 业务组件库： LegoText 、 LegoImage 、 LegoShape
  name: 'LegoText' | 'LegoImage' | 'LegoShape'
  // 图层是否隐藏
  isHidden?: boolean
  // 图层是否锁定
  isLocked?: boolean
  // 图层名称
  layerName?: string
}

export interface UpdateComponentData {
  key: keyof AllComponentProps | Array<keyof AllComponentProps>
  value: string | string[]
  id: string
  isRoot?: boolean
}

export interface HistoryProps {
  id: string
  componentId: string
  type: 'add' | 'delete' | 'modify'
  data: any
  index?: number
}

export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[]
  // 当前编辑的元素 uuid
  currentElement: string
  // // 当然最后保存的时候还有有一些项目信息，这里并没有写出，等做到的时候再补充
  // page: PageData
  // // 当前被复制的组件
  // copiedComponent?: ComponentData
  // 当前操作的历史记录
  histories: HistoryProps[]
  // 当前历史记录的操作位置
  historyIndex: number
  // 开始更新时的缓存值
  cachedOldValues: any
  // 保存最多历史条目记录数
  maxHistoryNumber: number
  // 数据是否有修改
  isDirty: boolean
  // // 当前 work 的 channels
  // channels: ChannelProps[]
}

export interface PageProps {
  backgroundColor: string
  backgroundImage: string
  backgroundRepeat: string
  backgroundSize: string
  height: string
}

export type AllFormProps = PageProps & AllComponentProps

export const useEditorStore = defineStore({
  id: 'editor',
  state: (): EditorProps => ({
    components: [],
    currentElement: '',
    histories: [],
    historyIndex: -1,
    cachedOldValues: null,
    maxHistoryNumber: 5,
    isDirty: false,
  }),
  getters: {
    getCurrentElement(state) {
      return state.components.find(component => component.id === state.currentElement)
    },
  },
  actions: {
    setDirty() {
      this.isDirty = true
    },
    pushHistory(historyRecord: HistoryProps) {
      if (this.historyIndex !== -1) {
        this.histories = this.histories.splice(0, this.historyIndex)
        this.historyIndex = -1
      }

      if (this.histories.length < this.maxHistoryNumber) {
        this.histories.push(historyRecord)
      }
      else {
        this.histories.shift()
        this.histories.push(historyRecord)
      }
    },
    addComponent(component: ComponentData) {
      this.setDirty()

      component.layerName = `图层${this.components.length + 1}`
      this.components.push(component)
      this.pushHistory({
        id: uuidv4(),
        componentId: component.id,
        type: 'add',
        data: cloneDeep(component),
      })
    },
    setActive(currentId: string) {
      this.currentElement = currentId
    },
    updateComponent({ key, value, id, isRoot }: UpdateComponentData) {
      this.setDirty()

      const updatedComponent = this.components.find(component => component.id === (id || this.currentElement))
      if (updatedComponent) {
        if (isRoot) {
          (updatedComponent as any)[key as string] = value
        }
        else {
          const oldValue = Array.isArray(key) ? key.map(key => updatedComponent.props[key]) : updatedComponent.props[key]
          if (!this.cachedOldValues)
            this.cachedOldValues = oldValue

          // TODO: debounce 优化
          const componentData: HistoryProps = {
            id: uuidv4(),
            componentId: (id || this.currentElement),
            type: 'modify',
            data: { oldValue: this.cachedOldValues, newValue: value, key },
          }
          debounce(() => this.pushHistory(componentData), 1000)
          this.cachedOldValues = null

          if (Array.isArray(key) && Array.isArray(value)) {
            key.forEach((keyName, index) => {
              updatedComponent.props[keyName] = value[index]
            })
          }
          else if (typeof key === 'string' && typeof value === 'string') {
            updatedComponent.props[key] = value
          }
        }
      }
    },
  },
})
