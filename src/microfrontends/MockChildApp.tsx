import React from 'react'
import { PageError } from '@common/components/Page/PageError'

const devErrorMsg = 'This app is rendered using microfrontends. Looks like it is not reachable.'

export default function MockChildApp(): React.ReactElement {
  return <PageError message={__DEV__ ? devErrorMsg : ''} />
}
