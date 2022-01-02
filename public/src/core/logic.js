import { hiragana, katakana } from '../resources/jp/kanas.js'
import { getPrev, getShuffledArr } from './storage.js'

function findDifferent(lst, foundItems) {
  const randIndex5 = Math.floor((Math.random() * 100) % lst.length)
  const foundElem = lst[randIndex5]
  if (foundItems.some((x) => x?.roumaji === foundElem?.roumaji)) {
    return findDifferent(lst, foundItems)
  } else {
    return foundElem
  }
}

function getPreviousCounts(prevs) {
  if (!Array.isArray(prevs)) {
    return []
  }
  const prevCounts = prevs.reduce((acc, curr) => {
    if (acc[curr.roumaji]) {
      return { ...acc, [curr.roumaji]: acc[curr.roumaji] + 1 }
    } else {
      return { ...acc, [curr.roumaji]: 1 }
    }
  }, {})
  return prevCounts
}

function getCountMin(prevCounts) {
  return Object.keys(prevCounts).reduce(
    (acc, curr) => {
      if (prevCounts[curr] < acc.value) {
        return { key: curr, value: prevCounts[curr] }
      } else {
        return acc
      }
    },
    { key: 'F', value: 999 }
  )
}

export function getFlashcards(kanaKind = 'hiragana', difficulty = 0) {
  if (kanaKind === 'hiragana') {
    const gojuSubset = hiragana.filter((x) => x.type === 'gojuuon')

    const prevCount = getPreviousCounts(getPrev())
    const minCount = getCountMin(prevCount)

    const rand100 = Math.floor((Math.random() * 100) % 100)

    const getRandIndex = () => {
      const matchingMin = gojuSubset.findIndex(
        (x) => x.roumaji === minCount.key
      )
      if (getPrev().length > 3 && matchingMin && rand100 > 50) {
        return matchingMin
      } else {
        return Math.floor((Math.random() * 100) % gojuSubset.length)
      }
    }

    const randIndex = getRandIndex()

    const selectedKana = gojuSubset[randIndex]
    const selectedFake1 = findDifferent(gojuSubset, [selectedKana])
    const selectedFake2 = findDifferent(gojuSubset, [
      selectedKana,
      selectedFake1,
    ])

    return {
      question: selectedKana,
      answers: getShuffledArr([selectedKana, selectedFake1, selectedFake2]),
    }
  }
}

export function answer(answer, rightAnswer) {
  if (answer.roumaji === rightAnswer.roumaji) {
    return true
  } else {
    return false
  }
}
