import React from 'react'
import { Heading, Link } from '@wings-software/uikit'
import { routeOrg } from 'modules/common/routes'
import { linkTo } from 'framework'

export default function ProjectPage(): JSX.Element {
  return (
    <>
      <Heading>Project Page</Heading>
      <Link href={linkTo(routeOrg)}>Go to Org Page</Link>
    </>
  )
}
