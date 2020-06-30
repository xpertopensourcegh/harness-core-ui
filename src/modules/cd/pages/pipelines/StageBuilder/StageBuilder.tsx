import React from 'react'
import { Diagram } from 'modules/common/exports'
import css from './StageBuilder.module.scss'
import { StageBuilderModel, GraphObj, StageType } from './StageBuilderModel'
import { DynamicPopover, DynamicPopoverHandlerBinding } from 'modules/common/components/DynamicPopover/DynamicPopover'
import {
  Layout,
  ButtonGroup,
  Button,
  Card,
  Icon,
  Text,
  Container,
  Formik,
  FormikForm,
  FormInput,
  Collapse,
  Label,
  RadioSelect,
  CardBody
} from '@wings-software/uikit'
import i18n from './StageBuilder.i18n'
import type { NodeModelListener } from '@projectstorm/react-diagrams-core'
import { loggerFor, ModuleName } from 'framework/exports'
import type { IconName } from '@blueprintjs/core'

const logger = loggerFor(ModuleName.CD)

interface PopoverData {
  data?: GraphObj
  isStageView: boolean
  addStage?: (type: StageType) => void
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
    icon: 'main-service-ami'
  },
  {
    text: i18n.multipleService,
    value: 'multiple-service',
    icon: 'main-services'
  },
  {
    text: i18n.functions,
    value: 'functions',
    icon: 'function'
  },
  {
    text: i18n.otherWorkloads,
    value: 'other-workloads',
    icon: 'main-workflows'
  }
]

const renderPopover = ({ addStage, isStageView }: PopoverData): JSX.Element => {
  if (isStageView) {
    return (
      <div className={css.stageCreate}>
        <Text icon="deployment-success-legacy" iconProps={{ size: 16 }}>
          Stage View
        </Text>
        <Container padding="medium">
          <Formik
            initialValues={{ identifier: '', name: '', serviceType: undefined }}
            onSubmit={values => {
              logger.info(JSON.stringify(values))
            }}
          >
            {formikProps => {
              return (
                <FormikForm>
                  <FormInput.InputWithIdentifier />
                  <div className={css.collapseDiv}>
                    <Collapse {...collapseProps}>
                      <FormInput.TextArea name="description" />
                    </Collapse>
                  </div>
                  <div className={css.labelBold}>
                    <Label>{i18n.whatToDeploy}</Label>
                  </div>
                  <div>
                    <RadioSelect
                      selected={formikProps.values.serviceType}
                      onChange={item => formikProps.setFieldValue('serviceType', item)}
                      renderItem={(item, selected) => (
                        <CardBody.Icon icon={item.icon as IconName} iconSize={25}>
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
                        </CardBody.Icon>
                      )}
                      data={newStageData}
                      className={css.grid}
                    />
                  </div>
                  <div className={css.btnSetup}>
                    <Button intent="primary" text={i18n.setupStage} />
                  </div>
                </FormikForm>
              )
            }}
          </Formik>
        </Container>
      </div>
    )
  }
  return (
    <div className={css.createNewContent}>
      <div className={css.createNewCards}>
        <Card interactive={true} className={css.cardNew} onClick={() => addStage?.(StageType.DEPLOY)}>
          <Icon name="command-install" size={20} />
          <div>{i18n.deploy}</div>
        </Card>
        <Card interactive={true} className={css.cardNew} onClick={() => addStage?.(StageType.PIPELINE)}>
          <Icon name="support-pipeline" size={20} />
          <div>{i18n.pipeline}</div>
        </Card>
        <Card interactive={true} className={css.cardNew} onClick={() => addStage?.(StageType.APPROVAL)}>
          <Icon name="small-tick" size={20} />
          <div>{i18n.approval}</div>
        </Card>
        <Card interactive={true} className={css.cardNew} onClick={() => addStage?.(StageType.CUSTOM)}>
          <Icon name="series-configuration" size={20} />
          <div>{i18n.custom}</div>
        </Card>
      </div>
      <div className={css.createNewMessage}>{i18n.newContentMessage}</div>
    </div>
  )
}

export const StageBuilder = (): JSX.Element => {
  const [data, setData] = React.useState<GraphObj[]>([])

  const [dynamicPopoverHandler, setDynamicPopoverHandler] = React.useState<
    DynamicPopoverHandlerBinding<PopoverData> | undefined
  >()

  const addStage = (type: StageType): void => {
    data.push({
      stage: {
        type,
        name: 'Untitled',
        identifier: `Untitled-${data.length}`
      }
    })
    dynamicPopoverHandler?.hide()
    model.addUpdateGraph(data, listener)
    engine.repaintCanvas()
    setData(data)
  }

  const listener: NodeModelListener = {
    [Diagram.Event.SelectionChanged]: (event: any) => {
      const eventTemp = event as Diagram.DefaultNodeEvent
      const nodeRender = document.querySelector(`[data-nodeid="${eventTemp.entity.getID()}"]`)
      if (nodeRender && eventTemp.isSelected) {
        if (eventTemp.entity.getType() === Diagram.DiagramType.CreateNew) {
          dynamicPopoverHandler?.show(nodeRender, { addStage, isStageView: false }, { useArrows: true, darkMode: true })
        } else {
          dynamicPopoverHandler?.show(nodeRender, { isStageView: true }, { useArrows: false, darkMode: false })
        }
      }
    }
  }

  //1) setup the diagram engine
  const engine = React.useMemo(() => Diagram.createEngine(), [])

  //2) setup the diagram model
  const model = React.useMemo(() => new StageBuilderModel(), [])

  model.addUpdateGraph(data, listener)

  // load model into engine
  engine.setModel(model)

  return (
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
      <span className={css.canvasButtons}>
        <Layout.Vertical spacing="medium" id="button-group">
          <ButtonGroup>
            <Button
              icon="square"
              tooltip={i18n.zoomToFit}
              onClick={() => {
                engine.zoomToFit()
                dynamicPopoverHandler?.hide()
              }}
            />
          </ButtonGroup>
          <ButtonGroup>
            <Button
              icon="layout-grid"
              tooltip={i18n.reset}
              onClick={() => {
                engine.getModel().setZoomLevel(100)
                engine.repaintCanvas()
                dynamicPopoverHandler?.hide()
              }}
            />
          </ButtonGroup>
          <ButtonGroup>
            <Button
              icon="reset"
              tooltip={i18n.refresh}
              onClick={() => {
                engine.getModel().setZoomLevel(100)
                engine.repaintCanvas()
                dynamicPopoverHandler?.hide()
              }}
            />
          </ButtonGroup>
          <span className={css.verticalButtons}>
            <ButtonGroup>
              <Button
                icon="plus"
                tooltip={i18n.zoomIn}
                onClick={() => {
                  const zoomLevel = engine.getModel().getZoomLevel()
                  engine.getModel().setZoomLevel(zoomLevel + 20)
                  engine.repaintCanvas()
                  dynamicPopoverHandler?.hide()
                }}
              />
              <Button
                icon="minus"
                tooltip={i18n.zoomOut}
                onClick={() => {
                  const zoomLevel = engine.getModel().getZoomLevel()
                  engine.getModel().setZoomLevel(zoomLevel - 20)
                  engine.repaintCanvas()
                  dynamicPopoverHandler?.hide()
                }}
              />
            </ButtonGroup>
          </span>
        </Layout.Vertical>
      </span>
    </div>
  )
}
