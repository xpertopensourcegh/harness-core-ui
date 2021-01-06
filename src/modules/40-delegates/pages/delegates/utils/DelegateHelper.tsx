import { useStrings } from 'framework/exports'
import { Delegates } from '@delegates/constants'

export const GetDelegateTitleTextByType = (type: string): string => {
  const { getString } = useStrings()

  switch (type) {
    case Delegates.KUBERNETES_CLUSTER:
      return getString('delegate.DELEGATE_KUBERNETE_TITLE')
    default:
      /* istanbul ignore next */
      return ''
  }
}
