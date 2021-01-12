import React from 'react'
import { useParams } from 'react-router-dom'
import { Container, Tabs, Tab } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import { useGetDelegatesStatusV2 } from 'services/portal'
import useCreateDelegateModal from '@delegates/modals/DelegateModal/useCreateDelegateModal'
import DelegateListing from './DelegateListing'
import DelegateConfigurations from './DelegateConfigurations'
import css from './DelegatesPage.module.scss'

export const DelegatesPage: React.FC = () => {
  const { accountId } = useParams()

  const { data } = useGetDelegatesStatusV2({
    queryParams: { accountId }
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
