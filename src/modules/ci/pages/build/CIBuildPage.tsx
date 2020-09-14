import React from 'react'
import { Container, Button, Icon, Intent } from '@wings-software/uikit'
import { Tabs as BPTabs } from '@blueprintjs/core'
import { Link, useParams, useHistory } from 'react-router-dom'
import { Page } from 'modules/common/exports'
import { RoundButtonGroup } from 'modules/ci/components/RoundButtonGroup/RoundButtonGroup'
import { Tabs, Tab } from 'modules/ci/components/Tabs/Tabs'
import { ExtendedPageHeader } from 'modules/ci/components/ExtendedPage/ExtendedPageHeader'
import { TitledInfo } from 'modules/ci/components/TitledInfo/TitledInfo'
import { isRouteActive } from 'framework/exports'
import Status from 'modules/ci/components/Status/Status'
import { ExecutionStatus, status2Message } from 'modules/ci/components/common/status'
import ElapsedTime from 'modules/ci/components/ElapsedTime/ElapsedTime'
import { getTimeStamp } from 'modules/ci/components/common/time'
import {
  routeCIBuildPipelineGraph,
  routeCIBuildPipelineLog,
  routeCIBuildInputs,
  routeCIBuildCommits,
  routeCIBuildTests,
  routeCIBuildArtifacts
} from '../../routes'
import i18n from './CIBuildPage.i18n'
import css from './CIBuildPage.module.scss'

const CIBuildPage: React.FC = props => {
  const { children } = props
  const { projectIdentifier, buildIdentifier } = useParams()
  const history = useHistory()

  let selectedTabId = ''
  if (isRouteActive(routeCIBuildPipelineGraph)) selectedTabId = 'ciPipelineTab'
  else if (isRouteActive(routeCIBuildPipelineLog)) selectedTabId = 'ciPipelineTab'
  else if (isRouteActive(routeCIBuildInputs)) selectedTabId = 'ciInputsTab'
  else if (isRouteActive(routeCIBuildCommits)) selectedTabId = 'ciCommitsTab'
  else if (isRouteActive(routeCIBuildTests)) selectedTabId = 'ciTestsTab'
  else if (isRouteActive(routeCIBuildArtifacts)) selectedTabId = 'ciArtifactsTab'

  const pipelineGraphUrl = routeCIBuildPipelineGraph.url({ projectIdentifier, buildIdentifier })
  const pipelineLogUrl = routeCIBuildPipelineLog.url({ projectIdentifier, buildIdentifier })
  const inputsUrl = routeCIBuildInputs.url({ projectIdentifier, buildIdentifier })
  const commitsUrl = routeCIBuildCommits.url({ projectIdentifier, buildIdentifier })
  const testsUrl = routeCIBuildTests.url({ projectIdentifier, buildIdentifier })
  const artifactsUrl = routeCIBuildArtifacts.url({ projectIdentifier, buildIdentifier })

  return (
    <Container>
      <ExtendedPageHeader
        title={'Pipeline name'}
        toolbar={
          <Container>
            <Icon name="control" />
          </Container>
        }
        rowOneContent={
          <>
            <Status status={ExecutionStatus.IN_PROGRESS}>{status2Message(ExecutionStatus.IN_PROGRESS)}</Status>
            <ElapsedTime startTime={getTimeStamp() - 1000} />
          </>
        }
        rowTwoContent={
          <>
            <TitledInfo title="BUILD #" value="123" />
            <TitledInfo title="REPOSITORY" value="sample-repo/test" />
            <TitledInfo title="BRANCH" value="master" />
            <TitledInfo title="COMMIT ID" value="1234567" />
            <TitledInfo title="COMMIT MESSAGE" value="Initial commit" />
          </>
        }
      />
      <Page.Body>
        {/*animate=false required, otherwise tabs behave buggy*/}
        <Tabs animate={false} id="ciExecutionTabs" selectedTabId={selectedTabId}>
          <Tab
            id="ciPipelineTab"
            title={
              <Link to={pipelineGraphUrl}>
                <Icon name="path" /> {i18n.pipeline}
              </Link>
            }
          />
          <Tab
            id="ciInputsTab"
            title={
              <Link to={inputsUrl}>
                <Icon name="lab-test" /> {i18n.inputs}
              </Link>
            }
          />
          <Tab
            id="ciCommitsTab"
            title={
              <Link to={commitsUrl}>
                <Icon name="lab-test" /> {i18n.commits}
              </Link>
            }
          />
          <Tab
            id="ciTestsTab"
            title={
              <Link to={testsUrl}>
                <Icon name="lab-test" /> {i18n.tests}
              </Link>
            }
          />
          <Tab
            id="ciArtifactsTab"
            title={
              <Link to={artifactsUrl}>
                <Icon name="lab-test" /> {i18n.artifacts}
              </Link>
            }
          />
          <BPTabs.Expander />
          {(isRouteActive(routeCIBuildPipelineGraph) || isRouteActive(routeCIBuildPipelineLog)) && (
            <Container className={css.extendedTabContent}>
              <RoundButtonGroup>
                <Button
                  icon="graph"
                  active={isRouteActive(routeCIBuildPipelineGraph)}
                  onClick={() => history.push(pipelineGraphUrl)}
                >
                  {i18n.graphView}
                </Button>
                <Button
                  icon="graph"
                  active={isRouteActive(routeCIBuildPipelineLog)}
                  onClick={() => history.push(pipelineLogUrl)}
                >
                  {i18n.logView}
                </Button>
              </RoundButtonGroup>
              <Icon name="warning-sign" intent={Intent.DANGER} size={24} />
            </Container>
          )}
        </Tabs>
        {children}
      </Page.Body>
    </Container>
  )
}

export default CIBuildPage
