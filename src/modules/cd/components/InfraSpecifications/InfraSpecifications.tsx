import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Layout, Button, Card, CardBody, Text, Color, SelectOption } from '@wings-software/uikit'
import { Formik, FormikForm, FormInput } from '@wings-software/uikit'
import * as Yup from 'yup'

import { get } from 'lodash'
import { useGetConnectorList } from 'services/cd-ng'
import { PipelineContext } from 'modules/cd/pages/pipeline-studio/PipelineContext/PipelineContext'
import { loggerFor, ModuleName } from 'framework/exports'

import i18n from './InfraSpecifications.i18n'
import { getStageFromPipeline } from '../../pages/pipeline-studio/StageBuilder/StageBuilderUtil'
import css from './InfraSpecifications.module.scss'

const logger = loggerFor(ModuleName.CD)

const infraOptions = [
  { label: i18n.prodLabel, value: 'Production' },
  { label: i18n.nonProdLabel, value: 'PreProduction' }
]

export default function InfraSpecifications(): JSX.Element {
  const [isDescriptionVisible, setDescriptionVisible] = React.useState(false)
  const [isTagsVisible, setTagsVisible] = React.useState(false)

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

  const getInitialValues = (): { infraName: string; description: string; tags: null | []; infraType: string } => {
    const environment = get(stage, 'stage.spec.infrastructure.environment', null)
    const displayName = environment?.name
    const description = environment?.description
    return { infraName: displayName, description: description, tags: null, infraType: environment?.type }
  }

  const [k8ConnectorsList, setK8ConnectorsList] = useState<SelectOption[]>([])

  const { accountId }: any = useParams()

  const { data: k8sConnectorsList, loading: loadingK8sConnector } = useGetConnectorList({
    accountIdentifier: accountId,
    queryParams: { type: 'K8sCluster' }
  })

  useEffect(() => {
    const k8Connectors =
      k8sConnectorsList?.data?.content?.map(k8 => {
        return {
          label: k8.name || '',
          value: k8.identifier || ''
        }
      }) || []

    setK8ConnectorsList(k8Connectors)
  }, [k8sConnectorsList?.data?.content])

  const getInitialInfraConnectorValues = (): {
    connectorId: SelectOption | undefined
    namespaceId: string
    releaseName: string
  } => {
    const infrastructure = get(stage, 'stage.spec.infrastructure.infrastructureDefinition', null)
    const connectorIdValue = infrastructure?.spec?.connectorIdentifier
    const namespaceId = infrastructure?.spec?.namespace
    const releaseName = infrastructure?.spec?.releaseName
    const getConnectorDetail = k8ConnectorsList.find(v => v.value === connectorIdValue)
    return {
      connectorId: getConnectorDetail,
      namespaceId,
      releaseName
    }
  }

  return (
    <Layout.Vertical className={css.serviceOverrides}>
      <Layout.Vertical spacing="large">
        <Formik
          initialValues={getInitialValues()}
          validate={value => {
            const pipelineData = get(stage, 'stage.spec', {})
            const infraStruct = {
              environment: {
                name: value.infraName,
                identifier: value.infraName,
                description: value.description,
                type: value.infraType,
                tags: []
              },
              infrastructureDefinition: {}
            }
            pipelineData['infrastructure'] = infraStruct
            updatePipeline(pipeline)
          }}
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
                  <FormInput.Text
                    name="infraName"
                    style={{ width: 300 }}
                    label={i18n.infraNameLabel}
                    placeholder={i18n.infraNamePlaceholderText}
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
                      items={['GCP', 'CDP']}
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
      <Layout.Vertical spacing="medium">
        <Text style={{ fontSize: 16, color: Color.BLACK, marginTop: 15 }}>{i18n.k8ConnectorLabel}</Text>
        <Formik
          enableReinitialize
          initialValues={getInitialInfraConnectorValues()}
          validate={(value: { connectorId?: SelectOption; namespaceId: string; releaseName: string }) => {
            const infraSpec = get(stage, 'stage.spec.infrastructure', {})
            const infraStruct = {
              type: 'KubernetesDirect',
              spec: {
                connectorIdentifier: value.connectorId?.value,
                namespace: value.namespaceId,
                releaseName: value.releaseName
              }
            }
            infraSpec['infrastructureDefinition'] = infraStruct
            updatePipeline(pipeline)
          }}
          onSubmit={values => {
            logger.info(JSON.stringify(values))
          }}
        >
          {() => {
            return (
              <FormikForm>
                <FormInput.MultiTypeInput
                  name="connectorId"
                  style={{ width: 400 }}
                  disabled={loadingK8sConnector}
                  label={i18n.k8ConnectorDropDownLabel}
                  placeholder={i18n.k8ConnectorDropDownPlaceholder}
                  selectItems={k8ConnectorsList}
                />
                <FormInput.Text
                  name="namespaceId"
                  style={{ width: 400 }}
                  label={i18n.nameSpaceLabel}
                  placeholder={i18n.nameSpacePlaceholder}
                />
                <FormInput.Text
                  name="releaseName"
                  style={{ width: 400 }}
                  label={i18n.releaseName}
                  placeholder={i18n.releaseNamePlaceholder}
                />
              </FormikForm>
            )
          }}
        </Formik>
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
