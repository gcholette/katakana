import { h } from '../resources/libs/preact.js'
import { themedClass } from '../core/theme.js'
import WinCounter from '../components/WinCounter.js'
import AnswerButton from '../components/AnswerButton.js'

export default function Questions({
  kind,
  answers,
  question,
  wrongAnswer,
  failedAnswers,
  resetData,
  onAnswerClick,
}) {
  return h('div', { class: themedClass('card ' + kind) }, [
    h(
      'div',
      {
        class: themedClass(
          'card-header ' + kind + ' ' + (wrongAnswer ? 'wrong-answer' : '')
        ),
      },
      [
        h('h1', null, question?.kana),
        h('img',
          {
            src: "/src/resources/svg/rotate.svg",
            title: 'Reset score',
            class: 'reset-btn-icon',
            onClick: resetData,
          })
      ]
    ),
    h('div', { class: themedClass('card-body ' + kind) }, [
      h('div', { class: 'roumaji-answer-wrapper' },
        ...answers.map((x) =>
          h(AnswerButton, {
            onClick: onAnswerClick,
            answer: x,
            failed: failedAnswers.some((y) => y.roumaji === x.roumaji),
          })
        )
      ),
      h('hr', { class: themedClass('') }),
      h(WinCounter, { kind }),
    ]),
  ])
}