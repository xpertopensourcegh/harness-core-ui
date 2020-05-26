import React from 'react'
import { Heading, Link } from '@wings-software/uikit'
import { routeProject } from 'modules/common/routes'
import { linkTo } from 'framework'

export default function OrgPage(): JSX.Element {
  return (
    <>
      <Heading>Org Page</Heading>
      <Link href={linkTo(routeProject)}>Go to Project Page</Link>
    </>
  )
}
