import { hiragana, katakana } from '../resources/jp/kanas.js'
import { getShuffledArr, getPreviousCounts } from './storage.js'

const kanas = { hiragana, katakana }

const getDifficultySubset = (lst, diff) => {
  switch (diff) {
    case 0:
      return lst.filter((x, i) => x.type === 'gojuuon' && i < 9)
    case 1:
      return lst.filter((x, i) => x.type === 'gojuuon' && i < 29)
    case 2:
      return lst.filter((x, i) => x.type === 'gojuuon')
    case 3:
      return lst.filter((x, i) => x.type === 'gojuuon' || x.type == 'dakuon' || x.type === 'handakuon')
    case 4:
      return lst.filter((x) => x.type === 'handakuon' || x.type === 'dakuon' || x.type === 'youon')
    case 5:
      return lst.filter((x, i) => x.type === 'extended' || x.type === 'youon')
    case 6:
      return lst.filter((x) => x.type !== 'sokuon')
  }
}

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
  const list = kanas[kanaKind]

  const gojuSubset = getDifficultySubset(list, difficulty)

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
