import React from 'react'
import cx from 'classnames'
import { useModalHook } from '@wings-software/uicore'
import { Dialog, Classes } from '@blueprintjs/core'
import SAMLProviderForm from './views/SAMLProviderForm'
import css from './useSAMLProvider.module.scss'

export interface SAMLProvider {
  name: string
  authorization: boolean
  groupAttributeName?: string
}

interface UseSAMLProviderReturn {
  openSAMlProvider: (SAMLProvider?: SAMLProvider) => void
  closeSAMLProvider: () => void
}

export const useSAMLProvider = (): UseSAMLProviderReturn => {
  const [samlProvider, setSamlProvider] = React.useState<SAMLProvider>()
  const [showModal, hideModal] = useModalHook(() => (
    <Dialog isOpen title="" onClose={hideModal} className={cx(Classes.DIALOG, css.dialog)}>
      <SAMLProviderForm hideModal={hideModal} samlProvider={samlProvider} />
    </Dialog>
  ))

  const open = (_samlProvider?: SAMLProvider): void => {
    if (_samlProvider) {
      setSamlProvider(_samlProvider)
    }
    showModal()
  }

  return {
    openSAMlProvider: open,
    closeSAMLProvider: hideModal
  }
}
