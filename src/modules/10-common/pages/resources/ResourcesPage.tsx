import React from 'react'
import { Container, Button } from '@wings-software/uikit'
import { Page } from '@common/exports'
import i18n from './ResourcesPage.i18n'

export default function ResourcesPage(): JSX.Element {
  return (
    <>
      <Page.Header
        title={i18n.title}
        toolbar={
          <Container>
            <Button text={i18n.newResource} style={{ color: 'var(--blue-500)', borderColor: 'var(--blue-500)' }} />
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
          message: i18n.noResources,
          buttonText: i18n.newResource,
          onClick: () => {
            alert('To be implemented')
          }
        }}
      ></Page.Body>
    </>
  )
}
