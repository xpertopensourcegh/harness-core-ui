import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { StepWizard, Layout, Button, Text, FormInput, Formik } from '@wings-software/uikit'
import { Form } from 'formik'

import * as Yup from 'yup'
import { get } from 'lodash-es'
import { FormMultiTypeConnectorField } from 'modules/common/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import { StringUtils } from 'modules/common/exports'

import type { StageElementWrapper } from 'services/cd-ng'
import i18n from './ManifestWizard.i18n'
import css from './ManifestWizard.module.scss'

interface StepProps<PrevStepData> {
  name?: string
  prevStepData?: PrevStepData
  currentStep?: () => number
  totalSteps?: () => number
  nextStep?: (data?: PrevStepData) => void
  previousStep?: (data?: PrevStepData) => void
  gotoStep?: (stepNumber: number, data?: PrevStepData) => void
  firstStep?: (data?: PrevStepData) => void
  lastStep?: (data?: PrevStepData) => void
}

interface StepChangeData<SharedObject> {
  prevStep?: number
  nextStep?: number
  prevStepData: SharedObject
}
export interface StepWizardProps<SharedObject> {
  children: Array<React.ReactElement<StepProps<SharedObject>>>
  isNavMode?: boolean
  className?: string
  onStepChange?: (data: StepChangeData<SharedObject | undefined>) => void
  onCompleteWizard?: (data: SharedObject | undefined) => void // This will be called when all step completed
  initialStep?: number
}

const manifestTypes: { [key: number]: string } = { 2: 'K8sManifest', 3: 'Values' }

const gitFetchTypes = [
  { label: i18n.gitFetchTypes[0].label, value: 'Branch' },
  { label: i18n.gitFetchTypes[1].label, value: 'Commit' }
]

const FirstStep = (props: any): JSX.Element => {
  const { setFormData, handleViewChange } = props

  const { accountId, projectIdentifier, orgIdentifier } = useParams()

  return (
    <Layout.Vertical spacing="xxlarge" padding="small" style={{ height: '100%' }}>
      <Text font="medium">{i18n.STEP_TWO.name}</Text>
      <Formik
        initialValues={{}}
        validationSchema={Yup.object().shape({
          gitServer: Yup.string().trim().required(i18n.validation.gitServer)
        })}
        onSubmit={formData => {
          props.nextStep(formData)
          setFormData(formData)
        }}
      >
        {() => (
          <Form className={css.formContainerStepOne}>
            <Layout.Horizontal spacing="large" style={{ alignItems: 'center' }}>
              <FormMultiTypeConnectorField
                name="gitServer"
                label={i18n.STEP_ONE.select}
                placeholder={i18n.STEP_ONE.gitServerPlaceholder}
                accountIdentifier={accountId}
                projectIdentifier={projectIdentifier}
                orgIdentifier={orgIdentifier}
                width={400}
                isNewConnectorLabelVisible={false}
                type={'Git'}
              />
              <Button
                intent="primary"
                minimal
                text={i18n.STEP_ONE.addnewConnector}
                icon="plus"
                onClick={() => handleViewChange()}
              />
            </Layout.Horizontal>
            <Layout.Horizontal spacing="large" className={css.bottomButtons}>
              <Button type="submit" text={i18n.STEP_ONE.saveAndContinue} />
            </Layout.Horizontal>
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

const SecondStep = (props: any): JSX.Element => {
  const prevData = props?.prevStepData
  const manifests = props.isForOverrideSets
    ? get(props.stage, 'stage.spec.service.serviceDefinition.spec.manifestOverrideSets', [])
    : !props.isForPredefinedSets
    ? get(props.stage, 'stage.spec.service.serviceDefinition.spec.manifests', [])
    : get(props.stage, 'stage.spec.service.stageOverrides.manifests', [])
  return (
    <Layout.Vertical spacing="xxlarge" padding="small" style={{ height: '100%' }}>
      <Text font="medium">{i18n.STEP_TWO.title}</Text>
      <Formik
        initialValues={{ gitFetchType: gitFetchTypes[0].value }}
        validationSchema={Yup.object().shape({
          identifier: Yup.string()
            .trim()
            .required(i18n.validation.identifier)
            .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, i18n.STEP_TWO.manifestIdentifier)
            .notOneOf(StringUtils.illegalIdentifiers),
          filePath: Yup.string().trim().required(i18n.validation.filePath)
        })}
        onSubmit={(formData: any) => {
          const manifestObj = {
            manifest: {
              identifier: formData.identifier,
              type: manifestTypes[props.view],
              spec: {
                store: {
                  type: 'Git',
                  spec: {
                    connectorRef: prevData?.gitServer?.value,
                    gitFetchType: formData?.gitFetchType,
                    branch: formData?.branch,
                    commitId: formData?.commitId,
                    paths: [formData?.filePath]
                  }
                }
              }
            }
          }
          if (!props.isForOverrideSets) {
            if (manifests && manifests.length > 0) {
              manifests.push(manifestObj)
            } else {
              manifests.push(manifestObj)
            }
          } else {
            manifests.map((overrideSets: { overrideSet: { identifier: string; manifests: [{}] } }) => {
              if (overrideSets.overrideSet.identifier === props?.identifierName) {
                overrideSets.overrideSet.manifests.push(manifestObj)
              }
            })
          }

          props.updatePipeline(props.pipeline)
          props.closeModal()
        }}
      >
        {(formik: { values: { gitFetchType: string } }) => (
          <Form className={css.formContainer}>
            <FormInput.Text
              name="identifier"
              label={i18n.STEP_TWO.manifestId}
              placeholder={i18n.STEP_ONE.idPlaceholder}
            />
            <FormInput.Select name="gitFetchType" label={i18n.STEP_TWO.gitFetchTypeLabel} items={gitFetchTypes} />

            {formik.values?.gitFetchType === gitFetchTypes[0].value && (
              <FormInput.MultiTextInput
                label={i18n.STEP_TWO.branchLabel}
                placeholder={i18n.STEP_TWO.branchPlaceholder}
                name="branch"
              />
            )}
            {formik.values?.gitFetchType === gitFetchTypes[1].value && (
              <FormInput.MultiTextInput
                label={i18n.STEP_TWO.commitLabel}
                placeholder={i18n.STEP_TWO.commitPlaceholder}
                name="commitId"
              />
            )}

            <FormInput.MultiTextInput
              label={i18n.STEP_TWO.filePath}
              placeholder={i18n.STEP_TWO.filePathPlaceholder}
              name="filePath"
            />

            <Layout.Horizontal spacing="large" className={css.bottomButtons}>
              <Button onClick={() => props.previousStep({})} text={i18n.STEP_TWO.back} />

              <Button type="submit" style={{ color: 'var(--blue-500)' }} text={i18n.STEP_TWO.submit} />
            </Layout.Horizontal>
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

export const ManifestWizard = ({
  closeModal,
  identifier,
  pipeline,
  updatePipeline,
  isForOverrideSets,
  isForPredefinedSets,
  identifierName,
  stage,
  handleViewChange,
  view
}: {
  closeModal: () => void
  identifier: string
  pipeline: object
  updatePipeline: object
  isForOverrideSets?: boolean
  identifierName?: string
  stage: StageElementWrapper | undefined
  isForPredefinedSets?: boolean
  view?: number
  handleViewChange: () => void
}): JSX.Element => {
  const [formData, setFormData] = useState({})

  return (
    <div className={css.exampleWizard}>
      <StepWizard>
        <FirstStep
          name={i18n.STEP_ONE.name}
          formData={formData}
          setFormData={setFormData}
          handleViewChange={handleViewChange}
        />
        <SecondStep
          name={i18n.STEP_TWO.name}
          formData={formData}
          view={view}
          setFormData={setFormData}
          identifier={identifier}
          isForOverrideSets={isForOverrideSets}
          isForPredefinedSets={isForPredefinedSets}
          identifierName={identifierName}
          pipeline={pipeline}
          stage={stage}
          updatePipeline={updatePipeline}
          closeModal={closeModal}
        />
      </StepWizard>
    </div>
  )
}
