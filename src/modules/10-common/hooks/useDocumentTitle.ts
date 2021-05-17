import { useStrings } from 'framework/strings'
import { useAppStore } from 'framework/AppStore/AppStoreContext'
import { useDeepCompareEffect } from '@common/hooks/useDeepCompareEffect'

type Title = string | string[]

export interface UseDocumentTitleReturn {
  updateTitle: (newTitle: Title) => void
}

export function useDocumentTitle(title: Title): UseDocumentTitleReturn {
  const { getString } = useStrings()
  const { selectedProject } = useAppStore()

  const getStringFromTitle = (str: Title): string => (Array.isArray(str) ? str.filter(s => s).join(' | ') : str)

  const updateTitle = (newTitle: Title): void => {
    document.title = [getStringFromTitle(newTitle), selectedProject?.name, getString('harness')]
      .filter(s => s)
      .join(' | ')
  }

  useDeepCompareEffect(() => {
    updateTitle(title)

    return () => {
      // reset title on unmount
      document.title = getString('harness')
    }
  }, [title, selectedProject])

  return {
    updateTitle
  }
}
