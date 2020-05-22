import React from 'react'
import { Heading, Link } from '@wings-software/uikit'
import { OrgRoute } from 'modules/common/routes'

export default function ProjectPage(): JSX.Element {
  return (
    <>
      <Heading>Project Page</Heading>
      <Link href={OrgRoute.url()}>Go to Org Page</Link>
    </>
  )
}
