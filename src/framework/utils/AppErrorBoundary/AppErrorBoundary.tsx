import React from 'react'
import { Text, Layout } from '@wings-software/uikit'

import i18n from './AppErrorBoundary.i18n.json'

interface AppErrorBoundaryState {
  error?: Error
}

class AppErrorBoundary extends React.Component<{}, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: undefined }

  componentDidCatch(error: Error): boolean {
    this.setState({ error })
    return false
  }

  render(): React.ReactNode {
    const { error } = this.state

    if (error) {
      return (
        <Layout.Vertical spacing="medium">
          <Text>{i18n.title}</Text>
          <Text>{i18n.subtitle}</Text>
          <Text>
            {i18n.please}
            <a
              href="#"
              onClick={e => {
                e.preventDefault()
                window.location.reload()
              }}
            >
              {i18n.refresh}
            </a>
            {i18n.continue}
          </Text>
          {__DEV__ && (
            <React.Fragment>
              <Text font="small">{error.message}</Text>
              <Text>
                <details>
                  <summary>{i18n.stackTrace}</summary>
                  <pre>{error.stack}</pre>
                </details>
              </Text>
            </React.Fragment>
          )}
        </Layout.Vertical>
      )
    }

    return <>{this.props.children}</>
  }
}

export default AppErrorBoundary
