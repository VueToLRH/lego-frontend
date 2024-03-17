import { computed } from 'vue'
import { pick } from 'lodash-es'

import type { AllComponentProps } from '@/components/lego/defaultProps'

// _.pick(object, [props]) 创建一个从 object 中选中的属性的对象。
// eg:
// var object = { 'a': 1, 'b': '2', 'c': 3 };
// _.pick(object, ['a', 'c']);
// => { 'a': 1, 'c': 3 }

// Partial<Type>返回一个新类型，将参数类型 Type 的所有属性变为可选属性。
// Readonly<Type>返回一个新类型，将参数类型 Type 的所有属性变为只读属性。
function useComponentCommon(props: Readonly<Partial<AllComponentProps & { isEditing: boolean }>>, picks: string[]) {
  const styleProps = computed(() => pick(props, picks))
  const handleClick = () => {
    if (props.actionType === 'url' && props.url)
      window.location.href = props.url
  }

  return { styleProps, handleClick }
}

export default useComponentCommon
