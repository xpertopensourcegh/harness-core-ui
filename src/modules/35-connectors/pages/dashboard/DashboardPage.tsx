import { Button, Container } from '@wings-software/uicore'
import React from 'react'
import { Page } from '@common/exports'
import i18n from './DashboardPage.i18n'

const DashboardPage: React.FC = () => {
  return (
    <>
      <Page.Header
        title={i18n.dashboard}
        toolbar={
          <Container>
            <Button text={i18n.newDashboard} />
          </Container>
        }
      />
      <Page.Body>
        <Page.NoDataCard
          icon="nav-dashboard"
          message={i18n.noData}
          buttonText={i18n.newDashboard}
          onClick={() => {
            alert('TBD')
          }}
        />
      </Page.Body>
    </>
  )
}

export default DashboardPage
