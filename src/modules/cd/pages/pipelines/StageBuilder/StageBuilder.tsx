import React from 'react'
import { Diagram } from 'modules/common/exports'
import css from './StageBuilder.module.scss'
import {
  StageBuilderModel,
  StageType,
  getStageFromPipeline,
  MapStepTypeToIcon,
  getTypeOfStage
} from './StageBuilderModel'
import { DynamicPopover, DynamicPopoverHandlerBinding } from 'modules/common/components/DynamicPopover/DynamicPopover'
import {
  Button,
  Text,
  Container,
  Formik,
  FormikForm,
  FormInput,
  Collapse,
  Label,
  Card,
  CardSelect,
  CardBody,
  CardSelectType
} from '@wings-software/uikit'
import 'split-view'
import i18n from './StageBuilder.i18n'
import type { NodeModelListener } from '@projectstorm/react-diagrams-core'

import type { IconName } from '@blueprintjs/core'
import StageSetupShell from '../../../common/StageSetupShell/StageSetupShell'
import * as Yup from 'yup'
import type { StageWrapper } from 'services/ng-temp'
import { PipelineContext } from '../PipelineContext/PipelineContext'
import { CanvasButtons } from 'modules/cd/common/CanvasButtons/CanvasButtons'
import { AddStageView } from './views/AddStageView'

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
  data?: StageWrapper
  isStageView: boolean
  addStage?: (type: StageType) => void
  onSubmitPrimaryData?: (values: StageWrapper, identifier: string) => void
}

const collapseProps = {
  collapsedIcon: 'small-plus' as IconName,
  expandedIcon: 'small-minus' as IconName,
  isOpen: false,
  isRemovable: false,
  className: 'collapse',
  heading: i18n.description
}

const newStageData = [
  {
    text: i18n.service,
    value: 'service',
    icon: 'service'
  },
  {
    text: i18n.multipleService,
    value: 'multiple-service',
    icon: 'multi-service'
  },
  {
    text: i18n.functions,
    value: 'functions',
    icon: 'functions'
  },
  {
    text: i18n.otherWorkloads,
    value: 'other-workloads',
    icon: 'other-workload'
  }
]

const renderPopover = ({ data, addStage, isStageView, onSubmitPrimaryData }: PopoverData): JSX.Element => {
  if (isStageView) {
    const type = data ? getTypeOfStage(data.stage).type : StageType.DEPLOY
    return (
      <div className={css.stageCreate}>
        <Text icon={MapStepTypeToIcon[type]} iconProps={{ size: 16 }}>
          {i18n.aboutYourStage}
        </Text>
        <Container padding="medium">
          <Formik
            initialValues={{
              identifier: data?.stage.identifier,
              displayName: data?.stage.displayName,
              description: data?.stage.description,
              serviceType: newStageData[0]
            }}
            onSubmit={values => {
              if (data) {
                data.stage.identifier = values.identifier
                data.stage.displayName = values.displayName
                onSubmitPrimaryData?.(data, values.identifier)
              }
            }}
            validationSchema={Yup.object().shape({
              displayName: Yup.string().required(i18n.stageNameRequired)
            })}
          >
            {formikProps => {
              return (
                <FormikForm>
                  <FormInput.InputWithIdentifier inputName="displayName" inputLabel={i18n.stageName} />
                  <div className={css.collapseDiv}>
                    <Collapse {...collapseProps}>
                      <FormInput.TextArea name="description" />
                    </Collapse>
                  </div>
                  <div className={css.labelBold}>
                    <Label>{i18n.whatToDeploy}</Label>
                  </div>
                  <div>
                    <CardSelect
                      type={CardSelectType.Any} // TODO: Remove this by publishing uikit with exported CardSelectType
                      selected={formikProps.values.serviceType}
                      onChange={item => formikProps.setFieldValue('serviceType', item)}
                      renderItem={(item, selected) => (
                        <>
                          <Card selected={selected}>
                            <CardBody.Icon icon={item.icon as IconName} iconSize={25} />
                          </Card>
                          <Text
                            font={{
                              size: 'small',
                              align: 'center'
                            }}
                            style={{
                              color: selected ? 'var(--grey-900)' : 'var(--grey-350)'
                            }}
                          >
                            {item.text}
                          </Text>
                        </>
                      )}
                      data={newStageData}
                      className={css.grid}
                    />
                  </div>
                  <div className={css.btnSetup}>
                    <Button
                      type="submit"
                      intent="primary"
                      text={i18n.setupStage}
                      onClick={() => {
                        formikProps.submitForm()
                      }}
                    />
                  </div>
                </FormikForm>
              )
            }}
          </Formik>
        </Container>
      </div>
    )
  }
  return <AddStageView callback={type => addStage?.(type)} />
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

  const addStage = (type: StageType): void => {
    if (!pipeline.stages) {
      pipeline.stages = []
    }
    pipeline.stages.push({
      stage: {
        displayName: 'Untitled',
        identifier: `Untitled-${pipeline.stages?.length}`,
        [type]: {
          runParallel: false,
          skipCondition: null,
          description: null,
          service: {},
          infrastructure: {},
          execution: []
        }
      }
    })
    dynamicPopoverHandler?.hide()
    model.addUpdateGraph(pipeline, listener)
    engine.repaintCanvas()
    updatePipeline(pipeline)
  }

  const listener: NodeModelListener = {
    // Can not remove this Any because of React Diagram Issue
    [Diagram.Event.SelectionChanged]: (event: any) => {
      const eventTemp = event as Diagram.DefaultNodeEvent
      const nodeRender = document.querySelector(`[data-nodeid="${eventTemp.entity.getID()}"]`)
      if (nodeRender && eventTemp.isSelected) {
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
                data: getStageFromPipeline(pipeline, eventTemp.entity.getID()),
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
      const node = getStageFromPipeline(pipeline, eventTemp.entity.getID())
      if (node) {
        const index = pipeline?.stages?.indexOf(node)
        if (index && index > -1) {
          pipeline?.stages?.splice(index, 1)
          updatePipeline(pipeline)
        }
      }
    }
  }

  //1) setup the diagram engine
  const engine = React.useMemo(() => Diagram.createEngine(), [])

  //2) setup the diagram model
  const model = React.useMemo(() => new StageBuilderModel(), [])

  model.addUpdateGraph(pipeline, listener, selectedStageId)

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
        }}
      >
        <Diagram.CanvasWidget engine={engine} />
        <DynamicPopover darkMode={true} render={renderPopover} bind={setDynamicPopoverHandler} />

        <CanvasButtons engine={engine} callback={() => dynamicPopoverHandler?.hide()} />
      </div>

      {isSetupStageOpen && <split-divider wide></split-divider>}
      {isSetupStageOpen && <StageSetupShell />}
    </split-view>
  )
}
