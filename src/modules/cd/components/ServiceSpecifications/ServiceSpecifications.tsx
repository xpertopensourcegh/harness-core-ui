import React from 'react'
import * as Yup from 'yup'

import {
  Layout,
  Tabs,
  Tab,
  Button,
  Card,
  CardBody,
  Text,
  Label,
  Formik,
  FormikForm,
  FormInput,
  IconName,
  Select,
  SelectOption
} from '@wings-software/uikit'

import cx from 'classnames'
import { PipelineContext } from 'modules/cd/pages/pipeline-studio/PipelineContext/PipelineContext'
import {
  getStageFromPipeline,
  getStageIndexFromPipeline,
  getPrevoiusStageFromIndex
} from 'modules/cd/pages/pipeline-studio/StageBuilder/StageBuilderUtil'
import { loggerFor, ModuleName } from 'framework/exports'
import ArtifactsSelection from '../ArtifactsSelection/ArtifactsSelection'
import ManifestSelection from '../ManifestSelection/ManifestSelection'
import WorkflowVariables from '../WorkflowVariablesSelection/WorkflowVariables'
import i18n from './ServiceSpecifications.i18n'
import OverrideSets from '../OverrideSets/OverrideSets'
import css from './ServiceSpecifications.module.scss'

const logger = loggerFor(ModuleName.CD)

const specificationTypes = {
  SPECIFICATION: 'SPECIFICATION',
  OVERRIDES: 'OVERRIDES'
}

const setupMode = {
  PROPAGATE: 'PROPAGATE',
  DIFFERENT: 'DIFFRENT'
}

const supportedDeploymentTypes: { name: string; icon: IconName }[] = [
  {
    name: i18n.deploymentTypes.kubernetes,
    icon: 'service-kubernetes'
  },
  {
    name: i18n.deploymentTypes.amazonEcs,
    icon: 'service-ecs'
  },
  {
    name: i18n.deploymentTypes.amazonAmi,
    icon: 'main-service-ami'
  },
  {
    name: i18n.deploymentTypes.awsCodeDeploy,
    icon: 'app-aws-code-deploy'
  },
  {
    name: i18n.deploymentTypes.winrm,
    icon: 'command-winrm'
  },
  {
    name: i18n.deploymentTypes.awsLambda,
    icon: 'app-aws-lambda'
  },
  {
    name: i18n.deploymentTypes.pcf,
    icon: 'service-pivotal'
  },
  {
    name: i18n.deploymentTypes.ssh,
    icon: 'secret-ssh'
  }
]

export default function ServiceSpecifications(): JSX.Element {
  const [isDescriptionVisible, setDescriptionVisible] = React.useState(false)
  const [selectedTab, setSelectedTab] = React.useState(i18n.artifacts)
  const [isTagsVisible, setTagsVisible] = React.useState(false)
  const [specSelected, setSelectedSpec] = React.useState(specificationTypes.SPECIFICATION)
  const [setupModeType, setSetupMode] = React.useState('')
  const [checkedItems, setCheckedItems] = React.useState({ overrideSetCheckbox: false })
  const [isConfigVisible, setConfigVisibility] = React.useState(false)
  const [selectedPropagatedState, setSelectedPropagatedState] = React.useState<SelectOption>()

  const previousStageList: { label: string; value: string }[] = []
  const {
    state: {
      pipeline,
      pipelineView: {
        splitViewData: { selectedStageId }
      }
    },

    updatePipeline
  } = React.useContext(PipelineContext)

  const { stage = {} } = getStageFromPipeline(pipeline, selectedStageId || '')
  const { index: stageIndex } = getStageIndexFromPipeline(pipeline, selectedStageId || '')
  const { stages } = getPrevoiusStageFromIndex(pipeline)

  React.useEffect(() => {
    if (stages && stages.length > 0) {
      stages.map((item, index) => {
        if (index < stageIndex) {
          previousStageList.push({
            label: `Previous Stage ${item.stage.name} [${item.stage.identifier}]`,
            value: item.stage.identifier
          })
        }
      })
    }
  }, [stages])

  React.useEffect(() => {
    if (stage?.stage) {
      if (!stage.stage.spec) {
        stage.stage.spec = {}
      }

      if (
        !stage.stage.spec.service?.serviceDefinition &&
        setupModeType === setupMode.DIFFERENT &&
        !stage.stage.spec.service?.useFromStage?.stage
      ) {
        setDefaultServiceSchema()
        setSelectedPropagatedState({ label: '', value: '' })
        setSetupMode(setupMode.DIFFERENT)
      } else if (
        setupModeType === setupMode.PROPAGATE &&
        stageIndex > 0 &&
        !stage.stage.spec.service?.serviceDefinition &&
        !stage.stage.spec.service?.useFromStage?.stage
      ) {
        stage.stage.spec = {
          service: {
            useFromStage: {
              stage: null
            },
            stageOverrides: null
          }
        }
        updatePipeline(pipeline)

        setSetupMode(setupMode.PROPAGATE)
      }
    }
  }, [setupModeType, stageIndex, stage?.stage])

  const setDefaultServiceSchema = (): void => {
    stage.stage.spec = {
      service: {
        identifier: null,
        name: null,
        description: null,
        // tags: null,
        serviceDefinition: {
          type: 'Kubernetes',
          spec: {
            artifacts: {
              // primary: null,
              sidecars: []
            },
            manifests: [],
            // variables: [],
            artifactOverrideSets: [],
            manifestOverrideSets: []
            // variableOverrideSets: []
          }
        }
      }
    }
    updatePipeline(pipeline)
  }

  const getInitialValues = (): {
    serviceName: string
    description: string
    tags: null | string[]
    identifier: string
  } => {
    const pipelineData = stage?.['stage']?.['spec']?.['service'] || null
    const serviceName = pipelineData?.name || ''
    const identifier = pipelineData?.identifier || ''
    const description = pipelineData?.description || ''
    return { serviceName: serviceName, description: description, tags: null, identifier }
  }

  const handleTabChange = (data: string): void => {
    setSelectedTab(data)
  }

  const selectPropagatedStep = (item: SelectOption): void => {
    if (item && item.value) {
      const stageServiceData = stage?.['stage']['spec']['service'] || null
      if (stageServiceData) {
        stageServiceData.useFromStage.stage = item.value
        updatePipeline(pipeline)
      }
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const _isChecked = (event.target as HTMLInputElement).checked
    const currentSpec = stage?.stage.spec?.service
    setCheckedItems({
      ...checkedItems,
      overrideSetCheckbox: _isChecked
    })
    if (_isChecked) {
      currentSpec.stageOverrides = {
        artifacts: {
          // primary: null,
          sidecars: []
        },
        manifests: [],
        // variables: [],
        useArtifactOverrideSets: [],
        useManifestOverrideSets: []
        // useVariableOverrideSets: []
      }

      updatePipeline(pipeline)
      setConfigVisibility(true)
    } else {
      currentSpec.stageOverrides = null
      updatePipeline(pipeline)
      setConfigVisibility(false)
    }
  }

  React.useEffect(() => {
    if (stageIndex === 0) {
      setSetupMode(setupMode.DIFFERENT)
    }
  }, [stageIndex])

  React.useEffect(() => {
    const useFromStage = stage?.stage.spec.service?.useFromStage
    const stageOverrides = stage?.stage.spec.service?.stageOverrides
    const serviceDefinition = stage?.stage.spec.service?.serviceDefinition

    if (useFromStage) {
      setSetupMode(setupMode.PROPAGATE)
      if (previousStageList && previousStageList.length > 0) {
        const selectedIdentifier = useFromStage?.stage
        const selectedOption = previousStageList.find(v => v.value === selectedIdentifier)

        if (selectedOption?.value !== selectedPropagatedState?.value) {
          setSelectedPropagatedState(selectedOption)
          if (stageOverrides) {
            if (!checkedItems.overrideSetCheckbox) {
              setCheckedItems({
                ...checkedItems,
                overrideSetCheckbox: true
              })
              if (!isConfigVisible) {
                setConfigVisibility(true)
              }
            }
          } else {
            setCheckedItems({
              ...checkedItems,
              overrideSetCheckbox: false
            })
            setConfigVisibility(false)
          }
          updatePipeline(pipeline)
        }
      }
      if (stageOverrides) {
        if (!checkedItems.overrideSetCheckbox) {
          setCheckedItems({
            ...checkedItems,
            overrideSetCheckbox: true
          })
          if (!isConfigVisible) {
            setConfigVisibility(true)
          }
        }
        if (!setupModeType) {
          setSetupMode(setupMode.PROPAGATE)
        }
      }
    } else if (serviceDefinition) {
      setSelectedPropagatedState({ label: '', value: '' })
      setSetupMode(setupMode.DIFFERENT)
    }
  }, [stage.stage.spec])

  const initWithServiceDefination = () => {
    setDefaultServiceSchema()
    setSelectedPropagatedState({ label: '', value: '' })
    setSetupMode(setupMode.DIFFERENT)
  }

  return (
    <Layout.Vertical className={css.serviceOverrides}>
      {stageIndex > 0 && (
        <Layout.Vertical
          spacing="medium"
          style={{ borderBottom: '1px solid var(--grey-200)', paddingBottom: 'var(--spacing-large)' }}
        >
          <Text style={{ color: 'var(--grey-600)' }}>Service</Text>
          <Layout.Horizontal spacing="medium" flex={true} style={{ alignItems: 'center', justifyContent: 'end' }}>
            <section
              className={cx(css.serviceStageSelection, setupModeType === setupMode.PROPAGATE && css.activeMode)}
              onClick={() => setSetupMode(setupMode.PROPAGATE)}
            >
              {i18n.propagateFromLabel}
              <Select
                className={css.propagatedropdown}
                items={previousStageList}
                value={selectedPropagatedState}
                onChange={(item: SelectOption) => selectPropagatedStep(item)}
              />
            </section>
            <section>{i18n.or}</section>
            <section
              className={cx(css.serviceStageSelection, setupModeType === setupMode.DIFFERENT && css.activeMode)}
              onClick={() => {
                initWithServiceDefination()
              }}
            >
              {i18n.deployDifferentLabel}
            </section>
          </Layout.Horizontal>
        </Layout.Vertical>
      )}
      {stageIndex > 0 && setupModeType === setupMode.PROPAGATE && (
        <Layout.Horizontal flex={true} className={css.specTabs}>
          <Button minimal text={i18n.stageOverrideLabel} className={css.selected} />
        </Layout.Horizontal>
      )}
      {stageIndex > 0 && setupModeType === setupMode.PROPAGATE && (
        <Layout.Vertical spacing="medium" padding="xxlarge">
          <Layout.Horizontal spacing="small" style={{ alignItems: 'center' }}>
            <input
              type="checkbox"
              id="overrideSetCheckbox"
              checked={checkedItems['overrideSetCheckbox']}
              className={css.overideCheckbox}
              onChange={handleChange}
            />
            <Label style={{ fontSize: 16, color: 'var(--grey-600)' }} htmlFor="overrideSetCheckbox">
              {i18n.overidesCondition}
            </Label>
          </Layout.Horizontal>

          <Text style={{ fontSize: 14, color: 'var(-grey-300)' }}>{i18n.overideInfoText}</Text>
        </Layout.Vertical>
      )}
      {(stageIndex === 0 || setupModeType === setupMode.DIFFERENT) && (
        <>
          <Layout.Vertical spacing="large">
            <Formik
              initialValues={getInitialValues()}
              validate={value => {
                if (stage) {
                  const serviceObj = stage['stage']['spec']['service']
                  serviceObj['identifier'] = value.identifier
                  serviceObj['name'] = value.serviceName
                  serviceObj['description'] = value.description
                  // serviceObj['tags'] = value.tags
                  updatePipeline(pipeline)
                }
              }}
              onSubmit={values => {
                logger.info(JSON.stringify(values))
              }}
              validationSchema={Yup.object().shape({
                serviceName: Yup.string().trim().required(i18n.validation.serviceName)
              })}
            >
              {() => {
                return (
                  <FormikForm>
                    <Layout.Horizontal spacing="medium">
                      <FormInput.InputWithIdentifier
                        inputName="serviceName"
                        inputLabel={i18n.serviceNameLabel}
                        inputGroupProps={{ placeholder: i18n.serviceNamePlaceholderText, className: css.name }}
                      />
                      <div className={css.addDataLinks}>
                        <Button
                          minimal
                          text={i18n.addDescription}
                          icon="plus"
                          onClick={() => setDescriptionVisible(true)}
                        />
                        <Button minimal text={i18n.addTags} icon="plus" onClick={() => setTagsVisible(true)} />
                      </div>
                    </Layout.Horizontal>

                    {isDescriptionVisible && (
                      <div>
                        <span onClick={() => setDescriptionVisible(false)} className={css.removeLink}>
                          {i18n.removeLabel}
                        </span>
                        <FormInput.TextArea name="description" label="Description" style={{ width: 400 }} />
                      </div>
                    )}
                    {isTagsVisible && (
                      <div>
                        <span onClick={() => setTagsVisible(false)} className={css.removeLink}>
                          {i18n.removeLabel}
                        </span>
                        <FormInput.TagInput
                          name={i18n.addTags}
                          label={i18n.tagsLabel}
                          items={[]}
                          style={{ width: 400 }}
                          labelFor={name => name as string}
                          itemFromNewTag={newTag => newTag}
                          tagInputProps={{
                            noInputBorder: true,
                            openOnKeyDown: false,
                            showAddTagButton: true,
                            showClearAllButton: true,
                            allowNewTag: true,
                            getTagProps: (value, _index, _selectedItems, createdItems) => {
                              return createdItems.includes(value)
                                ? { intent: 'danger', minimal: true }
                                : { intent: 'none', minimal: true }
                            }
                          }}
                        />
                      </div>
                    )}
                  </FormikForm>
                )
              }}
            </Formik>
          </Layout.Vertical>
          <Layout.Horizontal flex={true} className={css.specTabs}>
            <Button
              minimal
              text={i18n.serviceSpecificationLabel}
              onClick={() => setSelectedSpec(specificationTypes.SPECIFICATION)}
              className={cx({ [css.selected]: specSelected === specificationTypes.SPECIFICATION })}
            />
            <Button
              minimal
              disabled={stageIndex === 0}
              text={i18n.stageOverrideLabel}
              onClick={() => setSelectedSpec(specificationTypes.OVERRIDES)}
              className={cx({ [css.selected]: specSelected === specificationTypes.OVERRIDES })}
            />
          </Layout.Horizontal>
          {specSelected === specificationTypes.SPECIFICATION && (
            <Layout.Vertical spacing="medium" style={{ display: 'inline-block' }}>
              <Text style={{ fontSize: 16, color: 'var(--grey-400)' }}>{i18n.deploymentTypeLabel}</Text>

              {supportedDeploymentTypes.map((type: { name: string; icon: IconName }) => (
                <Card
                  key={type.name}
                  interactive={true}
                  selected={type.name === i18n.deploymentTypes.kubernetes ? true : false}
                  style={{ width: 90, padding: 'var(--spacing-small) 0', marginRight: 'var(--spacing-small)' }}
                >
                  <CardBody.Icon icon={type.icon as IconName} iconSize={26}>
                    <Text font={{ align: 'center' }} style={{ fontSize: 14 }}>
                      {type.name}
                    </Text>
                  </CardBody.Icon>
                </Card>
              ))}
            </Layout.Vertical>
          )}
        </>
      )}
      {(isConfigVisible || stageIndex === 0 || setupModeType === setupMode.DIFFERENT) && (
        <Layout.Vertical spacing="small">
          <Tabs id="serviceSpecifications" onChange={handleTabChange}>
            <Tab
              id={i18n.artifacts}
              title={i18n.artifacts}
              panel={
                <ArtifactsSelection
                  isForOverrideSets={false}
                  isForPredefinedSets={stageIndex > 0 && setupModeType === setupMode.PROPAGATE}
                />
              }
            />
            <Tab
              id={i18n.manifests}
              title={i18n.manifests}
              panel={
                <ManifestSelection
                  isForOverrideSets={false}
                  isForPredefinedSets={stageIndex > 0 && setupModeType === setupMode.PROPAGATE}
                />
              }
            />
            <Tab
              id={i18n.variables}
              title={i18n.variables}
              disabled={true}
              panel={
                <WorkflowVariables
                  isForOverrideSets={false}
                  isForPredefinedSets={stageIndex > 0 && setupModeType === setupMode.PROPAGATE}
                />
              }
            />
          </Tabs>
          {setupModeType === setupMode.DIFFERENT && <OverrideSets selectedTab={selectedTab} />}
        </Layout.Vertical>
      )}
    </Layout.Vertical>
  )
}
