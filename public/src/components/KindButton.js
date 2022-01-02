import { h } from '../resources/libs/preact.js'

export default function KindButton(props) {
  return h(
    'button',
    {
      class: `kind-button ${props.kind}`,
      onClick: props.onClick,
    },
    props.kind === 'hiragana' ? 'あ' : 'ア'
  )
}
