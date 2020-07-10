import React from 'react'
import { Layout, Button, Card, CardBody, Text, Color } from '@wings-software/uikit'
import css from './InfraSpecifications.module.scss'
import i18n from './InfraSpecifications.i18n'
import { Formik, FormikForm, FormInput } from '@wings-software/uikit'
import * as Yup from 'yup'

import { PipelineContext } from 'modules/cd/pages/pipelines/PipelineContext/PipelineContext'
import { get } from 'lodash-es'
import { loggerFor, ModuleName } from 'framework/exports'

const logger = loggerFor(ModuleName.CD)

const infraOptions = [
  { label: i18n.prodLabel, value: 'PRODUCTION' },
  { label: i18n.nonProdLabel, value: 'PRE_PRODUCTION' }
]

export default function InfraSpecifications(): JSX.Element {
  const [isDescriptionVisible, setDescriptionVisible] = React.useState(false)
  const [isTagsVisible, setTagsVisible] = React.useState(false)

  const {
    state: { pipeline },
    updatePipeline
  } = React.useContext(PipelineContext)

  const getInitialValues = (): { infraName: string; description: string; tags: null | []; infraType: string } => {
    const environment = get(pipeline, 'stages[0].deployment.deployment.infrastructure.environment', null)
    const displayName = environment?.displayName
    const description = environment?.description
    return { infraName: displayName, description: description, tags: null, infraType: environment?.type }
  }

  const getInitialInfraConnectorValues = (): { connectorId: string; namespaceId: string } => {
    const infrastructure = get(
      pipeline,
      'stages[0].deployment.deployment.infrastructure.infrastructureSpec.infrastructure',
      null
    )
    const connectorId = infrastructure?.connectorId
    const namespaceId = infrastructure?.namespace
    return { connectorId, namespaceId }
  }

  return (
    <Layout.Vertical className={css.serviceOverrides}>
      <Layout.Vertical spacing="large">
        <Formik
          initialValues={getInitialValues()}
          validate={value => {
            const pipelineData = get(pipeline, 'stages[0].deployment.deployment', {})
            const infraStruct = {
              steps: null,
              rollbackSteps: null,
              previousStageIdentifier: null,
              refType: {
                type: 'OUTCOME'
              },
              infrastructureSpec: {
                infrastructure: {}
              },
              environment: {
                displayName: value.infraName,
                identifier: value.infraName,
                description: value.description,
                type: value.infraType,
                tags: [],
                refType: {
                  type: 'OUTCOME'
                }
              }
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
                      items={[
                        'The Godfather',
                        'The Godfather: Part II',
                        'The Dark Knight',
                        '12 Angry Men',
                        "Schindler's List",
                        'Special'
                      ]}
                      style={{ width: 400 }}
                      labelFor={(name: any) => name}
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
          initialValues={getInitialInfraConnectorValues()}
          validate={(value: { connectorId: string; namespaceId: string }) => {
            const infraSpec = get(pipeline, 'stages[0].deployment.deployment.infrastructure.infrastructureSpec', {})
            const infraStruct = {
              connectorId: value.connectorId,
              namespace: value.namespaceId,
              releaseName: 'my-release',
              kind: 'K8S_DIRECT',
              infraMapping: {
                type: 'K8sDirectInfraMapping',
                uuid: null,
                accountId: null,
                k8sConnector: null,
                namespace: value.namespaceId,
                serviceIdentifier: null,
                refType: {
                  type: 'OUTCOME'
                }
              },
              refType: {
                type: 'OUTCOME'
              }
            }
            infraSpec['infrastructure'] = infraStruct
            updatePipeline(pipeline)
          }}
          onSubmit={values => {
            logger.info(JSON.stringify(values))
          }}
        >
          {() => {
            return (
              <FormikForm>
                <FormInput.Select
                  name="connectorId"
                  style={{ width: 400 }}
                  label={i18n.k8ConnectorDropDownLabel}
                  placeholder={i18n.k8ConnectorDropDownPlaceholder}
                  items={[]}
                />
                <FormInput.Text
                  name="namespaceId"
                  style={{ width: 400 }}
                  label={i18n.nameSpaceLabel}
                  placeholder={i18n.nameSpacePlaceholder}
                />
              </FormikForm>
            )
          }}
        </Formik>
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
