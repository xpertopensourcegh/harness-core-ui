import React from 'react'
import {
  Layout,
  Text,
  CollapseList,
  CollapseListPanel,
  Button,
  TextInput,
  Label,
  SelectOption,
  Formik,
  FormInput,
  Icon
} from '@wings-software/uicore'
import { Form, FieldArray, FieldArrayRenderProps } from 'formik'
import { Dialog, IDialogProps } from '@blueprintjs/core'
import get from 'lodash-es/get'
import setData from 'lodash-es/set'
import isEmpty from 'lodash-es/isEmpty'
import * as Yup from 'yup'
import cx from 'classnames'
import { PipelineContext, getStageFromPipeline, getPrevoiusStageFromIndex } from '@pipeline/exports'
import { useStrings } from 'framework/exports'
import WorkflowVariables from '@pipeline/components/WorkflowVariablesSelection/WorkflowVariables'
import ArtifactsSelection from '../ArtifactsSelection/ArtifactsSelection'
import ManifestSelection from '../ManifestSelection/ManifestSelection'
import { getStageIndexFromPipeline } from '../PipelineStudio/StageBuilder/StageBuilderUtil'
import factory from '../PipelineSteps/PipelineStepFactory'
import i18n from './OverrideSets.i18n'
import css from './OverrideSets.module.scss'

export default function OverrideSets({
  selectedTab,
  isPropagating = false
}: {
  selectedTab: string
  isPropagating?: boolean
  parentStage?: string
}): JSX.Element {
  const { getString } = useStrings()
  const initialName = ''
  const [overrideName, setOverrideName] = React.useState(initialName)
  const [isModalOpen, setModalState] = React.useState(false)
  const [isErrorVisible, setErrorVisibility] = React.useState(false)
  const [parentStageData, setParentStageData] = React.useState<{ [key: string]: any }>()
  const {
    state: {
      pipeline,
      pipelineView: {
        splitViewData: { selectedStageId }
      }
    },
    updatePipeline
  } = React.useContext(PipelineContext)
  const { stage } = getStageFromPipeline(pipeline, selectedStageId || '')
  const { stages } = getPrevoiusStageFromIndex(pipeline)
  const serviceDefPath = 'stage.spec.service.serviceDefinition.spec'
  const artifactTab = getString('pipelineSteps.deploy.serviceSpecifications.deploymentTypes.artifacts')
  const manifestTab = getString('pipelineSteps.deploy.serviceSpecifications.deploymentTypes.manifests')
  const variableTab = getString('pipelineSteps.build.stageSpecifications.variablesDetails')
  const currentListPath =
    serviceDefPath +
    '.' +
    (selectedTab === artifactTab
      ? 'artifactOverrideSets'
      : selectedTab === manifestTab
      ? 'manifestOverrideSets'
      : 'variableOverrideSets')
  const currentVisibleOverridesList = !isEmpty(parentStageData)
    ? get(parentStageData, currentListPath, [])
    : get(stage, currentListPath, [])

  React.useEffect(() => {
    if (isEmpty(parentStageData) && stage?.stage?.spec?.service?.useFromStage?.stage) {
      const parentStageName = stage?.stage?.spec?.service?.useFromStage?.stage
      const { index } = getStageIndexFromPipeline(pipeline, parentStageName)
      setParentStageData(stages[index])
    }
  }, [])

  const createOverrideSet = (idName: string): void => {
    if (selectedTab === i18n.tabs.artifacts) {
      const artifactOverrideSets = get(stage, serviceDefPath + '.artifactOverrideSets', [])
      const artifactOverrideSetsStruct = {
        overrideSet: {
          identifier: idName,
          artifacts: {}
        }
      }
      artifactOverrideSets.push(artifactOverrideSetsStruct)
      setData(stage as {}, serviceDefPath + '.artifactOverrideSets', artifactOverrideSets)
    }
    if (selectedTab === i18n.tabs.manifests) {
      const manifestOverrideSets = get(stage, serviceDefPath + '.manifestOverrideSets', [])
      const manifestOverrideSetStruct = {
        overrideSet: {
          identifier: idName,
          manifests: []
        }
      }
      manifestOverrideSets.push(manifestOverrideSetStruct)
      setData(stage as {}, serviceDefPath + '.manifestOverrideSets', manifestOverrideSets)
    }
    if (selectedTab === variableTab) {
      const variableOverrideSets = get(stage, serviceDefPath + '.variableOverrideSets', [])
      const variableOverrideSetsStruct = {
        overrideSet: {
          identifier: idName,
          variables: []
        }
      }
      variableOverrideSets.push(variableOverrideSetsStruct)
      setData(stage as {}, serviceDefPath + '.variableOverrideSets', variableOverrideSets)
    }
    updatePipeline(pipeline)
  }

  const modalPropsLight: IDialogProps = {
    isOpen: isModalOpen,
    usePortal: true,
    autoFocus: true,
    canEscapeKeyClose: true,
    title: i18n.modalTitle,
    canOutsideClickClose: true,
    enforceFocus: true,
    onClose: () => {
      setOverrideName(initialName)
      setModalState(false)
    },
    style: { width: 450, height: 215, paddingBottom: 0, borderLeftWidth: 5, position: 'relative', overflow: 'hidden' }
  }

  const onSubmitOverride = () => {
    if (!overrideName) {
      setErrorVisibility(true)
      return
    }
    createOverrideSet(overrideName)
    setModalState(false)
    setOverrideName(initialName)
  }

  const getOverrideStages = React.useCallback((): SelectOption[] => {
    const items: SelectOption[] = []

    if (parentStageData?.stage?.spec?.service?.serviceDefinition?.spec) {
      selectedTab === artifactTab &&
        parentStageData.stage.spec.service.serviceDefinition.spec?.artifactOverrideSets?.forEach(
          ({ overrideSet: { identifier } }: { overrideSet: { identifier: string } }) => {
            items.push({ label: identifier, value: identifier })
          }
        )
      selectedTab === manifestTab &&
        parentStageData.stage.spec.service.serviceDefinition.spec?.manifestOverrideSets?.forEach(
          ({ overrideSet: { identifier } }: { overrideSet: { identifier: string } }) => {
            items.push({ label: identifier, value: identifier })
          }
        )

      selectedTab === variableTab &&
        parentStageData.stage.spec.service.serviceDefinition.spec?.variableOverrideSets?.forEach(
          ({ overrideSet: { identifier } }: { overrideSet: { identifier: string } }) => {
            items.push({ label: identifier, value: identifier })
          }
        )
    }

    return items
  }, [parentStageData, selectedTab])

  const onDragStart = React.useCallback((event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.dataTransfer.setData('data', index.toString())
    event.currentTarget.classList.add(css.dragging)
  }, [])
  const onDragEnd = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.classList.remove(css.dragging)
  }, [])

  const onDragLeave = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.classList.remove(css.dragOver)
  }, [])

  const onDragOver = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    /* istanbul ignore else */
    if (event.preventDefault) {
      event.preventDefault()
    }
    event.currentTarget.classList.add(css.dragOver)
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>, arrayHelpers: FieldArrayRenderProps, droppedIndex: number) => {
      /* istanbul ignore else */
      if (event.preventDefault) {
        event.preventDefault()
      }
      const data = event.dataTransfer.getData('data')
      /* istanbul ignore else */
      if (data) {
        const index = parseInt(data, 10)
        arrayHelpers.swap(index, droppedIndex)
      }
      event.currentTarget.classList.remove(css.dragOver)
    },
    []
  )
  const getInitialValues = () => {
    let selectedOverrideSets: string[] = []
    if (selectedTab === artifactTab && stage?.stage?.spec?.service?.stageOverrides?.useArtifactOverrideSets?.length) {
      selectedOverrideSets = [...stage.stage.spec.service.stageOverrides.useArtifactOverrideSets]
    }
    if (selectedTab === manifestTab && stage?.stage?.spec?.service?.stageOverrides?.useManifestOverrideSets?.length) {
      selectedOverrideSets = [...stage.stage.spec.service.stageOverrides.useManifestOverrideSets]
    }

    if (selectedTab === variableTab && stage?.stage?.spec?.service?.stageOverrides?.useVariableOverrideSets?.length) {
      selectedOverrideSets = [...stage.stage.spec.service.stageOverrides.useVariableOverrideSets]
    }

    return { selectedOverrideSets }
  }
  return (
    <Layout.Vertical padding="large" style={{ background: 'var(--grey-100)', paddingTop: 0 }}>
      <Text style={{ color: 'var(--grey-400)', lineHeight: '24px' }}>{i18n.configure}</Text>
      <Text style={{ color: 'var(--grey-500)', lineHeight: '24px', paddingBottom: 'var(--spacing-medium)' }}>
        {i18n.info}
      </Text>

      {isPropagating && (
        <Formik
          initialValues={getInitialValues()}
          validationSchema={Yup.object().shape({
            selectedOverrideSet: Yup.array()
          })}
          onSubmit={(): void => {
            // do nothing.
          }}
          validate={({ selectedOverrideSets }: { selectedOverrideSets: string[] }) => {
            if (selectedTab === artifactTab && stage) {
              stage.stage.spec.service.stageOverrides.useArtifactOverrideSets = selectedOverrideSets
              return updatePipeline(pipeline)
            }
            if (selectedTab === manifestTab && stage) {
              stage.stage.spec.service.stageOverrides.useManifestOverrideSets = selectedOverrideSets
              return updatePipeline(pipeline)
            }
            if (selectedTab === variableTab && stage) {
              stage.stage.spec.service.stageOverrides.useVariableOverrideSets = selectedOverrideSets
              return updatePipeline(pipeline)
            }
          }}
          enableReinitialize={true}
        >
          {formik => {
            return (
              <Form>
                <FieldArray
                  name="selectedOverrideSets"
                  render={arrayHelpers => (
                    <Layout.Vertical>
                      {formik.values?.selectedOverrideSets?.map((set: string, index: number) => (
                        <Layout.Horizontal
                          key={`${set}_${index}`}
                          flex={{ distribution: 'space-between' }}
                          style={{ alignItems: 'end' }}
                        >
                          <Layout.Horizontal
                            spacing="medium"
                            // style={{ alignItems: 'baseline' }}
                            draggable={true}
                            onDragStart={event => {
                              onDragStart(event, index)
                            }}
                            data-testid={set}
                            onDragEnd={onDragEnd}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={event => onDrop(event, arrayHelpers, index)}
                          >
                            <div className={css.overrideList}>
                              <div className={css.artifactSelection}>
                                <div>
                                  {formik.values?.selectedOverrideSets?.length > 1 && (
                                    <Icon name="drag-handle-vertical" className={css.drag} />
                                  )}
                                </div>
                                <FormInput.Select
                                  className={cx(css.selectInput, 'selectOverrideSets')}
                                  name={`selectedOverrideSets[${index}]`}
                                  items={getOverrideStages()}
                                />
                              </div>
                              <div className={css.artifactsTabs}>
                                {set && selectedTab === artifactTab && (
                                  <ArtifactsSelection
                                    isForOverrideSets={!isPropagating}
                                    isForPredefinedSets={false}
                                    isPropagating={true}
                                    overrideSetIdentifier={get(formik.values, `selectedOverrideSets[${index}]`, '')}
                                  />
                                )}
                                {set && selectedTab === manifestTab && (
                                  <ManifestSelection
                                    isForOverrideSets={!isPropagating}
                                    isForPredefinedSets={false}
                                    isPropagating={true}
                                    overrideSetIdentifier={get(formik.values, `selectedOverrideSets[${index}]`, '')}
                                  />
                                )}
                                {set && selectedTab === variableTab && (
                                  <WorkflowVariables
                                    factory={factory}
                                    isForOverrideSets={!isPropagating}
                                    isForPredefinedSets={false}
                                    isPropagating={isPropagating}
                                    overrideSetIdentifier={get(formik.values, `selectedOverrideSets[${index}]`, '')}
                                  />
                                )}
                              </div>
                            </div>
                          </Layout.Horizontal>
                          <Button
                            minimal
                            icon="minus"
                            id="removeOverrideSet"
                            onClick={() => arrayHelpers.remove(index)}
                          />
                        </Layout.Horizontal>
                      ))}
                      <span>
                        {formik.values?.selectedOverrideSets?.length < getOverrideStages().length && (
                          <Button
                            minimal
                            text={getString('addOverrideSet')}
                            intent="primary"
                            className={cx(css.addFileButton, 'addOverrideSetButton')}
                            onClick={() => arrayHelpers.push('')}
                          />
                        )}
                      </span>
                    </Layout.Vertical>
                  )}
                />
              </Form>
            )
          }}
        </Formik>
      )}

      {!isPropagating && (
        <section className={css.collapseContainer}>
          <CollapseList>
            {currentVisibleOverridesList.map((data: { overrideSet: { identifier: string } }, index: number) => {
              return (
                <CollapseListPanel
                  key={data.overrideSet.identifier + index}
                  collapseHeaderProps={{
                    heading: `${i18n.overrideSetNamePrefix} ${data.overrideSet.identifier}`,
                    isRemovable: true,
                    onRemove: () => {
                      currentVisibleOverridesList.splice(index, 1)
                      updatePipeline(pipeline)
                    }
                  }}
                >
                  {selectedTab === artifactTab && (
                    <ArtifactsSelection
                      isForOverrideSets={true}
                      identifierName={data.overrideSet.identifier}
                      isForPredefinedSets={false}
                    />
                  )}
                  {selectedTab === manifestTab && (
                    <ManifestSelection
                      isForOverrideSets={true}
                      identifierName={data.overrideSet.identifier}
                      isForPredefinedSets={false}
                    />
                  )}
                  {selectedTab === variableTab && (
                    <WorkflowVariables
                      identifierName={data.overrideSet.identifier}
                      factory={factory}
                      isForOverrideSets={true}
                      isForPredefinedSets={false}
                    />
                  )}
                </CollapseListPanel>
              )
            })}
          </CollapseList>
        </section>
      )}
      {isPropagating && (
        <>
          {selectedTab === artifactTab && (
            <ArtifactsSelection
              isForOverrideSets={!isPropagating}
              isForPredefinedSets={false}
              isPropagating={isPropagating}
            />
          )}
          {selectedTab === manifestTab && (
            <ManifestSelection
              isForOverrideSets={!isPropagating}
              isForPredefinedSets={false}
              isPropagating={isPropagating}
            />
          )}
          {selectedTab === variableTab && (
            <WorkflowVariables
              factory={factory}
              isPropagating={isPropagating}
              isForOverrideSets={!isPropagating}
              isForPredefinedSets={false}
            />
          )}
        </>
      )}
      {!isPropagating && (
        <Text intent="primary" style={{ cursor: 'pointer' }} onClick={() => setModalState(true)}>
          {i18n.createOverrideSet}
        </Text>
      )}
      {isModalOpen && (
        <Dialog {...modalPropsLight}>
          <Layout.Vertical spacing="small" padding="large">
            <Label>Override Set Name</Label>
            <TextInput
              placeholder={i18n.overrideSetPlaceholder}
              value={overrideName}
              onChange={e => {
                e.preventDefault()
                const element = e.currentTarget as HTMLInputElement
                const elementValue = element.value
                setErrorVisibility(false)
                setOverrideName(elementValue)
              }}
            />
            <Layout.Horizontal spacing="medium">
              <Button intent="primary" onClick={onSubmitOverride} text="Submit" />
              <Button
                text="Close"
                onClick={() => {
                  setModalState(false)
                  setOverrideName(initialName)
                }}
              />
            </Layout.Horizontal>
            {isErrorVisible && <section className={css.error}>{i18n.overrideSetError}</section>}
          </Layout.Vertical>
        </Dialog>
      )}
    </Layout.Vertical>
  )
}
