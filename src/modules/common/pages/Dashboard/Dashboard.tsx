import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Heading, Layout, Button } from '@wings-software/uikit'
import { getUsers } from 'modules/common/services/UserService'

import css from './Dashboard.module.scss'

const Dashboard: React.FC = () => {
  const { accountId } = useParams()

  useEffect(() => {
    getUsers({ accountId })
  })

  return (
    <div className={css.main}>
      <Heading>Dashboard</Heading>
      <Link to="/pipeline-studio">Go to Pipeline Studio</Link>
      <br />
      <Layout.Horizontal spacing="small" id="primary-buttons">
        <Button icon="add" text="Test Button" intent="primary" onClick={() => alert('Hello World')} />
        <Button intent="primary" icon="plus" onClick={() => alert('Hello World')} />
      </Layout.Horizontal>
    </div>
  )
}

export default Dashboard
