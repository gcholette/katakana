import { getFailsCount, getWinsCount } from '../core/storage.js'
import { h } from '../resources/libs/preact.js'

export default function WinCounter(props) {
  return h('div', { class: 'wins-container' }, [
    h('span', { class: 'wins-label ' + props.kind }, getWinsCount(props.kind)),
    h('span', null, ' - '),
    h('span', { class: 'fails-label ' + props.kind }, getFailsCount(props.kind)),
  ])
}
