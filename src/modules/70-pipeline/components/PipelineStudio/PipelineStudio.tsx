import React from 'react'
import cx from 'classnames'
import { Button, Layout, Text } from '@wings-software/uicore'
import type { PipelinePathProps, ProjectPathProps, PathFn, PipelineType } from '@common/interfaces/RouteInterfaces'

import { String } from 'framework/exports'
import { PipelineCanvas } from './PipelineCanvas/PipelineCanvas'
import { RightBar } from './RightBar/RightBar'
import { PipelineContext } from './PipelineContext/PipelineContext'
import css from './PipelineStudio.module.scss'

export interface PipelineStudioProps {
  className?: string
  title?: string
  onClose?: () => void
  routePipelineStudio: PathFn<PipelineType<PipelinePathProps>>
  routePipelineStudioUI: PathFn<PipelineType<PipelinePathProps>>
  routePipelineStudioYaml: PathFn<PipelineType<PipelinePathProps>>
  routePipelineDetail: PathFn<PipelineType<PipelinePathProps>>
  routePipelineList: PathFn<PipelineType<ProjectPathProps>>
  routePipelineProject: PathFn<PipelineType<ProjectPathProps>>
}

interface PipelineStudioState {
  error?: boolean
}
export class PipelineStudio extends React.Component<PipelineStudioProps, PipelineStudioState> {
  state: PipelineStudioState = { error: false }
  context!: React.ContextType<typeof PipelineContext>
  static contextType = PipelineContext

  componentDidCatch(): boolean {
    this.setState({ error: true })
    return false
  }

  render(): JSX.Element {
    const { error } = this.state
    const { deletePipelineCache } = this.context
    if (error) {
      return (
        <Layout.Vertical spacing="medium" padding="large">
          <Text>
            <String stringID="errorTitle" />
          </Text>
          <Text>
            <String stringID="errorSubtitle" />
          </Text>
          <Layout.Horizontal style={{ alignItems: 'baseline' }}>
            <Text>
              <String stringID="please" />
            </Text>
            <Button
              onClick={() => {
                return deletePipelineCache().then(() => {
                  window.location.reload()
                })
              }}
              minimal
            >
              <String stringID="clickHere" />
            </Button>
            <Text>
              <String stringID="errorHelp" />
            </Text>
          </Layout.Horizontal>
        </Layout.Vertical>
      )
    }
    const {
      children,
      className = '',
      routePipelineStudio,
      routePipelineStudioUI,
      routePipelineStudioYaml,
      routePipelineDetail,
      routePipelineList,
      routePipelineProject
    } = this.props
    return (
      <div className={cx(css.container, className)}>
        <PipelineCanvas
          toPipelineStudio={routePipelineStudio}
          toPipelineStudioUI={routePipelineStudioUI}
          toPipelineStudioYaml={routePipelineStudioYaml}
          toPipelineDetail={routePipelineDetail}
          toPipelineList={routePipelineList}
          toPipelineProject={routePipelineProject}
        >
          {children}
        </PipelineCanvas>
        <RightBar />
      </div>
    )
  }
}
