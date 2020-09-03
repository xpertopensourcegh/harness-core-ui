import React from 'react'
import { Classes, Dialog } from '@blueprintjs/core'
import cx from 'classnames'
import { Button, Icon, Text, useModalHook, Tag } from '@wings-software/uikit'
import { useHistory, useRouteMatch, useParams, NavLink } from 'react-router-dom'
import { NavigationCheck, useToaster } from 'modules/common/exports'
import type { CDPipeline, ResponseDTOString } from 'services/cd-ng'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import { routeCDPipelineStudio, routeCDPipelineStudioUI, routeCDPipelineStudioYaml } from 'modules/cd/routes'
import { PipelineContext, savePipeline } from '../PipelineContext/PipelineContext'
import i18n from './PipelineCanvas.i18n'
import CreatePipelines from '../CreateModal/PipelineCreate'
import { DefaultNewPipelineId, SplitViewTypes } from '../PipelineContext/PipelineActions'
import { RightDrawer } from '../RightDrawer/RightDrawer'
import css from './PipelineCanvas.module.scss'

export const PipelineCanvas: React.FC = ({ children }): JSX.Element => {
  const { state, updatePipeline, deletePipelineCache, pipelineSaved, updatePipelineView } = React.useContext(
    PipelineContext
  )
  const {
    pipeline,
    isUpdated,
    isLoading,
    isInitialized,
    pipelineView: {
      splitViewData: { type: splitViewType }
    },
    pipelineView
  } = state

  const { showError } = useToaster()
  const { accountId, projectIdentifier, orgIdentifier, pipelineIdentifier } = useParams()

  const history = useHistory()
  const { url } = useRouteMatch()
  const isYaml = history.location.pathname.endsWith('/yaml/')

  const saveAndPublish = React.useCallback(async () => {
    const response: ResponseDTOString | undefined = await savePipeline(
      { accountIdentifier: accountId, projectIdentifier, orgIdentifier },
      pipeline,
      pipelineIdentifier !== DefaultNewPipelineId
    )
    const newPipelineId = pipeline.identifier

    if (response && response.status === 'SUCCESS') {
      pipelineSaved()
      history.replace(
        routeCDPipelineStudio.url({ projectIdentifier, orgIdentifier, pipelineIdentifier: newPipelineId })
      )
    } else {
      showError(i18n.errorWhileSaving)
    }
  }, [accountId, history, projectIdentifier, orgIdentifier, pipeline, pipelineSaved, showError, pipelineIdentifier])

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

  if (isLoading) {
    return <PageSpinner />
  }

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
          <NavLink
            className={css.topButtons}
            activeClassName={css.selected}
            to={routeCDPipelineStudioUI.url({ orgIdentifier, projectIdentifier, pipelineIdentifier })}
          >
            {i18n.visual}
          </NavLink>
          <NavLink
            className={css.topButtons}
            activeClassName={css.selected}
            to={routeCDPipelineStudioYaml.url({ orgIdentifier, projectIdentifier, pipelineIdentifier })}
          >
            {i18n.yaml}
          </NavLink>
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
            <Button
              minimal={!(splitViewType === SplitViewTypes.Triggers)}
              intent={splitViewType === SplitViewTypes.Triggers ? 'primary' : 'none'}
              text={i18n.triggers}
              tooltip={i18n.triggers}
              icon="yaml-builder-trigger"
              iconProps={{ color: 'var(--dark-500)' }}
              onClick={() => {
                updatePipelineView({
                  ...pipelineView,
                  isSplitViewOpen: true,
                  splitViewData: { type: SplitViewTypes.Triggers }
                })
              }}
            />
            <Button
              minimal={!(splitViewType === SplitViewTypes.Notifications)}
              text={i18n.notifications}
              intent={splitViewType === SplitViewTypes.Notifications ? 'primary' : 'none'}
              tooltip={i18n.notifications}
              icon="yaml-builder-notifications"
              iconProps={{ color: 'var(--dark-500)' }}
              onClick={() => {
                updatePipelineView({
                  ...pipelineView,
                  isSplitViewOpen: true,
                  splitViewData: { type: SplitViewTypes.Notifications }
                })
              }}
            />
          </div>
        )}
      </div>
      {children}
      <RightDrawer />
    </div>
  )
}
