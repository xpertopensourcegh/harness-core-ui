import { Button, Container } from '@wings-software/uicore'
import React from 'react'
import { Page } from '@common/exports'
// This page was place holder, so just added here, it requires complete revamp
const i18n = {
  title: 'ACCESS CONTROL',
  newItem: '+ new item',
  noData: 'No data found. Click the button below to create a new item.'
}
const CDAccessControlPage: React.FC = () => {
  const tbd: () => void = () => {
    alert('TBD')
  }

  return (
    <>
      <Page.Header
        title={i18n.title}
        toolbar={
          <Container>
            <Button text={i18n.newItem} onClick={tbd} />
          </Container>
        }
      />
      <Page.Body>
        <Page.NoDataCard icon="nav-dashboard" message={i18n.noData} buttonText={i18n.newItem} onClick={tbd} />
      </Page.Body>
    </>
  )
}

export default CDAccessControlPage
