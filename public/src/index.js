import { h, render } from './resources/libs/preact.js'
import { useEffect, useState, useRef } from './resources/libs/preact-hooks.js'
import { answer, getFlashcards } from './core/logic.js'
import {
  initAppMemory,
  addItemToPrevs,
  addWinToStore,
  addFailToStore,
  getSelectedKind,
  setSelectedKind,
  resetKindData,
} from './core/storage.js'
import WinCounter from './components/WinCounter.js'
import AnswerButton from './components/AnswerButton.js'
import KindButton from './components/KindButton.js'

initAppMemory()

function App(props) {
  const [kind, setKind] = useState(getSelectedKind())
  const [difficulty, setDifficulty] = useState(0)
  const [flashcard, setFlashcard] = useState(getFlashcards(kind, difficulty))
  const [wrongAnswer, setWrongAnswer] = useState(false)
  const { question, answers } = flashcard
  const [failedAnswers, setFailedAnswers] = useState([])

  const onAnswerClick = (answer1) => {
    const result = answer(question, answer1)
    if (result) {
      addItemToPrevs(question, kind)
      addWinToStore(question, kind)
      setWrongAnswer(false)
      setFailedAnswers([])
      setFlashcard(getFlashcards(kind, difficulty))
    } else {
      if (
        failedAnswers &&
        !failedAnswers.some((x) => x.roumaji === answer1.roumaji)
      ) {
        setFailedAnswers([...failedAnswers, answer1])
        addFailToStore(answer1, kind)
      }
      setWrongAnswer(true)
    }
  }

  function onSetKind(kind) {
    setKind(kind)
    setSelectedKind(kind)
    setFlashcard(getFlashcards(kind, difficulty))
    setWrongAnswer(false)
  }

  function resetData() {
    resetKindData(kind)
    setWrongAnswer(false)
    setFlashcard(getFlashcards(kind, difficulty))
  }

  return h('div', null, [
    h(KindButton, {
      onClick: () => onSetKind('hiragana'),
      kind: 'hiragana'
    }),
    h(KindButton, {
      onClick: () => onSetKind('katakana'),
      kind: 'katakana'
    }),
    h('div', { class: 'card ' + kind }, [
      h(
        'div',
        {
          class:
            'card-header ' + kind + ' ' + (wrongAnswer ? 'wrong-answer' : ''),
        },
        [h('h1', null, question?.kana)]
      ),
      h('div', { class: 'card-body ' + kind }, [
        ...answers.map((x) =>
          h(AnswerButton, {
            onClick: onAnswerClick,
            answer: x,
            failed: failedAnswers.some((y) => y.roumaji === x.roumaji),
          })
        ),
        h('hr'),
        h(WinCounter, { kind }),
        h('button', { class: `reset-button`, onClick: resetData }, [
          h('span', { role: 'img' }, '💣'),
        ]),
      ]),
    ]),
  ])
}

render(h(App), document.body)
