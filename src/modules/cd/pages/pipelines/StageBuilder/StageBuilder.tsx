import React from 'react'
import { Diagram } from 'modules/common/exports'
import css from './StageBuilder.module.scss'
import { StageBuilderModel, StageType, getStageFromPipeline } from './StageBuilderModel'
import { DynamicPopover, DynamicPopoverHandlerBinding } from 'modules/common/components/DynamicPopover/DynamicPopover'
import { Icon } from '@wings-software/uikit'
import 'split-view'
import type { NodeModelListener, LinkModelListener } from '@projectstorm/react-diagrams-core'
import StageSetupShell from '../../../common/StageSetupShell/StageSetupShell'
import type { StageElementWrapper } from 'services/cd-ng'
import { PipelineContext } from '../PipelineContext/PipelineContext'
import { CanvasButtons } from 'modules/cd/common/CanvasButtons/CanvasButtons'
import { AddStageView } from './views/AddStageView'
import { EditStageView } from './views/EditStageView'
import { DefaultLinkModel, DefaultNodeModel } from 'modules/common/components/Diagram'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'split-view': any
      'split-divider': any
    }
  }
}

interface PopoverData {
  data?: StageElementWrapper
  isStageView: boolean
  isParallel?: boolean
  event?: Diagram.DefaultNodeEvent
  addStage?: (type: StageType, isParallel?: boolean, event?: Diagram.DefaultNodeEvent) => void
  onSubmitPrimaryData?: (values: StageElementWrapper, identifier: string) => void
}

const renderPopover = ({
  data,
  addStage,
  isParallel,
  event,
  isStageView,
  onSubmitPrimaryData
}: PopoverData): JSX.Element => {
  if (isStageView) {
    return <EditStageView data={data} onSubmit={onSubmitPrimaryData} />
  }
  return <AddStageView callback={type => addStage?.(type, isParallel, event)} />
}

export const StageBuilder: React.FC<{}> = (): JSX.Element => {
  const {
    state: {
      pipeline,
      pipelineView: { isSetupStageOpen, selectedStageId }
    },
    updatePipeline,
    updatePipelineView
  } = React.useContext(PipelineContext)

  const [dynamicPopoverHandler, setDynamicPopoverHandler] = React.useState<
    DynamicPopoverHandlerBinding<PopoverData> | undefined
  >()

  const addStage = (type: StageType, isParallel = false, event?: Diagram.DefaultNodeEvent): void => {
    if (!pipeline.stages) {
      pipeline.stages = []
    }
    if (event?.entity && event.entity instanceof DefaultLinkModel) {
      const node = event.entity.getSourcePort().getNode()
      const { stage } = getStageFromPipeline(pipeline, node.getID())
      if (stage) {
        const index = pipeline.stages.indexOf(stage)
        if (index > -1) {
          pipeline.stages.splice(index + 1, 0, {
            stage: {
              name: 'Untitled',
              identifier: `Untitled-${Math.ceil(Math.random() * 1000)}`,
              type: type,
              spec: {}
            }
          })
        }
      }
    } else if (isParallel && event?.entity && event.entity instanceof DefaultNodeModel) {
      const { stage, parent } = getStageFromPipeline(pipeline, event.entity.getID())
      if (stage) {
        if (parent && parent.parallel && parent.parallel.length > 0) {
          parent.parallel.push({
            stage: {
              name: 'Untitled',
              identifier: `${parent.parallel[0]?.stage?.identifier || 'Untitled_'}-${Math.ceil(Math.random() * 1000)}`,
              type: type,
              spec: {}
            }
          })
        } else {
          const index = pipeline.stages.indexOf(stage)
          if (index > -1) {
            pipeline.stages.splice(index, 1, {
              parallel: [
                stage,
                {
                  stage: {
                    name: 'Untitled',
                    identifier: `Untitled-${Math.ceil(Math.random() * 1000)}`,
                    type: type,
                    spec: {}
                  }
                }
              ]
            })
          }
        }
      }
    } else {
      pipeline.stages.push({
        stage: {
          name: 'Untitled',
          identifier: `Untitled-${Math.ceil(Math.random() * 1000)}`,
          type: type,
          spec: {}
        }
      })
    }
    dynamicPopoverHandler?.hide()
    model.addUpdateGraph(pipeline, { nodeListeners, linkListeners }, selectedStageId)
    engine.repaintCanvas()
    updatePipeline(pipeline)
  }

  const nodeListeners: NodeModelListener = {
    // Can not remove this Any because of React Diagram Issue
    [Diagram.Event.ClickNode]: (event: any) => {
      const eventTemp = event as Diagram.DefaultNodeEvent
      const nodeRender = document.querySelector(`[data-nodeid="${eventTemp.entity.getID()}"]`)
      if (nodeRender && eventTemp.entity) {
        if (eventTemp.entity.getType() === Diagram.DiagramType.CreateNew) {
          dynamicPopoverHandler?.show(
            nodeRender,
            {
              addStage,
              isStageView: false
            },
            { useArrows: true, darkMode: true }
          )
        } else if (eventTemp.entity.getType() !== Diagram.DiagramType.StartNode) {
          if (!isSetupStageOpen) {
            dynamicPopoverHandler?.show(
              nodeRender,
              {
                isStageView: true,
                data: getStageFromPipeline(pipeline, eventTemp.entity.getID()).stage,
                onSubmitPrimaryData: (_values, identifier) => {
                  updatePipeline(pipeline)
                  dynamicPopoverHandler.hide()
                  updatePipelineView({ isSetupStageOpen: true, selectedStageId: identifier })
                }
              },
              { useArrows: false, darkMode: false }
            )
          }
        }
      }
    },
    // Can not remove this Any because of React Diagram Issue
    [Diagram.Event.RemoveNode]: (event: any) => {
      const eventTemp = event as Diagram.DefaultNodeEvent
      const { stage: node, parent } = getStageFromPipeline(pipeline, eventTemp.entity.getID())
      if (node) {
        const index = pipeline?.stages?.indexOf(node)
        if (index && index > -1) {
          pipeline?.stages?.splice(index, 1)
          updatePipeline(pipeline)
        } else if (parent?.parallel) {
          const parallelIndex = parent.parallel?.indexOf(node)
          if (parallelIndex > -1) {
            parent.parallel.splice(parallelIndex, 1)
            if (parent.parallel.length === 0) {
              const emptyParallel = pipeline?.stages?.indexOf(parent)
              if (emptyParallel && emptyParallel > -1) {
                pipeline?.stages?.splice(emptyParallel, 1)
              }
            }
            updatePipeline(pipeline)
          }
        }
      }
    },
    [Diagram.Event.AddParallelNode]: (event: any) => {
      const eventTemp = event as Diagram.DefaultNodeEvent
      eventTemp.stopPropagation()
      const addRender = document.querySelector(`[data-nodeid="${eventTemp.entity.getID()}"] div[class*="addNode"]`)
      if (addRender) {
        dynamicPopoverHandler?.show(
          addRender,
          {
            addStage,
            isParallel: true,
            isStageView: false,
            event: eventTemp
          },
          { useArrows: true, darkMode: true }
        )
      }
    }
  }

  const linkListeners: LinkModelListener = {
    [Diagram.Event.AddLinkClicked]: (event: any) => {
      const eventTemp = event as Diagram.DefaultNodeEvent
      const linkRender = document.querySelector(`[data-linkid="${eventTemp.entity.getID()}"] circle`)
      if (linkRender) {
        dynamicPopoverHandler?.show(
          linkRender,
          {
            addStage,
            isStageView: false,
            event: eventTemp
          },
          { useArrows: true, darkMode: true }
        )
      }
    }
  }
  //1) setup the diagram engine
  const engine = React.useMemo(() => Diagram.createEngine(), [])

  //2) setup the diagram model
  const model = React.useMemo(() => new StageBuilderModel(), [])

  model.addUpdateGraph(pipeline, { nodeListeners, linkListeners }, selectedStageId)

  // load model into engine
  engine.setModel(model)

  return (
    <split-view horizontal fill>
      <div
        className={css.canvas}
        onClick={e => {
          const div = e.target as HTMLDivElement
          if (div.className?.indexOf?.('CanvasWidget-module_canvas') > -1) {
            dynamicPopoverHandler?.hide()
          }
          if (isSetupStageOpen) {
            updatePipelineView({ isSetupStageOpen: false, selectedStageId: undefined })
          }
        }}
      >
        <Diagram.CanvasWidget engine={engine} />
        <DynamicPopover darkMode={true} render={renderPopover} bind={setDynamicPopoverHandler} />

        <CanvasButtons engine={engine} callback={() => dynamicPopoverHandler?.hide()} />
      </div>

      {isSetupStageOpen && (
        <split-divider wide>
          <Icon
            name="cross"
            size={20}
            className={css.stageCloseIcon}
            onClick={() => updatePipelineView({ isSetupStageOpen: false, selectedStageId: undefined })}
          />
        </split-divider>
      )}
      {isSetupStageOpen && <StageSetupShell />}
    </split-view>
  )
}
