import React from 'react'
import { Container, Tabs, Tab } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import { useStrings } from 'framework/exports'
import { getDelegates } from 'services/portal'
import useCreateDelegateModal from '@delegates/modals/DelegateModal/useCreateDelegateModal'
import DelegateListing from './DelegateListing'
import css from './DelegatesPage.module.scss'

export const DelegatesPage: React.FC = () => {
  const { accountId } = useParams()

  const { data } = getDelegates({
    queryParams: { accountId: accountId }
  })

  const { getString } = useStrings()

  const { openDelegateModal } = useCreateDelegateModal()

  return (
    <Container className={css.delegateTabs}>
      <Tabs id="delegateTabs">
        <Tab
          id="delegate"
          title={getString('delegate.DELEGATES')}
          panel={<DelegateListing delegateResponse={data} onClick={openDelegateModal} />}
        />
        <Tab id="delegateConfiguration" title={'delegateConfiguration'} panel={<div>delegate configurations</div>} />
      </Tabs>
    </Container>
  )
}

export default DelegatesPage
