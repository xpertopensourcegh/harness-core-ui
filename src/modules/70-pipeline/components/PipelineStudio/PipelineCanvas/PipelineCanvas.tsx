import React from 'react'
import { Classes, Dialog } from '@blueprintjs/core'
import cx from 'classnames'
import { Button, Text, useModalHook, Tag } from '@wings-software/uikit'
import { useHistory, useParams, NavLink, matchPath } from 'react-router-dom'
import { parse } from 'yaml'
import { useAppStore, useStrings } from 'framework/exports'
import type { NgPipeline } from 'services/cd-ng'
import type { Failure } from 'services/pipeline-ng'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import { useToaster } from '@common/components/Toaster/useToaster'
import { NavigationCheck } from '@common/components/NavigationCheck/NavigationCheck'
import { useConfirmationDialog } from '@common/modals/ConfirmDialog/useConfirmationDialog'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import type { PipelinePathProps, ProjectPathProps, PathFn, PipelineType } from '@common/interfaces/RouteInterfaces'
import { accountPathProps, pipelineModuleParams, pipelinePathProps } from '@common/utils/routeUtils'

import { PipelineContext, savePipeline } from '../PipelineContext/PipelineContext'
import CreatePipelines from '../CreateModal/PipelineCreate'
import { DefaultNewPipelineId, SplitViewTypes } from '../PipelineContext/PipelineActions'
import { RightDrawer } from '../RightDrawer/RightDrawer'
// import AddDrawer, { DrawerContext } from '@common/components/AddDrawer/AddDrawer'
// import { getStageFromPipeline } from '../StageBuilder/StageBuilderUtil'
// import { addStepOrGroup, generateRandomString } from '../ExecutionGraph/ExecutionGraphUtil'

// import { getAddDrawerMap, getCategoryItems } from './PipelineCanvasUtils'
import css from './PipelineCanvas.module.scss'

export interface PipelineCanvasProps {
  toPipelineStudio: PathFn<PipelineType<PipelinePathProps>>
  toPipelineStudioUI: PathFn<PipelineType<PipelinePathProps>>
  toPipelineStudioYaml: PathFn<PipelineType<PipelinePathProps>>
  toPipelineDetail: PathFn<PipelineType<PipelinePathProps>>
  toPipelineList: PathFn<PipelineType<ProjectPathProps>>
  toPipelineProject: PathFn<PipelineType<ProjectPathProps>>
}

export const PipelineCanvas: React.FC<PipelineCanvasProps> = ({
  children,
  toPipelineDetail,
  toPipelineList,
  toPipelineProject,
  toPipelineStudio,
  toPipelineStudioUI,
  toPipelineStudioYaml
}): JSX.Element => {
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
      // splitViewData: { type: splitViewType, selectedStageId }
    },
    // pipelineView: { drawerData, isDrawerOpened },
    pipelineView
  } = state
  // const { stage: selectedStage } = getStageFromPipeline(pipeline, selectedStageId || '')

  const { showError } = useToaster()
  const { getString } = useStrings()

  const { accountId, projectIdentifier, orgIdentifier, pipelineIdentifier, module } = useParams<
    PipelineType<{
      orgIdentifier: string
      projectIdentifier: string
      pipelineIdentifier: string
      accountId: string
    }>
  >()
  // todo: test before enabling
  // const addDrawerMap =
  //   isDrawerOpened && stageType && selectedStage
  //     ? getAddDrawerMap(getCategoryItems(stageType, selectedStage), stageType)
  //     : null

  // const onStepSelect = (item: StepData) => {
  //   const paletteData = drawerData?.data.paletteData
  //   if (paletteData?.entity) {
  //     const { stage: pipelineStage } = getStageFromPipeline(pipeline, selectedStageId)
  //     addStepOrGroup(
  //       paletteData.entity,
  //       pipelineStage?.stage.spec.execution,
  //       {
  //         step: {
  //           type: item.type,
  //           name: item.name,
  //           identifier: generateRandomString(item.name)
  //         }
  //       },
  //       paletteData.isParallelNodeClicked,
  //       paletteData.isRollback
  //     )
  //     updatePipeline(pipeline)
  //   }
  //   updatePipelineView({ ...pipelineView, isDrawerOpened: false, drawerData: { type: DrawerTypes.AddStep } })
  // }

  const [discardBEUpdateDialog, setDiscardBEUpdate] = React.useState(false)
  const { openDialog: openConfirmBEUpdateError } = useConfirmationDialog({
    cancelButtonText: getString('cancel'),
    contentText: getString('pipelines-studio.pipelineUpdatedError'),
    titleText: getString('pipelines-studio.pipelineUpdated'),
    confirmButtonText: getString('update'),
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
    let latestPipeline: NgPipeline = pipeline
    if (isYaml && yamlHandler) {
      latestPipeline = parse(yamlHandler.getLatestYaml()).pipeline as NgPipeline
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
            toPipelineStudioYaml({
              projectIdentifier,
              orgIdentifier,
              pipelineIdentifier: newPipelineId,
              accountId,
              module
            })
          )
        } else {
          history.replace(
            toPipelineStudio({ projectIdentifier, orgIdentifier, pipelineIdentifier: newPipelineId, accountId, module })
          )
        }
        // note: without setTimeout does not redirect properly after save
        setTimeout(() => location.reload(), 250)
      } else {
        fetchPipeline(true, true)
      }
    } else {
      showError(response?.message || getString('errorWhileSaving'))
    }
  }, [
    deletePipelineCache,
    accountId,
    history,
    toPipelineStudioYaml,
    toPipelineStudio,
    projectIdentifier,
    orgIdentifier,
    pipeline,
    fetchPipeline,
    showError,
    pipelineIdentifier,
    isYaml,
    yamlHandler
  ])

  const { projects } = useAppStore()
  const project = projects.find(({ identifier }) => identifier === projectIdentifier)

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
    (data: NgPipeline) => {
      pipeline.name = data.name
      pipeline.description = data.description
      pipeline.identifier = data.identifier
      pipeline.tags = data.tags

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
            path: toPipelineStudioUI({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams }),
            exact: true
          })
          const matchYaml = matchPath(nextLocation.pathname, {
            path: toPipelineStudioYaml({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams }),
            exact: true
          })
          const matchDefault = matchPath(nextLocation.pathname, {
            path: toPipelineStudio({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams }),
            exact: true
          })
          return !(matchUI?.isExact || matchYaml?.isExact || matchDefault?.isExact)
        }}
        navigate={newPath => {
          deletePipelineCache()
          history.push(newPath)
        }}
      />
      <div>
        <div className={css.titleBar}>
          <div className={css.breadcrumbsMenu}>
            <Breadcrumbs
              links={[
                {
                  url: toPipelineProject({ orgIdentifier, projectIdentifier, accountId, module }),
                  label: project?.name as string
                },
                {
                  url: toPipelineList({ orgIdentifier, projectIdentifier, accountId, module }),
                  label: getString('pipelines')
                },
                ...(pipelineIdentifier !== DefaultNewPipelineId
                  ? [
                      {
                        url: toPipelineDetail({
                          projectIdentifier,
                          orgIdentifier,
                          pipelineIdentifier,
                          accountId,
                          module
                        }),
                        label: pipeline?.name
                      },
                      { url: '#', label: getString('studioText') }
                    ]
                  : [{ url: '#', label: getString('studioText') }])
              ]}
            />
            <div className={css.pipelineNameContainer}>
              <div>
                <Text className={css.pipelineName}>{pipeline?.name}</Text>
                <Button minimal icon="Edit" iconProps={{ size: 12 }} onClick={showModal} />
              </div>
            </div>
          </div>

          <div className={css.pipelineStudioTitleContainer}>
            <div className={css.pipelineStudioTitle}>
              <div className={css.rectangle}>
                <span>Pipeline Studio</span>
              </div>
            </div>
            <NavLink
              className={css.topButtons}
              activeClassName={css.selected}
              to={toPipelineStudioUI({ orgIdentifier, projectIdentifier, pipelineIdentifier, accountId, module })}
            >
              {getString('visual')}
            </NavLink>
            <NavLink
              className={css.topButtons}
              activeClassName={css.selected}
              to={toPipelineStudioYaml({ orgIdentifier, projectIdentifier, pipelineIdentifier, accountId, module })}
            >
              {getString('yaml')}
            </NavLink>
          </div>
          <div>
            <div className={css.savePublishContainer}>
              <div>
                {isUpdated && (
                  <Tag intent="primary" className={css.tagRender} minimal>
                    {getString('unsavedChanges')}
                  </Tag>
                )}
              </div>
              <div>
                <Button
                  minimal
                  intent="primary"
                  text={getString('saveAndPublish')}
                  onClick={saveAndPublish}
                  icon="arrow-up"
                  className={css.savePublishBtn}
                />
              </div>
            </div>
            <div className={css.notificationContainer}>
              {!isYaml && (
                <div>
                  <Button
                    minimal={!(splitViewType === SplitViewTypes.Notifications)}
                    text={getString('notifications')}
                    tooltip={getString('notifications')}
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
          </div>
        </div>
      </div>
      {children}
      <RightDrawer />
      {/* todo: Requires more testing before merge */}
      {/* {isDrawerOpened && drawerData.data && stageType && addDrawerMap ? (
        <>
        <AddDrawer
          addDrawerMap={addDrawerMap}
          drawerContext={DrawerContext.STUDIO}
          onSelect={onStepSelect}
          onClose={() =>
            updatePipelineView({
              ...pipelineView,
              isDrawerOpened: false,
              drawerData: { type: DrawerTypes.AddStep }
            })
          }
        />
        // not tested RightBar yet but won't exist in AddDrawer
          <RightBar/>
        </>
      ) : null} */}
    </div>
  )
}
