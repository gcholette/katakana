import { h } from '../resources/libs/preact.js'
import { hiragana, katakana } from '../resources/jp/kanas.js'
import { themedClass } from '../core/theme.js'
import { getDifficultySubset } from '../core/logic.js'

export default function GridKanas({ kind, difficulty }) {
    const kanas = kind === 'hiragana' ?  hiragana : katakana

    const displayKanas = getDifficultySubset(kanas, difficulty).map((kana) => {
        return h('span', {class: themedClass('kanas-grid-item'), title: kana.roumaji }, kana.kana)
    })

  return h('div', { class: 'kanas-grid' }, [displayKanas])
}
