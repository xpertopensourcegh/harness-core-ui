import React from 'react'
import { Button, Container } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import { Page } from '@common/exports'
import useCreateDelegateModal from '@delegates/modals/DelegateModal/useCreateDelegateModal'
import css from './DelegatesPage.module.scss'

export const DelegatesPage: React.FC = () => {
  const { getString } = useStrings()

  const { openDelegateModal } = useCreateDelegateModal()

  return (
    <Container>
      <Page.Header title={getString('delegate.DELEGATES')} />
      <Page.Body className={css.listBody}>
        <Button
          id="delegateButton"
          intent="primary"
          text={getString('delegate.NEW_DELEGATE')}
          icon="plus"
          onClick={openDelegateModal}
        />
      </Page.Body>
    </Container>
  )
}

export default DelegatesPage
