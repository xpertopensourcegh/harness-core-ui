import React from 'react'
import { Heading, Link } from '@wings-software/uikit'
import { CommonOrg } from 'modules/common/routes'
import { linkTo } from 'framework'

export default function ProjectPage(): JSX.Element {
  return (
    <>
      <Heading>Project Page</Heading>
      <Link href={linkTo(CommonOrg)}>Go to Org Page</Link>
    </>
  )
}
