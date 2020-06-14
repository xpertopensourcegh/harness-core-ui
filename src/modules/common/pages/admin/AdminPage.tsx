import { Button, Container } from '@wings-software/uikit'
import { Page } from 'modules/common/exports'
import React from 'react'
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
