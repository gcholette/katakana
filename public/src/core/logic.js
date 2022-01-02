import { hiragana, katakana } from '../resources/jp/kanas.js'
import { getPrev, getShuffledArr, getPreviousCounts } from './storage.js'

const kanas = { hiragana, katakana }

function findDifferent(lst, foundItems) {
  const randIndex5 = Math.floor((Math.random() * 100) % lst.length)
  const foundElem = lst[randIndex5]
  if (foundItems.some((x) => x?.roumaji === foundElem?.roumaji)) {
    return findDifferent(lst, foundItems)
  } else {
    return foundElem
  }
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
  console.time('time1')
  const gojuSubset = kanas[kanaKind].filter((x) => x.type === 'gojuuon')

  const prevCount = getPreviousCounts(kanaKind)
  const minCount = getCountMin(prevCount)

  const rand100 = Math.floor((Math.random() * 100) % 100)

  const getRandIndex = () => {
    const matchingMin = gojuSubset.findIndex((x) => x.roumaji === minCount.key)
    if (Object.keys(prevCount) > 3 && matchingMin && rand100 > 75) {
      return matchingMin
    } else {
      return Math.floor((Math.random() * 100) % gojuSubset.length)
    }
  }

  const randIndex = getRandIndex()
  const selectedList = []
  const selectedKana = gojuSubset[randIndex]
  selectedList.push(selectedKana)

  const n = 3
  const arr = [...new Array(n - 1)].map((x, i) => i)

  arr.forEach((x) => {
    const selectedFake = findDifferent(gojuSubset, selectedList)
    selectedList.push(selectedFake)
  })

  console.timeEnd('time1')
  return {
    question: selectedKana,
    answers: getShuffledArr(selectedList),
  }
}

export function answer(answer, rightAnswer) {
  if (answer.roumaji === rightAnswer.roumaji) {
    return true
  } else {
    return false
  }
}
