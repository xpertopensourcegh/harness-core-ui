import { Color, Container, Layout, Text } from '@wings-software/uikit'
import React from 'react'

//
// TODO Depends on Development type and execution, Tooltip for
// each service is vary. Just place-holders for now.
//
export const ExecutionServiceTooltip: React.FC = () => {
  return (
    <Layout.Vertical spacing="small" padding="large">
      <Container>
        <Text color={Color.GREY_400} font="small">
          Primary Artifact
        </Text>
        <Text color={Color.BLACK}>harness/todolist-sample (tag #123)</Text>
      </Container>
      <Container>
        <Text color={Color.GREY_400} font="small">
          Sidecars
        </Text>
        <Text color={Color.BLACK}>harness/todolist-sample (tag #123)</Text>
      </Container>
      <Container>
        <Text color={Color.GREY_400} font="small">
          Manifest
        </Text>
        <Text color={Color.BLACK}>harness/todolist-sample (tag #123)</Text>
      </Container>
    </Layout.Vertical>
  )
}
