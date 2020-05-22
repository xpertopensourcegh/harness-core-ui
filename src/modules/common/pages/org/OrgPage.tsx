import React from 'react'
import { Heading, Link } from '@wings-software/uikit'
import { ProjectRoute } from 'modules/common/routes'

export default function OrgPage(): JSX.Element {
  return (
    <>
      <Heading>Org Page</Heading>
      <Link href={ProjectRoute.url()}>Go to Org Page</Link>
    </>
  )
}
