import React from 'react'
import { Button, Container } from '@wings-software/uikit'
import { useStrings } from 'framework/exports'
import { Page } from '@common/exports'
export const DelegatesPage: React.FC = () => {
  const { getString } = useStrings()
  return (
    <Container>
      <Page.Header title={getString('delegate.DELEGATES')} />
      <Page.Body>
        <Button
          intent="primary"
          text={getString('delegate.NEW_DELEGATE')}
          icon="plus"
          //onClick={openDrawer}
        />
      </Page.Body>
    </Container>
  )
}

export default DelegatesPage
