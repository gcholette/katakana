import { h, render } from './resources/libs/preact.js'
import { useEffect, useState, useRef } from './resources/libs/preact-hooks.js'
import { answer, getFlashcards } from './core/logic.js'
import {
  initAppMemory,
  addItemToPrevs,
  addWinToStore,
  getWinsCount,
  getFailsCount,
  addFailToStore,
} from './core/storage.js'

initAppMemory()

function AnswerButton(props) {
  return h(
    'button',
    {
      class: 'roumaji-answer' + (props.failed ? ' failed' : ''),
      onClick: () => props.onClick(props.answer),
      disabled: props.failed,
    },
    props.answer?.roumaji
  )
}

function App(props) {
  const [flashcard, setFlashcard] = useState(getFlashcards())
  const [wrongAnswer, setWrongAnswer] = useState(false)
  const { question, answers } = flashcard
  const [failedAnswers, setFailedAnswers] = useState([])

  const onAnswerClick = (answer1) => {
    const result = answer(question, answer1)
    if (result) {
      addItemToPrevs(question)
      addWinToStore(question)
      setWrongAnswer(false)
      setFailedAnswers([])
      setFlashcard(getFlashcards())
    } else {
      if (
        failedAnswers &&
        !failedAnswers.some((x) => x.roumaji === answer1.roumaji)
      ) {
        setFailedAnswers([...failedAnswers, answer1])
        addFailToStore(answer1)
      }
      setWrongAnswer(true)
    }
  }

  return h('div', null, [
    h('div', { class: 'card' }, [
      h(
        'div',
        {
          class: 'card-header',
          style: { background: wrongAnswer ? 'rgb(83, 59, 151)' : '' },
        },
        [h('h1', null, question?.kana)]
      ),
      h('div', { class: 'card-body' }, [
        ...answers.map((x) =>
          h(AnswerButton, {
            onClick: onAnswerClick,
            answer: x,
            failed: failedAnswers.some((y) => y.roumaji === x.roumaji),
          })
        ),

        h('hr'),
        h('div', {class: 'wins-container'}, [
          h('span', {class: 'wins-label'}, getWinsCount()),
          h('span', null, ' - '),
          h('span', {class: 'fails-label'}, getFailsCount()),
        ]),
      ]),
    ]),
  ])
}

render(h(App), document.body)
