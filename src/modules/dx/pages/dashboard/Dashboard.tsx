import React from 'react'
import { Heading, Link } from '@wings-software/uikit'
import { routeProject } from 'modules/common/routes'

export default function Dashboard(): JSX.Element {
  return (
    <>
      <Heading>Hi Olivia Dunham!</Heading>
      <Heading level={2}>Welcome to Harness</Heading>
      <Link href={routeProject.url()}>Go to Project Page</Link>
    </>
  )
}
