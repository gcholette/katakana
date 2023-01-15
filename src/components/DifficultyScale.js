import { h } from '../resources/libs/preact.js'

export default function DifficultyScale({ difficulty, onRangeChange }) {
  return h('div', { class: 'range-container' }, [
    h('span', {class: 'range-icon', title: 'Easy' }, '🌱  '),
    h('input', {
      class: 'diff-range',
      type: 'range',
      min: 0,
      max: 6,
      value: difficulty,
      onChange: onRangeChange,
    }),
    h('span', {class: 'range-icon', title: 'Hard' }, '  🌳'),
  ])
}
