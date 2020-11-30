import { Button, Container } from '@wings-software/uikit'
import React from 'react'
import { Page } from '@common/exports'
import i18n from './CVAccessControlPage.i18n'

const CVAccessControlPage: React.FC = () => {
  return (
    <>
      <Page.Header
        title={i18n.title}
        toolbar={
          <Container>
            <Button text={i18n.newItem} />
          </Container>
        }
      />
      <Page.Body>
        <Page.NoDataCard icon="nav-dashboard" message={i18n.noData} buttonText={i18n.newItem} />
      </Page.Body>
    </>
  )
}

export default CVAccessControlPage
