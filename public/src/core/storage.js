const initState = {
  previous: [],
  wins: [],
  fails: [],
}

const updateStore = (newStore = {}) => {
  const oldStore = JSON.parse(localStorage.getItem('katakana_app_data'))
  localStorage.setItem(
    'katakana_app_data',
    JSON.stringify({ ...oldStore, ...newStore })
  )
}

export function initAppMemory() {
  try {
    const { previous, wins, fails } = JSON.parse(
      localStorage.getItem('katakana_app_data')
    )
    if (!Array.isArray(previous) || !Array.isArray(wins)) {
      updateStore(initState)
    }
  } catch (e) {
    updateStore(initState)
  }
}

export function addItemToPrevs(answer) {
  try {
    const { previous } = JSON.parse(localStorage.getItem('katakana_app_data'))
    updateStore({
      previous: [...previous, answer],
    })
  } catch (e) {
    console.error(e)
  }
}

export function addWinToStore(win) {
  const { wins } = JSON.parse(localStorage.getItem('katakana_app_data'))
  updateStore({
    wins: [...wins, win],
  })
}

export function addFailToStore(fail) {
  const { fails } = JSON.parse(localStorage.getItem('katakana_app_data'))
  updateStore({
    fails: [...fails, fail],
  })
}

export const getShuffledArr = (arr) => {
  if (arr.length === 1) {
    return arr
  }
  const rand = Math.floor(Math.random() * arr.length)
  return [arr[rand], ...getShuffledArr(arr.filter((_, i) => i != rand))]
}

export const getPrev = () => {
  try {
    const { previous } = JSON.parse(localStorage.getItem('katakana_app_data'))
    return previous
  } catch (e) {
    console.error(e)
  }
}

export const getWinsCount = () => {
  const { wins } = JSON.parse(localStorage.getItem('katakana_app_data'))
  return wins.length
}

export const getFailsCount = () => {
  const { fails } = JSON.parse(localStorage.getItem('katakana_app_data'))
  return fails.length
}
