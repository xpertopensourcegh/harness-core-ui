import React from 'react'
import { Heading, Link } from '@wings-software/uikit'
import { CommonProject } from 'modules/common/routes'
import { linkTo } from 'framework'

export default function OrgPage(): JSX.Element {
  return (
    <>
      <Heading>Org Page</Heading>
      <Link href={linkTo(CommonProject)}>Go to Project Page</Link>
    </>
  )
}
