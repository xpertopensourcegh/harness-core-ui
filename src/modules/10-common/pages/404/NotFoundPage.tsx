import React from 'react'
import { Icon, Layout, Heading, Text, Container, Link } from '@wings-software/uicore'

export default function NotFoundPage(): JSX.Element {
  return (
    <Container height="100%" flex={{ align: 'center-center' }}>
      <Layout.Vertical spacing="large" flex={{ align: 'center-center' }}>
        <Heading>404</Heading>
        <Text>Oops, we could not find this page.</Text>
        <Link href="/">Go to Home</Link>
        <Icon name="harness-logo-black" size={200} />
      </Layout.Vertical>
    </Container>
  )
}
