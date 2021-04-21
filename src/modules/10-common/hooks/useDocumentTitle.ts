import { useEffect } from 'react'
import { useStrings } from 'framework/strings'

type Title = string | string[]

export interface UseDocumentTitleReturn {
  updateTitle: (newTitle: Title) => void
}

export function useDocumentTitle(title: Title): UseDocumentTitleReturn {
  const { getString } = useStrings()

  const getStringFromTitle = (str: Title): string => (Array.isArray(str) ? str.join(' | ') : str)

  const updateTitle = (newTitle: Title): void => {
    document.title = `${getString('harness')} | ${getStringFromTitle(newTitle)}`
  }

  useEffect(() => {
    updateTitle(title)

    return () => {
      // reset title on unmount
      document.title = getString('harness')
    }
  }, [title])

  return {
    updateTitle
  }
}
