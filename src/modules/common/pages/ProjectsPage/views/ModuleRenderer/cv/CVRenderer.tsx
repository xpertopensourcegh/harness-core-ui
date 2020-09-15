import React from 'react'
import { Text, Color, Container, Layout, Icon } from '@wings-software/uikit'
import i18n from './CVRenderer.i18n'

const CVRenderer: React.FC = () => {
  return (
    <Container border={{ top: true, color: Color.GREY_250 }} padding={{ top: 'medium', bottom: 'medium' }}>
      <Layout.Horizontal>
        <Container width="33.33%" border={{ right: true, color: Color.GREY_250 }}>
          <Icon name="nav-cv-hover" size={30} flex={{ align: 'center-center' }} />
        </Container>
        <Container width="33.33%" border={{ right: true, color: Color.GREY_250 }} flex={{ align: 'center-center' }}>
          <Layout.Vertical>
            <Text font="medium" flex={{ align: 'center-center' }}>
              {i18n.placeholder}
            </Text>
            <Text font="xsmall">{i18n.activities.toUpperCase()}</Text>
          </Layout.Vertical>
        </Container>

        <Container width="33.33%" flex={{ align: 'center-center' }}>
          <Layout.Vertical>
            <Text font="medium" color={Color.RED_600} flex={{ align: 'center-center' }}>
              {i18n.placeholder}
            </Text>
            <Text font="xsmall">{i18n.anomalies.toUpperCase()}</Text>
          </Layout.Vertical>
        </Container>
      </Layout.Horizontal>
    </Container>
  )
}

export default CVRenderer
