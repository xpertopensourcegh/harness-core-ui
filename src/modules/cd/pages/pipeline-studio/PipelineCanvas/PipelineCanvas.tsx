import React from 'react'
import { Classes, Dialog } from '@blueprintjs/core'
import cx from 'classnames'
import { Button, Icon, Text, useModalHook, Tag } from '@wings-software/uikit'
import { useHistory, useParams, NavLink, matchPath } from 'react-router-dom'
import { parse } from 'yaml'
import { NavigationCheck, useToaster, useConfirmationDialog } from 'modules/common/exports'
import type { CDPipeline, Failure } from 'services/cd-ng'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import { routeCDPipelineStudio, routeCDPipelineStudioUI, routeCDPipelineStudioYaml } from 'modules/cd/routes'
import { AUTH_ROUTE_PATH_PREFIX } from 'framework/exports'
import { PipelineContext, savePipeline } from '../PipelineContext/PipelineContext'
import i18n from './PipelineCanvas.i18n'
import CreatePipelines from '../CreateModal/PipelineCreate'
import { DefaultNewPipelineId, SplitViewTypes } from '../PipelineContext/PipelineActions'
import { RightDrawer } from '../RightDrawer/RightDrawer'
import css from './PipelineCanvas.module.scss'

export const PipelineCanvas: React.FC = ({ children }): JSX.Element => {
  const { state, updatePipeline, deletePipelineCache, updatePipelineView, fetchPipeline } = React.useContext(
    PipelineContext
  )
  const {
    pipeline,
    isUpdated,
    isLoading,
    isInitialized,
    yamlHandler,
    isBEPipelineUpdated,
    pipelineView: {
      splitViewData: { type: splitViewType }
    },
    pipelineView
  } = state

  const { showError } = useToaster()
  const { accountId, projectIdentifier, orgIdentifier, pipelineIdentifier } = useParams()

  const [discardBEUpdateDialog, setDiscardBEUpdate] = React.useState(false)
  const { openDialog: openConfirmBEUpdateError } = useConfirmationDialog({
    cancelButtonText: i18n.cancel,
    contentText: i18n.pipelineUpdatedError,
    titleText: i18n.pipelineUpdated,
    confirmButtonText: i18n.update,
    onCloseDialog: isConfirmed => {
      if (isConfirmed) {
        fetchPipeline(true, true)
      } else {
        setDiscardBEUpdate(true)
      }
    }
  })

  const history = useHistory()
  const isYaml = history.location.pathname.endsWith('/yaml/')

  const saveAndPublish = React.useCallback(async () => {
    let response: Failure | undefined
    let latestPipeline: CDPipeline = pipeline
    if (isYaml && yamlHandler) {
      latestPipeline = parse(yamlHandler.getLatestYaml()).pipeline as CDPipeline
      response = await savePipeline(
        { accountIdentifier: accountId, projectIdentifier, orgIdentifier },
        latestPipeline,
        pipelineIdentifier !== DefaultNewPipelineId
      )
    } else {
      response = await savePipeline(
        { accountIdentifier: accountId, projectIdentifier, orgIdentifier },
        latestPipeline,
        pipelineIdentifier !== DefaultNewPipelineId
      )
    }

    const newPipelineId = latestPipeline.identifier

    if (response && response.status === 'SUCCESS') {
      if (pipelineIdentifier === DefaultNewPipelineId) {
        await deletePipelineCache()
        if (isYaml) {
          history.replace(
            routeCDPipelineStudioYaml.url({ projectIdentifier, orgIdentifier, pipelineIdentifier: newPipelineId })
          )
        } else {
          history.replace(
            routeCDPipelineStudio.url({ projectIdentifier, orgIdentifier, pipelineIdentifier: newPipelineId })
          )
        }
        location.reload()
      } else {
        fetchPipeline(true, true)
      }
    } else {
      showError(response?.message || i18n.errorWhileSaving)
    }
  }, [
    deletePipelineCache,
    accountId,
    history,
    projectIdentifier,
    orgIdentifier,
    pipeline,
    fetchPipeline,
    showError,
    pipelineIdentifier,
    isYaml,
    yamlHandler
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
      if (isBEPipelineUpdated && !discardBEUpdateDialog) {
        openConfirmBEUpdateError()
      }
    }
  }, [
    pipeline.identifier,
    showModal,
    isInitialized,
    isBEPipelineUpdated,
    openConfirmBEUpdateError,
    discardBEUpdateDialog
  ])

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
        e.stopPropagation()
      }}
    >
      <NavigationCheck
        when={isUpdated}
        shouldBlockNavigation={nextLocation => {
          const matchUI = matchPath(nextLocation.pathname, {
            path: AUTH_ROUTE_PATH_PREFIX + routeCDPipelineStudioUI.path,
            exact: true
          })
          const matchYaml = matchPath(nextLocation.pathname, {
            path: AUTH_ROUTE_PATH_PREFIX + routeCDPipelineStudioYaml.path,
            exact: true
          })
          const matchDefault = matchPath(nextLocation.pathname, {
            path: AUTH_ROUTE_PATH_PREFIX + routeCDPipelineStudio.path,
            exact: true
          })
          return !(matchUI?.isExact || matchYaml?.isExact || matchDefault?.isExact)
        }}
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
