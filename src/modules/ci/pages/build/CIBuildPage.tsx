import React, { useState } from 'react'
import { Container, Button, Icon, Intent } from '@wings-software/uikit'
import { Tabs as BPTabs } from '@blueprintjs/core'
import { Link, useParams, useHistory } from 'react-router-dom'
import moment from 'moment'
import { RoundButtonGroup } from 'modules/ci/components/RoundButtonGroup/RoundButtonGroup'
import { Tabs, Tab } from 'modules/ci/components/Tabs/Tabs'
import { ExtendedPageHeader } from 'modules/ci/components/ExtendedPage/ExtendedPageHeader'
import { TitledInfo } from 'modules/ci/components/TitledInfo/TitledInfo'
import { isRouteActive } from 'framework/exports'
import Status from 'modules/ci/components/Status/Status'
import { ExecutionStatus, status2Message } from 'modules/ci/components/common/status'
import ElapsedTime from 'modules/ci/components/ElapsedTime/ElapsedTime'
import ExtendedPage from 'modules/ci/components/ExtendedPage/ExtendedPage'
import ExtendedPageBody from 'modules/ci/components/ExtendedPage/ExtendedPageBody'
import { getShortCommitId } from 'modules/ci/services/CIUtils'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import {
  routeCIBuildPipelineGraph,
  routeCIBuildPipelineLog,
  routeCIBuildInputs,
  routeCIBuildCommits,
  routeCIBuildTests,
  routeCIBuildArtifacts
} from '../../routes'
import { BuildPageContextProvider } from './context/BuildPageContextProvider'
import { BuildPageContext } from './context/BuildPageContext'
import i18n from './CIBuildPage.i18n'
import css from './CIBuildPage.module.scss'

export interface BuildPageUrlParams {
  accountId: string
  orgIdentifier: string
  projectIdentifier: string
  buildIdentifier: string
}

const CIBuildPage: React.FC = props => {
  const { children } = props
  const { orgIdentifier, projectIdentifier, buildIdentifier } = useParams<BuildPageUrlParams>()
  const [detailsVisible, setDetailsVisible] = useState<boolean>(false)
  const history = useHistory()
  const { buildData } = React.useContext(BuildPageContext)

  let selectedTabId = ''
  if (isRouteActive(routeCIBuildPipelineGraph)) selectedTabId = 'ciPipelineTab'
  else if (isRouteActive(routeCIBuildPipelineLog)) selectedTabId = 'ciPipelineTab'
  else if (isRouteActive(routeCIBuildInputs)) selectedTabId = 'ciInputsTab'
  else if (isRouteActive(routeCIBuildCommits)) selectedTabId = 'ciCommitsTab'
  else if (isRouteActive(routeCIBuildTests)) selectedTabId = 'ciTestsTab'
  else if (isRouteActive(routeCIBuildArtifacts)) selectedTabId = 'ciArtifactsTab'

  const pipelineGraphUrl = routeCIBuildPipelineGraph.url({ orgIdentifier, projectIdentifier, buildIdentifier })
  const pipelineLogUrl = routeCIBuildPipelineLog.url({ orgIdentifier, projectIdentifier, buildIdentifier })
  const inputsUrl = routeCIBuildInputs.url({ orgIdentifier, projectIdentifier, buildIdentifier })
  const commitsUrl = routeCIBuildCommits.url({ orgIdentifier, projectIdentifier, buildIdentifier })
  const testsUrl = routeCIBuildTests.url({ orgIdentifier, projectIdentifier, buildIdentifier })
  const artifactsUrl = routeCIBuildArtifacts.url({ orgIdentifier, projectIdentifier, buildIdentifier })

  return (
    <ExtendedPage>
      {buildData ? (
        <>
          <ExtendedPageHeader
            title={buildData?.data.pipeline.name}
            toolbar={
              <Container>
                <Button
                  minimal
                  icon={detailsVisible ? 'caret-up' : 'caret-down'}
                  onClick={() => {
                    setDetailsVisible(!detailsVisible)
                  }}
                />
              </Container>
            }
            rowOneContent={
              <>
                <Status status={(buildData?.data.status as unknown) as ExecutionStatus}>
                  {status2Message((buildData?.data.status as unknown) as ExecutionStatus)}
                </Status>
                <ElapsedTime startTime={buildData?.data.startTime || 0} />
              </>
            }
            rowTwoContent={
              <>
                <TitledInfo title={i18n.infoBuildNo} value={buildData?.data.id} />
                <TitledInfo title={i18n.infoRepository} value={buildData?.data.branch?.link} maxWidth={'350px'} />
                <TitledInfo title={i18n.infoBranch} value={buildData?.data.branch?.name} />
                <TitledInfo
                  title={i18n.infoCommitId}
                  value={getShortCommitId(buildData?.data.branch?.commits[0].id || '')}
                />
                <TitledInfo title={i18n.infoCommitMessage} value={buildData?.data.branch?.commits[0].message} />
              </>
            }
            rowThreeContent={
              detailsVisible ? (
                <>
                  <TitledInfo title={i18n.infoTriggerType} value={buildData?.data.triggerType} />
                  <TitledInfo title={i18n.infoTriggerBy} value={buildData?.data.author.id} />
                  <TitledInfo
                    title={i18n.infoStartTime}
                    value={
                      buildData?.data.startTime
                        ? moment.unix(buildData?.data.startTime).format('MM/DD/YY hh:mm:ss A')
                        : '-'
                    }
                  />
                  <TitledInfo
                    title={i18n.infoEndTime}
                    value={
                      buildData?.data.endTime ? moment.unix(buildData?.data.endTime).format('MM/DD/YY hh:mm:ss A') : '-'
                    }
                  />
                </>
              ) : null
            }
          />
          <ExtendedPageBody className={css.pageBody}>
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
          </ExtendedPageBody>
        </>
      ) : (
        <PageSpinner />
      )}
    </ExtendedPage>
  )
}

const CIBuildPageWithProvider: React.FC = props => {
  return (
    <BuildPageContextProvider>
      <CIBuildPage>{props.children}</CIBuildPage>
    </BuildPageContextProvider>
  )
}
export default CIBuildPageWithProvider
