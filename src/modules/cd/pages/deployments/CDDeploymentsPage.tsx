import React from 'react'
import { Container, Button } from '@wings-software/uikit'
import { Page } from 'modules/common/exports'
import i18n from './CDDeploymentsPage.i18n'

const CDDeploymentsPage: React.FC = () => {
  return (
    <>
      <Page.Header
        title={i18n.title}
        toolbar={
          <Container>
            <Button text={i18n.newDeployment} style={{ color: 'var(--blue-500)', borderColor: 'var(--blue-500)' }} />
          </Container>
        }
      />
      <Page.Body
        loading={false}
        error={undefined}
        retryOnError={undefined}
        noData={{
          when: () => true,
          icon: 'harness',
          message: i18n.noDeployment,
          buttonText: i18n.newDeployment,
          onClick: () => {
            alert('To be implemented')
          }
        }}
      ></Page.Body>
    </>
  )
}

export default CDDeploymentsPage
