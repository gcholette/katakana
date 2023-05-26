import { h } from '../resources/libs/preact.js'
import { themedClass } from '../core/theme.js'

export default function Settings() {
  return h('p', {},
    h('div', { class: themedClass('card') },
      h('div', { class: themedClass('card-body settings-body') })
    )
  )
}