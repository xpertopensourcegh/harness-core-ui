import React from 'react'
import { Classes, Dialog } from '@blueprintjs/core'
import cx from 'classnames'
import { stringify, parse } from 'yaml'
import { Button, Icon, Text, Layout, useModalHook, Tag } from '@wings-software/uikit'
import { useHistory, Switch, Route, useRouteMatch, Link as RrLink, useParams } from 'react-router-dom'
import { YAMLBuilderPage } from 'modules/dx/pages/yamlBuilder'
import { YamlEntity } from 'modules/common/constants/YamlConstants'
import { NavigationCheck, useToaster } from 'modules/common/exports'
import type { YamlBuilderHandlerBinding } from 'modules/common/interfaces/YAMLBuilderProps'
import type { CDPipeline, ResponseDTOString } from 'services/cd-ng'
import { PipelineContext, savePipeline } from '../PipelineContext/PipelineContext'
import i18n from './PipelineCanvas.i18n'
import CreatePipelines from '../CreateModal/PipelineCreate'
import { DefaultNewPipelineId } from '../PipelineContext/PipelineActions'
import { StageBuilder } from '../StageBuilder/StageBuilder'
import css from './PipelineCanvas.module.scss'

export const PipelineCanvas: React.FC<{}> = (): JSX.Element => {
  const { state, updatePipeline, deletePipelineCache, pipelineSaved } = React.useContext(PipelineContext)
  const {
    pipeline,
    isUpdated,
    isInitialized,
    pipelineView: { isSetupStageOpen }
  } = state

  const { showError } = useToaster()
  const { accountId, projectIdentifier, orgIdentifier, pipelineIdentifier } = useParams()

  const [yamlHandler, setYamlHandler] = React.useState<YamlBuilderHandlerBinding | undefined>()

  const history = useHistory()
  const { path, url } = useRouteMatch()
  const isYaml = history.location.pathname.endsWith('/yaml/')

  const saveAndPublish = React.useCallback(async () => {
    let response: ResponseDTOString | undefined
    if (isYaml && yamlHandler) {
      const pipeObj = parse(yamlHandler.getLatestYaml())
      response = await savePipeline(
        { accountIdentifier: accountId, projectIdentifier, orgIdentifier },
        pipeObj.pipeline,
        pipelineIdentifier !== DefaultNewPipelineId
      )
      updatePipeline(pipeObj.pipeline as CDPipeline)
    } else {
      response = await savePipeline(
        { accountIdentifier: accountId, projectIdentifier, orgIdentifier },
        pipeline,
        pipelineIdentifier !== DefaultNewPipelineId
      )
    }

    if (response && response.status === 'SUCCESS') {
      pipelineSaved()
    } else {
      showError(i18n.errorWhileSaving)
    }
  }, [
    accountId,
    projectIdentifier,
    orgIdentifier,
    pipeline,
    pipelineSaved,
    isYaml,
    updatePipeline,
    yamlHandler,
    showError,
    pipelineIdentifier
  ])

  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog isOpen={true} className={cx(css.dialog, Classes.DIALOG)}>
        <CreatePipelines afterSave={onSubmit} initialValues={pipeline} closeModal={hideModal} />
      </Dialog>
    ),
    [pipeline.identifier, pipeline]
  )
  React.useEffect(() => {
    if (isInitialized) {
      if (pipeline.identifier === DefaultNewPipelineId) {
        showModal()
      }
    }
  }, [pipeline.identifier, showModal, isInitialized])

  const onSubmit = React.useCallback(
    (data: CDPipeline) => {
      pipeline.name = data.name
      pipeline.description = data.description
      pipeline.identifier = data.identifier

      updatePipeline(pipeline)
      hideModal()
    },
    [hideModal, pipeline, updatePipeline]
  )

  return (
    <div
      className={cx(Classes.POPOVER_DISMISS, css.content)}
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <NavigationCheck
        when={isUpdated}
        shouldBlockNavigation={nextLocation => !(nextLocation.pathname.indexOf(url) > -1)}
        navigate={newPath => {
          deletePipelineCache()
          history.push(newPath)
        }}
      />
      <div className={css.topBar}>
        <div>
          {isYaml ? (
            <RrLink
              to={`${url}/`}
              onClick={() => {
                if (yamlHandler) {
                  const pipeObj = parse(yamlHandler.getLatestYaml())
                  updatePipeline(pipeObj.pipeline as CDPipeline)
                }
              }}
            >
              <div className={cx(css.topButtons)}>{i18n.visual}</div>
            </RrLink>
          ) : (
            <div className={cx(css.topButtons, css.selected)}>{i18n.visual}</div>
          )}
          {isYaml ? (
            <div className={cx(css.topButtons, css.selected)}>{i18n.yaml}</div>
          ) : (
            <RrLink to={`${url}yaml/`}>
              <div className={css.topButtons}>{i18n.yaml}</div>
            </RrLink>
          )}
          {/* <div className={css.topButtons}>SPLIT</div> */}
        </div>
        <div>
          {isUpdated && (
            <Tag intent="primary" className={css.tagRender} minimal>
              {i18n.unsavedChanges}
            </Tag>
          )}
        </div>
        <div>
          <Button
            minimal
            intent="primary"
            text={i18n.saveAndPublish}
            onClick={saveAndPublish}
            icon="arrow-up"
            className={css.savePublishBtn}
          />
        </div>
      </div>
      <div className={css.secondaryBar}>
        <Icon style={{ paddingLeft: 20 }} size={38} name="pipeline" />
        <div>
          <Text className={css.pipelineName}>{pipeline?.name}</Text>
          <Button minimal icon="Edit" iconProps={{ size: 12 }} onClick={showModal} />
        </div>
        {!isYaml && (
          <div className={css.btnGroup}>
            <Button minimal text={i18n.triggers} icon="yaml-builder-trigger" iconProps={{ color: '##303030' }} />
            <Button minimal text={i18n.inputSets} icon="yaml-builder-input-sets" iconProps={{ color: '##303030' }} />
            <Button
              minimal
              text={i18n.notifications}
              icon="yaml-builder-notifications"
              iconProps={{ color: '##303030' }}
            />
          </div>
        )}
      </div>
      <Switch>
        <Route exact path={`${path}`}>
          <Layout.Horizontal className={cx(css.canvas, { [css.canvasStageView]: isSetupStageOpen })} padding="medium">
            <StageBuilder />
          </Layout.Horizontal>
        </Route>
        <Route exact path={`${path}yaml/`}>
          <YAMLBuilderPage
            fileName="DeploymentPipeline.yaml"
            entityType={YamlEntity.PIPELINE}
            height={800}
            existingYaml={stringify({ pipeline })}
            bind={setYamlHandler}
          />
        </Route>
      </Switch>
    </div>
  )
}
