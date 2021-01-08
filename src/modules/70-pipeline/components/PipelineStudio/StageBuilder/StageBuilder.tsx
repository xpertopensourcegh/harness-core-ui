import React from 'react'
import { Layout, Button } from '@wings-software/uicore'
import cx from 'classnames'
import { debounce } from 'lodash-es'
import type { NodeModelListener, LinkModelListener } from '@projectstorm/react-diagrams-core'
import SplitPane from 'react-split-pane'
import { DynamicPopover, DynamicPopoverHandlerBinding } from '@common/components/DynamicPopover/DynamicPopover'
import { CanvasButtons } from '@pipeline/exports'
import type { StageElementWrapper, NgPipeline } from 'services/cd-ng'
import { useConfirmationDialog } from '@common/exports'
import { useStrings } from 'framework/exports'
import {
  CanvasWidget,
  createEngine,
  DefaultLinkEvent,
  DefaultLinkModel,
  DefaultNodeEvent,
  DefaultNodeModel,
  DiagramType,
  Event
} from '../../Diagram'
import { StageBuilderModel } from './StageBuilderModel'
import { PipelineContext } from '../PipelineContext/PipelineContext'
import { EmptyStageName, MinimumSplitPaneSize, DefaultSplitPaneSize } from '../PipelineConstants'
import {
  getNewStageFromType,
  PopoverData,
  getStageFromPipeline,
  EmptyNodeSeparator,
  StageState,
  resetDiagram,
  removeNodeFromPipeline,
  getDependantStages
} from './StageBuilderUtil'
import { StageList } from './views/StageList'
import { SplitViewTypes } from '../PipelineContext/PipelineActions'
import { PipelineNotifications } from '../PipelineNotifications/PipelineNotifications'
import { PipelineTriggers } from '../PipelineTriggers/PipelineTriggers'
import css from './StageBuilder.module.scss'

export type StageStateMap = Map<string, StageState>
interface TempStageData {
  stages?: string[]
  selectedStageId?: string | undefined
}
const initializeStageStateMap = (pipeline: NgPipeline, mapState: StageStateMap): void => {
  /* istanbul ignore else */ if (pipeline.stages) {
    pipeline.stages.forEach((node: StageElementWrapper) => {
      if (node.stage && node.stage.name !== EmptyStageName) {
        mapState.set(node.stage.identifier, { isConfigured: true, stage: node })
      } /* istanbul ignore else */ else if (node.parallel) {
        node.parallel.forEach((parallelNode: StageElementWrapper) => {
          /* istanbul ignore else */ if (parallelNode.stage && parallelNode.stage.name !== EmptyStageName) {
            mapState.set(parallelNode.stage.identifier, { isConfigured: true, stage: parallelNode })
          }
        })
      }
    })
  }
}

export const renderPopover = ({
  data,
  addStage,
  isParallel,
  isGroupStage,
  groupStages,
  groupSelectedStageId,
  onClickGroupStage,
  stagesMap,
  event,
  isStageView,
  onSubmitPrimaryData,
  renderPipelineStage
}: PopoverData): JSX.Element => {
  if (isStageView && data) {
    const stageData = {
      stage: {
        ...data.stage,
        identifier: data?.stage.name === EmptyStageName ? '' : /* istanbul ignore next */ data.stage.identifier,
        name: data?.stage.name === EmptyStageName ? '' : /* istanbul ignore next */ data.stage.name
      }
    }
    return renderPipelineStage({
      minimal: true,
      stageType: data.stage.type,
      stageProps: {
        data: stageData,
        onSubmit: (values: StageElementWrapper, identifier: string) => {
          data.stage = {
            ...values.stage
          }
          onSubmitPrimaryData?.(values, identifier)
        }
      }
    })
  } else if (isGroupStage) {
    return (
      <StageList
        stagesMap={stagesMap}
        stages={groupStages || []}
        selectedStageId={groupSelectedStageId}
        onClick={onClickGroupStage}
      />
    )
  }
  return renderPipelineStage({
    isParallel,
    showSelectMenu: true,
    onSelectStage: type => addStage?.(getNewStageFromType(type as any), isParallel, event)
  })
}

const StageBuilder: React.FC<{}> = (): JSX.Element => {
  const {
    state: {
      pipeline,
      pipelineView: {
        isSplitViewOpen,
        splitViewData: { selectedStageId, type = SplitViewTypes.StageView, stageType }
      },
      pipelineView,
      isInitialized
    },
    stagesMap,
    updatePipeline,
    updatePipelineView,
    renderPipelineStage
  } = React.useContext(PipelineContext)
  const { getString } = useStrings()
  const [dynamicPopoverHandler, setDynamicPopoverHandler] = React.useState<
    DynamicPopoverHandlerBinding<PopoverData> | undefined
  >()

  const canvasRef = React.useRef<HTMLDivElement | null>(null)

  const [stageMap, setStageMap] = React.useState(new Map<string, StageState>())
  const [tempDependencyData, setdependantStages] = React.useState<TempStageData>({})
  const addStage = (
    newStage: StageElementWrapper,
    isParallel = false,
    event?: DefaultNodeEvent,
    insertAt?: number
  ): void => {
    if (!pipeline.stages) {
      pipeline.stages = []
    }
    if (event?.entity && event.entity instanceof DefaultLinkModel) {
      let node = event.entity.getSourcePort().getNode() as DefaultNodeModel
      let { stage } = getStageFromPipeline(pipeline, node.getIdentifier())
      let next = 1
      if (!stage) {
        node = event.entity.getTargetPort().getNode() as DefaultNodeModel
        stage = getStageFromPipeline(pipeline, node.getIdentifier()).stage
        next = 0
      }
      if (stage) {
        const index = pipeline.stages.indexOf(stage)
        if (index > -1) {
          pipeline.stages.splice(index + next, 0, newStage)
        }
      } else {
        // parallel next parallel case
        let nodeParallel = event.entity.getSourcePort().getNode() as DefaultNodeModel
        let nodeId = nodeParallel.getIdentifier().split(EmptyNodeSeparator)[1]
        stage = getStageFromPipeline(pipeline, nodeId).parent
        next = 1
        if (!stage) {
          nodeParallel = event.entity.getTargetPort().getNode() as DefaultNodeModel
          nodeId = nodeParallel.getIdentifier().split(EmptyNodeSeparator)[2]
          stage = getStageFromPipeline(pipeline, nodeId).parent
          next = 0
        }
        if (stage) {
          const index = pipeline.stages.indexOf(stage)
          if (index > -1) {
            pipeline.stages.splice(index + next, 0, newStage)
          }
        }
      }
    } else if (isParallel && event?.entity && event.entity instanceof DefaultNodeModel) {
      const { stage, parent } = getStageFromPipeline(pipeline, event.entity.getIdentifier())
      if (stage) {
        if (parent && parent.parallel && parent.parallel.length > 0) {
          parent.parallel.push(newStage)
        } else {
          const index = pipeline.stages.indexOf(stage)
          if (index > -1) {
            pipeline.stages.splice(index, 1, {
              parallel: [stage, newStage]
            })
          }
        }
      }
    } else {
      if (insertAt && insertAt > -1) {
        pipeline.stages.splice(insertAt, 0, newStage)
      } else {
        pipeline.stages.push(newStage)
      }
    }
    dynamicPopoverHandler?.hide()
    model.addUpdateGraph(pipeline, { nodeListeners, linkListeners }, stagesMap, selectedStageId)
    engine.repaintCanvas()
    updatePipeline(pipeline)
  }

  React.useEffect(() => {
    if (isInitialized && !isSplitViewOpen) {
      const map = new Map<string, StageState>()
      initializeStageStateMap(pipeline, map)
      setStageMap(map)
    }
  }, [isInitialized, pipeline, isSplitViewOpen])
  const { openDialog } = useConfirmationDialog({
    cancelButtonText: getString('cancel'),
    contentText: (
      <>
        {getString('pipelineSteps.build.delete.deleteStageText')}
        {
          <ul className={css.stageList}>
            {tempDependencyData?.stages?.map((stageName: string) => (
              <li key={stageName}>{stageName}</li>
            ))}
          </ul>
        }
      </>
    ),
    titleText: getString('pipelineSteps.build.delete.confirmDeleteTitle'),
    confirmButtonText: getString('confirm'),
    onCloseDialog: isConfirmed => {
      if (isConfirmed) {
        const isRemove = removeNodeFromPipeline(pipeline, stageMap, tempDependencyData?.selectedStageId as string)
        if (isRemove) {
          updatePipeline(pipeline)
          return
        }
        setdependantStages({})
      }
    }
  })
  const nodeListeners: NodeModelListener = {
    // Can not remove this Any because of React Diagram Issue
    [Event.ClickNode]: (event: any) => {
      const eventTemp = event as DefaultNodeEvent
      const nodeRender = document.querySelector(`[data-nodeid="${eventTemp.entity.getID()}"]`)
      /* istanbul ignore else */ if (nodeRender && eventTemp.entity) {
        if (eventTemp.entity.getType() === DiagramType.CreateNew) {
          dynamicPopoverHandler?.show(
            nodeRender,
            {
              addStage,
              isStageView: false,
              renderPipelineStage,
              stagesMap
            },
            { useArrows: true, darkMode: true }
          )
        } else if (eventTemp.entity.getType() === DiagramType.GroupNode && selectedStageId) {
          const parent = getStageFromPipeline(pipeline, eventTemp.entity.getIdentifier()).parent
          /* istanbul ignore else */ if (parent?.parallel) {
            dynamicPopoverHandler?.show(
              nodeRender,
              {
                isGroupStage: true,
                groupSelectedStageId: selectedStageId,
                isStageView: false,
                groupStages: parent.parallel,
                onClickGroupStage: (stageId: string, typeOfStage: string) => {
                  dynamicPopoverHandler?.hide()
                  resetDiagram(engine)
                  updatePipelineView({
                    ...pipelineView,
                    isSplitViewOpen: true,
                    splitViewData: { selectedStageId: stageId, type: SplitViewTypes.StageView, stageType: typeOfStage }
                  })
                },
                stagesMap,
                renderPipelineStage
              },
              { useArrows: true, darkMode: true }
            )
          }
        } /* istanbul ignore else */ else if (eventTemp.entity.getType() !== DiagramType.StartNode) {
          const data = getStageFromPipeline(pipeline, eventTemp.entity.getIdentifier()).stage
          if (isSplitViewOpen && data?.stage?.identifier) {
            resetDiagram(engine)
            updatePipelineView({
              ...pipelineView,
              isSplitViewOpen: true,
              splitViewData: {
                selectedStageId: data?.stage?.identifier,
                type: SplitViewTypes.StageView,
                stageType: data?.stage?.type || 'Deployment'
              }
            })
          } /* istanbul ignore else */ else if (!isSplitViewOpen) {
            if (stageMap.has(data?.stage?.identifier)) {
              resetDiagram(engine)
              updatePipelineView({
                ...pipelineView,
                isSplitViewOpen: true,
                splitViewData: {
                  selectedStageId: data?.stage?.identifier,
                  type: SplitViewTypes.StageView,
                  stageType: data?.stage?.type || 'Deployment'
                }
              })
            } else {
              dynamicPopoverHandler?.show(
                nodeRender,
                {
                  isStageView: true,
                  data,
                  onSubmitPrimaryData: (node, identifier) => {
                    updatePipeline(pipeline)
                    stageMap.set(node.stage.identifier, { isConfigured: true, stage: node })
                    dynamicPopoverHandler.hide()
                    resetDiagram(engine)
                    updatePipelineView({
                      ...pipelineView,
                      isSplitViewOpen: true,
                      splitViewData: {
                        selectedStageId: identifier,
                        type: SplitViewTypes.StageView,
                        stageType: node.stage.type
                      }
                    })
                  },
                  stagesMap,
                  renderPipelineStage
                },
                { useArrows: false, darkMode: false }
              )
            }
          }
        }
      }
    },
    // Can not remove this Any because of React Diagram Issue
    [Event.RemoveNode]: (event: any) => {
      const eventTemp = event as DefaultNodeEvent
      const stageIdToBeRemoved = eventTemp.entity.getIdentifier()
      const dependantStages = getDependantStages(pipeline, stageIdToBeRemoved)
      if (dependantStages.length) {
        setdependantStages({
          ...tempDependencyData,
          stages: dependantStages as [],
          selectedStageId: stageIdToBeRemoved
        })
        openDialog()

        return
      }
      const isRemove = removeNodeFromPipeline(pipeline, stageMap, stageIdToBeRemoved)
      if (isRemove) {
        updatePipeline(pipeline)
      }
    },
    [Event.AddParallelNode]: (event: any) => {
      const eventTemp = event as DefaultNodeEvent
      eventTemp.stopPropagation()
      if (eventTemp.target) {
        dynamicPopoverHandler?.show(
          eventTemp.target,
          {
            addStage,
            isParallel: true,
            isStageView: false,
            event: eventTemp,
            stagesMap,
            renderPipelineStage
          },
          { useArrows: true, darkMode: true },
          eventTemp.callback
        )
      }
    },
    [Event.DropLinkEvent]: (event: any) => {
      const eventTemp = event as DefaultNodeEvent
      eventTemp.stopPropagation()
      if (event.node?.identifier) {
        const dropNode = getStageFromPipeline(pipeline, event.node.identifier).stage
        const current = getStageFromPipeline(pipeline, eventTemp.entity.getIdentifier())
        // Check Drop Node and Current node should not be same
        if (event.node.identifier !== eventTemp.entity.getIdentifier()) {
          const isRemove = removeNodeFromPipeline(pipeline, stageMap, event.node.identifier, false)
          if (isRemove && dropNode) {
            if (!current.parent && current.stage) {
              const index = pipeline.stages?.indexOf(current.stage) || -1
              if (index > -1) {
                // Remove current Stage also and make it parallel
                pipeline?.stages?.splice(index, 1)
                // Now make a parallel stage and update at the same place
                addStage(
                  {
                    parallel: [current.stage, dropNode]
                  },
                  false,
                  event,
                  index
                )
              }
            } else {
              addStage(dropNode, current?.parent?.parallel?.length > 0, event)
            }
          }
        }
      }
    }
  }

  const linkListeners: LinkModelListener = {
    [Event.AddLinkClicked]: (event: any) => {
      const eventTemp = event as DefaultNodeEvent
      const linkRender = document.querySelector(`[data-linkid="${eventTemp.entity.getID()}"] circle`)
      if (linkRender) {
        dynamicPopoverHandler?.show(
          linkRender,
          {
            addStage,
            isStageView: false,
            event: eventTemp,
            stagesMap,
            renderPipelineStage
          },
          { useArrows: true, darkMode: true }
        )
      }
    },
    [Event.DropLinkEvent]: (event: any) => {
      const eventTemp = event as DefaultLinkEvent
      eventTemp.stopPropagation()
      if (event.node?.identifier) {
        const dropNode = getStageFromPipeline(pipeline, event.node.identifier).stage
        const isRemove = removeNodeFromPipeline(pipeline, stageMap, event.node.identifier, false)
        if (isRemove && dropNode) {
          addStage(dropNode, false, event)
        }
      }
    }
  }
  //1) setup the diagram engine
  const engine = React.useMemo(() => createEngine({}), [])

  //2) setup the diagram model
  const model = React.useMemo(() => new StageBuilderModel(), [])
  const [splitPaneSize, setSplitPaneSize] = React.useState(DefaultSplitPaneSize)

  model.addUpdateGraph(pipeline, { nodeListeners, linkListeners }, stagesMap, selectedStageId, splitPaneSize)
  const setSplitPaneSizeDeb = debounce(setSplitPaneSize, 200)
  // load model into engine
  engine.setModel(model)

  const StageCanvas = (
    <div
      className={css.canvas}
      ref={canvasRef}
      onClick={e => {
        const div = e.target as HTMLDivElement
        if (div === canvasRef.current?.children[0]) {
          dynamicPopoverHandler?.hide()
        }
        if (isSplitViewOpen) {
          updatePipelineView({ ...pipelineView, isSplitViewOpen: false, splitViewData: {} })
        }
      }}
    >
      <CanvasWidget engine={engine} />
      <DynamicPopover
        darkMode={true}
        className={css.renderPopover}
        render={renderPopover}
        bind={setDynamicPopoverHandler}
      />

      <CanvasButtons engine={engine} callback={() => dynamicPopoverHandler?.hide()} />
    </div>
  )

  return (
    <Layout.Horizontal className={cx(css.canvasContainer, { [css.canvasStageView]: isSplitViewOpen })} padding="medium">
      <div className={css.canvas}>
        {isSplitViewOpen ? (
          <SplitPane
            size={splitPaneSize}
            split="horizontal"
            minSize={MinimumSplitPaneSize}
            onChange={size => setSplitPaneSizeDeb(size)}
          >
            {StageCanvas}
            <div
              style={{
                width: '100%',
                /*TODO: temporaty solution*/
                height: stageType === 'CI' ? '100%' : `calc(100% - 62px)`,
                overflow: 'auto',
                background: 'white'
              }}
            >
              <div className={css.splitButtons}>
                <div className={css.resizers}>
                  <Button
                    icon="up"
                    minimal
                    small
                    iconProps={{ size: 12 }}
                    onClick={() => {
                      setSplitPaneSize(MinimumSplitPaneSize)
                    }}
                    id="stageIncrease"
                  />
                  <Button
                    icon="down"
                    minimal
                    small
                    id="stageDecrease"
                    iconProps={{ size: 12 }}
                    onClick={() => {
                      setSplitPaneSize(prev => prev + 100)
                    }}
                  />
                </div>
              </div>
              {type === SplitViewTypes.StageView && renderPipelineStage({ stageType, minimal: false })}
              {type === SplitViewTypes.Notifications && <PipelineNotifications />}
              {type === SplitViewTypes.Triggers && <PipelineTriggers />}
            </div>
          </SplitPane>
        ) : (
          StageCanvas
        )}
      </div>
    </Layout.Horizontal>
  )
}

export default StageBuilder
