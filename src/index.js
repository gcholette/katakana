import { h, render } from './resources/libs/preact.js'
import { useState } from './resources/libs/preact-hooks.js'
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
  changeDifficulty,
  getDifficulty,
} from './core/storage.js'
import WinCounter from './components/WinCounter.js'
import AnswerButton from './components/AnswerButton.js'
import KindButton from './components/KindButton.js'
import { themedClass } from './core/theme.js'
import DifficultyScale from './components/DifficultyScale.js'

initAppMemory()

function App() {
  const [, forceRender] = useState({})
  const [kind, setKind] = useState(getSelectedKind())
  const [difficulty, setDifficulty] = useState(getDifficulty(kind))
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

  function onSetKind(kind1) {
    setKind(kind1)
    setSelectedKind(kind1)
    const diff = getDifficulty(kind1)
    setDifficulty(diff)
    setFlashcard(getFlashcards(kind1, diff))
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

  function onRangeChange(e) {
    const value = e.target.value
    changeDifficulty(+value, kind)
    setDifficulty(+value)
    setFlashcard(getFlashcards(kind, +value))
  }

  return h('div', { class: themedClass('app-container') }, [
    h('div', { style: 'flex 0 1' }, [
      h(
        'div',
        { class: themedClass('top-card') },
        h('div', { class: themedClass('top-card-body') }, [
          h(KindButton, {
            onClick: () => onSetKind('hiragana'),
            kind: 'hiragana',
            title: 'Hiragana'
          }),
          h(KindButton, {
            onClick: () => onSetKind('katakana'),
            kind: 'katakana',
            title: 'Katakana'
          }),
          h('br'),
          h(DifficultyScale, { difficulty, onRangeChange }),
          h(
            'span',
            { class: themedClass('moon-btn'), onClick: onDarkThemeToggle },
            isDarkMode() ? '🌙' : '☀️'
          ),
        ])
      ),
      h('div', { class: themedClass('card ' + kind) }, [
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
      ]),
    ]),
    h(
      'footer',
      { class: themedClass('license') },
      h('a', { href: 'https://gcholette.com' }, '© 2022 Gabriel Cholette-Rioux')
    ),
  ])
}

render(h(App), document.body)
