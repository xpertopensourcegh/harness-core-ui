import React from 'react'
import { Heading, Link } from '@wings-software/uikit'
import { CommonProjectRoute } from 'modules/common/routes'

export default function OrgPage(): JSX.Element {
  return (
    <>
      <Heading>Org Page</Heading>
      <Link href={CommonProjectRoute.url()}>Go to Project Page</Link>
    </>
  )
}
