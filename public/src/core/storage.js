const initState = {
  isDarkMode: true,
  selectedKind: 'hiragana',
  difficulty: {
    katakana: 0,
    hiragana: 0,
    kanji: 0,
  },
  wins: {
    hiragana: [],
    katakana: [],
    kanji: [],
  },
  fails: {
    hiragana: [],
    katakana: [],
    kanji: [],
  },
  previousCounts: {
    hiragana: {},
    katakana: {},
    kanji: {},
  },
}

const getStore = () => {
  try {
    return JSON.parse(localStorage.getItem('katakana_app_data'))
  } catch (e) {
    initAppMemory(true)
    return JSON.parse(localStorage.getItem('katakana_app_data'))
  }
}

const updateStore = (newStore = {}, force = false) => {
  if (force) {
    localStorage.setItem('katakana_app_data', JSON.stringify(newStore))
  } else {
    const oldStore = getStore()
    localStorage.setItem(
      'katakana_app_data',
      JSON.stringify(force ? newStore : { ...oldStore, ...newStore })
    )
  }
}

export function getPreviousCounts(kind = 'hiragana') {
  return getStore().previousCounts[kind]
}

export function initAppMemory(force = false) {
  if (force) {
    return updateStore(initState, true)
  }
  try {
    const { previousCounts } = getStore()
    if (!previousCounts.hiragana) {
      updateStore(initState, true)
    }
  } catch (e) {
    updateStore(initState, true)
  }
}

export function addItemToPrevs(answer, kind = 'hiragana') {
  try {
    const store = getStore()
    const key = answer.roumaji
    const currentCount = store.previousCounts

    updateStore({
      previousCounts: {
        ...currentCount,
        [kind]: {
          ...currentCount[kind],
          [key]: (currentCount[kind][key] || 0) + 1,
        },
      },
    })
  } catch (e) {
    console.error(e)
  }
}

export function addWinToStore(win, kind = 'hiragana') {
  const allwins = getStore().wins
  const kwins = getStore().wins[kind]
  const newWin = win.roumaji
  updateStore({
    wins: {
      ...allwins,
      [kind]: [...kwins, newWin],
    },
  })
}

export function addFailToStore(fail, kind = 'hiragana') {
  const allfails = getStore().fails
  const kfails = getStore().fails[kind]
  const newFail = fail.roumaji
  updateStore({
    fails: {
      ...allfails,
      [kind]: [...kfails, newFail],
    },
  })
}

export function changeDifficulty(diff, kind = 'hiragana') {
  updateStore({
    difficulty: {
      ...getStore().difficulty,
      [kind]: diff,
    },
  })
}

export const getShuffledArr = (arr) => {
  if (arr.length === 1) {
    return arr
  }
  const rand = Math.floor(Math.random() * arr.length)
  return [arr[rand], ...getShuffledArr(arr.filter((_, i) => i != rand))]
}

export const getPrev = (kind = 'hiragana') => {
  try {
    const store = getStore()
    const previous = kind === 'hiragana' ? store.previousH : store.previousK
    return previous
  } catch (e) {
    console.error(e)
  }
}

export const getWinsCount = (kind = 'hiragana') => {
  const wins = getStore().wins[kind]
  return wins.length
}

export const getFailsCount = (kind = 'hiragana') => {
  const fails = getStore().fails[kind]
  return fails.length
}

export const getDifficulty = (kind = 'hiragana') => {
  return getStore().difficulty[kind]
}

export const getSelectedKind = () => {
  return getStore().selectedKind
}

export const isDarkMode = () => {
  return getStore().isDarkMode
}

export const setDarkMode = (truth) => {
  updateStore({ isDarkMode: truth })
}

export const setSelectedKind = (kind) => {
  updateStore({ selectedKind: kind })
}

export function resetKindData(kind) {
  const store = getStore()
  const newStore = {
    ...store,
    wins: {
      ...store.wins,
      [kind]: [],
    },
    fails: {
      ...store.fails,
      [kind]: [],
    },
    previousCounts: {
      ...store.previousCounts,
      [kind]: {},
    },
  }
  updateStore(newStore, true)
}
