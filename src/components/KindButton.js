import { themedClass } from '../core/theme.js'
import { h } from '../resources/libs/preact.js'

export default function KindButton(props) {
  return h(
    'button',
    {
      class: themedClass(`kind-button ${props.kind}`),
      onClick: props.onClick,
    },
    props.kind === 'hiragana' ? 'あ' : 'ア'
  )
}
