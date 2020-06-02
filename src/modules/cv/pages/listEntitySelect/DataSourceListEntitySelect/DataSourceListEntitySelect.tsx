import React from 'react'
import { useLocation } from 'react-router'
import { Container, Heading, Color, Layout } from '@wings-software/uikit'

export default function DataSourceListEntitySelect(): JSX.Element {
  const { state } = useLocation()
  return (
    <Container>
      <Heading level={2} color={Color.BLACK}>
        Select a Product
      </Heading>
      <Layout.Horizontal>
        <Container></Container>
      </Layout.Horizontal>
    </Container>
  )
}
