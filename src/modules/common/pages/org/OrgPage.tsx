import React from 'react'
import { Heading, Link } from '@wings-software/uikit'
import { routeProject } from 'modules/common/routes'
import { linkTo } from 'framework/exports'

const OrgPage: React.FC = () => {
  return (
    <>
      <Heading>Org Page</Heading>
      <Link href={linkTo(routeProject)}>Go to Project Page</Link>
    </>
  )
}

export default OrgPage
