import React, { useState } from 'react'
import { StepWizard, Layout, Button, Text, FormInput, Formik } from '@wings-software/uikit'
import css from './ManifestWizard.module.scss'
import { Form } from 'formik'
import i18n from './ManifestWizard.i18n'

import * as Yup from 'yup'
import { StringUtils } from 'modules/common/exports'

import { get } from 'lodash'
import type { StageWrapper } from 'services/ng-temp'

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

const manifestTypes = [
  { label: i18n.MANIFEST_TYPES[0].label, value: 'K8sManifest' },
  { label: i18n.MANIFEST_TYPES[1].label, value: 'Values' }
]

const FirstStep = (props: any): JSX.Element => {
  const { setFormData } = props
  return (
    <Layout.Vertical spacing="xxlarge" padding="small" style={{ height: '100%' }}>
      <Text font="medium">{i18n.STEP_TWO.name}</Text>
      <Formik
        initialValues={{}}
        validationSchema={Yup.object().shape({
          gitServer: Yup.string().trim().required(),
          name: Yup.string().trim().required(),
          identifier: Yup.string()
            .trim()
            .required()
            .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, 'Identifier can only contain alphanumerics, _ and $')
            .notOneOf(StringUtils.illegalIdentifiers)
        })}
        onSubmit={formData => {
          props.nextStep(formData)
          setFormData(formData)
        }}
      >
        {() => (
          <Form className={css.formContainer}>
            <FormInput.InputWithIdentifier inputLabel={i18n.STEP_TWO.manifestId} />
            <FormInput.Select
              name="gitServer"
              label={i18n.STEP_ONE.select}
              items={[{ label: 'GIT Connector 1', value: 'VWjzrm4KRZOJvIJGtQ6Wbw' }]}
            />
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
    ? get(props.stage, 'stage.spec.service.serviceDef.spec.manifestOverrideSets', {})
    : get(props.stage, 'stage.spec.service.serviceDef.spec.manifests', {})
  return (
    <Layout.Vertical spacing="xxlarge" padding="small" style={{ height: '100%' }}>
      <Text font="medium">{i18n.STEP_TWO.title}</Text>
      <Formik
        initialValues={{}}
        validationSchema={Yup.object().shape({
          manifestType: Yup.string().trim().required(),
          filePath: Yup.string().trim().required()
        })}
        onSubmit={(formData: any) => {
          const manifestObj = {
            manifest: {
              identifier: prevData.identifier,
              type: formData?.manifestType,
              spec: {
                store: {
                  type: 'Git',
                  spec: {
                    connectorIdentifier: prevData?.gitServer,
                    gitFetchType: 'Branch',
                    branch: formData?.fetchValue,
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
        {() => (
          <Form className={css.formContainer}>
            <FormInput.Select name="manifestType" label={i18n.STEP_TWO.manifestInputType} items={manifestTypes} />
            <FormInput.Text label={i18n.STEP_TWO.fetchValue} name="fetchValue" />
            <FormInput.Text label={i18n.STEP_TWO.filePath} name="filePath" />

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
  identifierName,
  stage
}: {
  closeModal: () => void
  identifier: string
  pipeline: object
  updatePipeline: object
  isForOverrideSets?: boolean
  identifierName?: string
  stage: StageWrapper | undefined
}): JSX.Element => {
  const [formData, setFormData] = useState({})

  return (
    <div className={css.exampleWizard}>
      <StepWizard>
        <FirstStep name={i18n.STEP_ONE.name} formData={formData} setFormData={setFormData} />
        <SecondStep
          name={i18n.STEP_TWO.name}
          formData={formData}
          setFormData={setFormData}
          identifier={identifier}
          isForOverrideSets={isForOverrideSets}
          identifierName={identifierName}
          pipeline={pipeline}
          stage={stage}
          updatePipeline={updatePipeline}
          closeModal={closeModal}
        />
      </StepWizard>
      <Button text="close" />
    </div>
  )
}
