import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { StepWizard, Layout, SelectOption, Button, Text, FormInput, Formik } from '@wings-software/uikit'
import { Form } from 'formik'

import * as Yup from 'yup'
import { get } from 'lodash'
import { useGetConnectorList } from 'services/cd-ng'
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

const manifestTypes = [
  { label: i18n.MANIFEST_TYPES[0].label, value: 'K8sManifest' },
  { label: i18n.MANIFEST_TYPES[1].label, value: 'Values' }
]

const FirstStep = (props: any): JSX.Element => {
  const { setFormData } = props

  const { accountId }: any = useParams()

  const { data: gitConnectorListResponse, loading: loadingGitConnector } = useGetConnectorList({
    accountIdentifier: accountId,
    queryParams: {}
  })

  const [gitConnectorsList, setGitConnectorsList] = useState<SelectOption[]>([])

  useEffect(() => {
    const gitConnectors =
      gitConnectorListResponse?.data?.content?.map(git => {
        return {
          label: git.name || '',
          value: git.identifier || '',
          type: git.type
        }
      }) || []

    setGitConnectorsList(gitConnectors.filter(data => data.type === 'Git'))
  }, [gitConnectorListResponse?.data?.content])

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
            <FormInput.MultiTypeInput
              name="gitServer"
              style={{ width: 400 }}
              disabled={loadingGitConnector}
              label={i18n.STEP_ONE.select}
              placeholder={i18n.STEP_ONE.gitServerPlaceholder}
              selectItems={gitConnectorsList}
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
  stage: StageElementWrapper | undefined
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
