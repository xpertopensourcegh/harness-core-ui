import React from 'react'
import { Container, Tabs, Tab } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
// import { getDelegates } from 'services/portal'
import useCreateDelegateModal from '@delegates/modals/DelegateModal/useCreateDelegateModal'
import Delegatesmock from './__tests__/Delegatesmock.json'
import DelegateListing from './DelegateListing'
import DelegateConfigurations from './DelegateConfigurations'
import css from './DelegatesPage.module.scss'

export const DelegatesPage: React.FC = () => {
  // const { accountId } = useParams()

  // const { data } = getDelegates({
  //   queryParams: { accountId: accountId }
  // })

  const data = Delegatesmock

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
        <Tab
          id="delegateConfiguration"
          title={getString('delegate.DELEGATE_CONFIGURATIONS')}
          panel={
            <>
              <DelegateConfigurations />
            </>
          }
        />
      </Tabs>
    </Container>
  )
}

export default DelegatesPage
