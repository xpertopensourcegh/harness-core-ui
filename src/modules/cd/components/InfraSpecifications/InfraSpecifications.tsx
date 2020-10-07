import React from 'react'
import { Layout, Button, Card, CardBody, Text } from '@wings-software/uikit'
import { Formik, FormikForm, FormInput } from '@wings-software/uikit'
import * as Yup from 'yup'

import { get } from 'lodash-es'
import { PipelineContext } from 'modules/cd/pages/pipeline-studio/PipelineContext/PipelineContext'
import { loggerFor, ModuleName } from 'framework/exports'

import { StepWidget, StepViewType } from 'modules/common/exports'
import type { K8SDirectInfrastructure } from 'services/cd-ng'
import i18n from './InfraSpecifications.i18n'
import { getStageFromPipeline } from '../../pages/pipeline-studio/StageBuilder/StageBuilderUtil'
import factory from '../PipelineSteps/PipelineStepFactory'
import { StepType } from '../PipelineSteps/PipelineStepInterface'
import css from './InfraSpecifications.module.scss'

const logger = loggerFor(ModuleName.CD)

const infraOptions = [
  { label: i18n.prodLabel, value: 'Production' },
  { label: i18n.nonProdLabel, value: 'PreProduction' }
]

interface InfraDetail {
  infraName?: string
  description?: string
  tags?: null | []
  infraType?: string
  identifier?: string
}

export default function InfraSpecifications(): JSX.Element {
  const [isDescriptionVisible, setDescriptionVisible] = React.useState(false)
  const [isTagsVisible, setTagsVisible] = React.useState(false)
  const [initialValues, setInitialValues] = React.useState<{}>()
  const [updateKey, setUpdateKey] = React.useState(0)
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

  const getInitialValues = (): InfraDetail => {
    const environment = get(stage, 'stage.spec.infrastructure.environment', null)
    const displayName = environment?.name
    const description = environment?.description
    return {
      infraName: displayName,
      description: description,
      tags: null,
      infraType: environment?.type,
      identifier: environment?.identifier || ''
    }
  }

  React.useEffect(() => {
    setInitialValues(getInitialInfraConnectorValues())
    setUpdateKey(Math.random())
  }, [stage])

  const getInitialInfraConnectorValues = (): K8SDirectInfrastructure => {
    const infrastructure = get(stage, 'stage.spec.infrastructure.infrastructureDefinition', null)
    const connectorRef = infrastructure?.spec?.connectorRef
    const namespace = infrastructure?.spec?.namespace
    const releaseName = infrastructure?.spec?.releaseName
    return {
      connectorRef,
      namespace,
      releaseName
    }
  }

  const onValidate = (value: InfraDetail): void => {
    const pipelineData = get(stage, 'stage.spec', {})
    if (pipelineData?.infrastructure) {
      const infraDetail = pipelineData?.infrastructure?.environment
      if (infraDetail) {
        infraDetail['name'] = value.infraName
        infraDetail['identifier'] = value.identifier || ''
        infraDetail['description'] = value.description
        infraDetail['type'] = value.infraType

        updatePipeline(pipeline)
      }
    } else {
      const infraStruct = {
        environment: {
          name: value.infraName,
          identifier: value.identifier || '',
          description: value.description,
          type: value.infraType
        },
        infrastructureDefinition: {}
      }
      pipelineData['infrastructure'] = infraStruct
      updatePipeline(pipeline)
    }
  }

  const onUpdateDefinition = (value: K8SDirectInfrastructure): void => {
    const infraSpec = get(stage, 'stage.spec.infrastructure', null)
    if (infraSpec) {
      const infraStruct = {
        type: 'KubernetesDirect',
        spec: {
          connectorRef: value.connectorRef,
          namespace: value.namespace,
          releaseName: value.releaseName
        }
      }
      infraSpec['infrastructureDefinition'] = infraStruct
      updatePipeline(pipeline)
    } else {
      const pipelineData = get(stage, 'stage.spec', {})
      const infra = {
        environment: {
          name: value.infraName,
          identifier: value.identifier || '',
          description: value.description,
          type: value.infraType
        },
        infrastructureDefinition: {
          type: 'KubernetesDirect',
          spec: {
            connectorRef: value.connectorRef,
            namespace: value.namespace,
            releaseName: value.releaseName
          }
        }
      }

      pipelineData['infrastructure'] = infra
      updatePipeline(pipeline)
    }
  }

  return (
    <Layout.Vertical className={css.serviceOverrides}>
      <Layout.Vertical spacing="large">
        <Formik
          initialValues={getInitialValues()}
          enableReinitialize={true}
          validate={value => onValidate(value)}
          onSubmit={values => {
            logger.info(JSON.stringify(values))
          }}
          validationSchema={Yup.object().shape({
            infraName: Yup.string().trim().required(i18n.validation.infraName)
          })}
        >
          {() => {
            return (
              <FormikForm>
                <Layout.Horizontal spacing="medium">
                  <FormInput.InputWithIdentifier
                    inputName="infraName"
                    inputLabel={i18n.infraNameLabel}
                    inputGroupProps={{ placeholder: i18n.infraNamePlaceholderText, className: css.name }}
                  />
                  <div className={css.addDataLinks}>
                    <Button
                      minimal
                      text={i18n.addDescription}
                      icon="plus"
                      onClick={() => setDescriptionVisible(true)}
                    />
                    {/* <Button minimal text={i18n.addTags} icon="plus" onClick={() => setTagsVisible(true)} /> */}
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
                <FormInput.Select
                  name="infraType"
                  style={{ width: 300 }}
                  label={i18n.infrastructureTypeLabel}
                  placeholder={i18n.infrastructureTypePlaceholder}
                  items={infraOptions}
                />
              </FormikForm>
            )
          }}
        </Formik>
      </Layout.Vertical>
      <Layout.Horizontal flex={true} className={css.specTabs}>
        <Button minimal text={i18n.infraSpecificationLabel} className={css.selected} />
      </Layout.Horizontal>
      <Layout.Horizontal flex={true}>
        <Text style={{ margin: '25px 0 15px 0', color: 'black', fontSize: 16 }}> {i18n.infraSpecHelpText}</Text>
      </Layout.Horizontal>
      <Layout.Vertical spacing="medium">
        <Text style={{ fontSize: 16, color: 'var(--grey-400)' }}>{i18n.deploymentTypeLabel}</Text>
        <Card interactive={true} selected style={{ width: 120 }}>
          <CardBody.Icon icon="service-kubernetes" iconSize={34}>
            <Text font={{ align: 'center' }} style={{ fontSize: 14 }}>
              {i18n.deploymentType}
            </Text>
          </CardBody.Icon>
        </Card>
      </Layout.Vertical>
      <StepWidget<K8SDirectInfrastructure>
        factory={factory}
        key={updateKey}
        initialValues={initialValues || {}}
        type={StepType.KubernetesInfraSpec}
        stepViewType={StepViewType.Edit}
        onUpdate={value => onUpdateDefinition(value)}
      />
    </Layout.Vertical>
  )
}
