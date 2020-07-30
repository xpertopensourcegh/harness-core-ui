import { Button, Container } from '@wings-software/uikit'
import React from 'react'
import { Page } from 'modules/common/exports'
import i18n from './GovernancePage.i18n'

const GovernancePage: React.FC = () => {
  return (
    <>
      <Page.Header
        title={i18n.title}
        toolbar={
          <Container>
            <Button text={i18n.add} />
          </Container>
        }
      />
      <Page.Body>
        <Page.NoDataCard
          icon="shield"
          message={i18n.noData}
          buttonText={i18n.add}
          onClick={() => {
            alert('TBD')
          }}
        />
      </Page.Body>
    </>
  )
}

export default GovernancePage
