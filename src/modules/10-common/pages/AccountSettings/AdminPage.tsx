import { Button, Container } from '@wings-software/uicore'
import React from 'react'
import { Page } from '@common/exports'
import i18n from './AdminPage.i18n'

const AdminPage: React.FC = () => {
  return (
    <>
      <Page.Header
        title={i18n.title}
        toolbar={
          <Container>
            <Button text={i18n.addUser} />
          </Container>
        }
      />
      <Page.Body>
        <Page.NoDataCard
          icon="user"
          message={i18n.noData}
          buttonText={i18n.addUser}
          onClick={() => {
            alert('TBD')
          }}
        />
      </Page.Body>
    </>
  )
}

export default AdminPage
