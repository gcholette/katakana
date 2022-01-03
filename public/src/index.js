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
  setDarkMode,
  isDarkMode,
} from './core/storage.js'
import WinCounter from './components/WinCounter.js'
import AnswerButton from './components/AnswerButton.js'
import KindButton from './components/KindButton.js'
import { themedClass } from './core/theme.js'

function isTouchDevice(){
    return window.ontouchstart !== undefined;
}

initAppMemory()

function App() {
  const [, forceRender] = useState({})
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

  function onDarkThemeToggle() {
    setDarkMode(!isDarkMode())
    forceRender({})
  }

  return h('div', { class: themedClass('app-container') }, [
    h(KindButton, {
      onClick: () => onSetKind('hiragana'),
      kind: 'hiragana',
    }),
    h(KindButton, {
      onClick: () => onSetKind('katakana'),
      kind: 'katakana',
    }),
    h(
      'button',
      { class: themedClass('dark-theme-button'), onClick: onDarkThemeToggle },
      !isDarkMode() ? '🌙' : '☀️'
    ),
    h('div', { class: themedClass('card ' + kind) }, [
      h(
        'div',
        {
          class: themedClass(
            'card-header ' + kind + ' ' + (wrongAnswer ? 'wrong-answer' : '')
          ),
        },
        [h('h1', null, question?.kana)]
      ),
      h('div', { class: themedClass('card-body ' + kind) }, [
        ...answers.map((x) =>
          h(AnswerButton, {
            onClick: onAnswerClick,
            answer: x,
            failed: failedAnswers.some((y) => y.roumaji === x.roumaji),
          })
        ),
        h('hr', { class: themedClass('') }),
        h(WinCounter, { kind }),
        h(
          'button',
          { class: themedClass(`reset-button`), onClick: resetData },
          [h('span', { role: 'img' }, '💣')]
        ),
      ]),
    ]),
  ])
}

render(h(App), document.body)
