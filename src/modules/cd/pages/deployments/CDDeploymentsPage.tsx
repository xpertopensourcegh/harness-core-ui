import React, { useCallback } from 'react'
import { Container, Button } from '@wings-software/uikit'
import { Page } from '@common/exports'
import i18n from './CDDeploymentsPage.i18n'
import { ExecutionsListingView } from '../../components/ExecutionsListingView/ExecutionsListingView'

const CDDeploymentsPage: React.FC = () => {
  const runPipeline = useCallback(() => {
    alert('To be implemented')
  }, [])

  return (
    <>
      <Page.Header
        title={i18n.title}
        toolbar={
          <Container>
            <Button intent="primary" text={i18n.runPipeline} onClick={runPipeline} />
          </Container>
        }
      />
      <ExecutionsListingView onNoDataButtonClick={runPipeline} />
    </>
  )
}

export default CDDeploymentsPage
