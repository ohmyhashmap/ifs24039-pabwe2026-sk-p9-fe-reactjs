import { useState, useCallback } from 'react'

export default function useInput(initialValue = '') {
  const [value, setValue] = useState(initialValue)
  const onChange = useCallback((event) => {
    setValue(event && event.target ? event.target.value : event)
  }, [])
  const reset = useCallback(() => setValue(initialValue), [initialValue])
  return [value, onChange, reset, setValue]
}
