function saveValueByKey(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.error(`Error saving to localStorage for key '${key}':`, error)
    return false
  }
}

function getValueByKey(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error(`Error reading from localStorage for key '${key}':`, error)
    return null
  }
}

function removeValueByKey(key: string): boolean {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing from localStorage for key '${key}':`, error)
    return false
  }
}

export { saveValueByKey, getValueByKey, removeValueByKey };