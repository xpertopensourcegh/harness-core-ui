import React from 'react'
import { Container, Button } from '@wings-software/uikit'
import { Page } from 'modules/common/exports'
import i18n from './ProjectOverview.i18n'

export default function ProjectOverviewPage(): JSX.Element {
  return (
    <>
      <Page.Header
        title={i18n.title}
        toolbar={
          <Container>
            <Button text={i18n.test} style={{ color: 'var(--blue-500)', borderColor: 'var(--blue-500)' }} />
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
          message: i18n.wip,
          buttonText: i18n.test,
          onClick: () => {
            alert('To be implemented')
          }
        }}
      ></Page.Body>
    </>
  )
}
