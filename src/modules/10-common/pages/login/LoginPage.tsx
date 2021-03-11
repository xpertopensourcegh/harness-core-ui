import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Callout } from '@blueprintjs/core'
import { FormInput, Formik, FormikForm, Card, Button, Layout } from '@wings-software/uicore'
import AppStorage from 'framework/utils/AppStorage'
import routes from '@common/RouteDefinitions'
import { useToaster } from '@common/components'
import { useQueryParams } from '@common/hooks'

import css from './LoginPage.module.scss'

interface LoginForm {
  email: string
  password: string
}

const createAuthToken = (login: string, password: string): string => {
  const encodedToken = btoa(login + ':' + password)
  return `Basic ${encodedToken}`
}

/**
 * This page is meant only for dev-testing to allow easier login
 * using email/password on internal environments, until the real
 * login page gets moved from current gen UI.
 *
 * It should only be rendered behind the __DEV__ flag.
 */

const LoginPage: React.FC = () => {
  const history = useHistory()
  const { showError } = useToaster()
  const { returnUrl } = useQueryParams<{ returnUrl?: string }>()
  const [isLoading, setLoading] = React.useState(false)

  const handleLogin = async (data: LoginForm): Promise<void> => {
    try {
      setLoading(true)
      // hacky/temporary fetch call
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ authorization: createAuthToken(data.email, data.password) })
      })

      const json = await response.json()

      AppStorage.set('token', json.resource.token)
      AppStorage.set('acctId', json.resource.defaultAccountId)

      // this is naive redirect for now
      if (returnUrl) {
        window.location.href = returnUrl
      } else {
        history.push(routes.toProjects({ accountId: json.resource.defaultAccountId }))
      }
    } catch (e) {
      setLoading(false)
      showError(e)
    }
  }

  const handleSubmit = (data: LoginForm): void => {
    handleLogin(data)
  }

  return (
    <div className={css.loginPage}>
      <Card className={css.card}>
        <Layout.Vertical spacing="large">
          <Formik<LoginForm> initialValues={{ email: '', password: '' }} onSubmit={handleSubmit}>
            <FormikForm>
              <FormInput.Text name="email" label="Email" disabled={isLoading} />
              <FormInput.Text name="password" label="Password" inputGroup={{ type: 'password' }} disabled={isLoading} />
              <Button type="submit" intent="primary" loading={isLoading} disabled={isLoading}>
                Submit
              </Button>
            </FormikForm>
          </Formik>
          <Link to={routes.toSignup()}>Sign up for an account</Link>
          <Callout intent="warning">This page is only meant for dev testing</Callout>
        </Layout.Vertical>
      </Card>
    </div>
  )
}

export default LoginPage
