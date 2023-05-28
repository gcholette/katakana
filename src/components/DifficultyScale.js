import { h } from '../resources/libs/preact.js'

export default function DifficultyScale({ difficulty, onRangeChange, onClickKanas }) {
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
    h('img', 
      {
        src: "/src/resources/svg/info.svg",
        class: 'kanas-btn',
        title: 'Kanas',
        onClick: onClickKanas,
    }),
  ])
}
