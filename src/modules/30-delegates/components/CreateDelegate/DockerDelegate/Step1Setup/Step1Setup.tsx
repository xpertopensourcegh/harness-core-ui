import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import type { FormikActions } from 'formik'
import set from 'lodash-es/set'
import { Layout, Formik, Button, FormikForm, Container, StepProps } from '@wings-software/uicore'
import * as Yup from 'yup'
import { validateDockerDelegatePromise } from 'services/portal'

import { useStrings } from 'framework/strings'

import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { AddDescriptionAndKVTagsWithIdentifier } from '@common/components/AddDescriptionAndTags/AddDescriptionAndTags'

import type { DockerDelegateWizardData } from '../CreateDockerDelegate'
import css from './Step1Setup.module.scss'

interface DelegateSetupStepProps {
  onBack?: any
}

//this regex is retrieved from kubernetes
const delegateNameRegex = /^[a-z]([-a-z0-9]*[a-z])?(\.[a-z0-9]([-a-z0-9]*[a-z])?)*$/g

const Step1Setup: React.FC<StepProps<DockerDelegateWizardData> & DelegateSetupStepProps> = props => {
  const { prevStepData } = props
  let initialValues
  if (prevStepData) {
    const tags = {}
    prevStepData.tags?.forEach(tag => set(tags, tag, ''))
    initialValues = {
      ...prevStepData,
      tags: tags
    }
  } else {
    initialValues = {
      name: '',
      identifier: '',
      description: '',
      tags: {}
    }
  }

  const { accountId } = useParams<ProjectPathProps>()
  const { getString } = useStrings()

  const [formData, setInitValues] = useState<DockerDelegateWizardData>(initialValues as DockerDelegateWizardData)

  const validateName = async (
    values: DockerDelegateWizardData,
    formikActions: FormikActions<DockerDelegateWizardData>
  ) => {
    const response = (await validateDockerDelegatePromise({
      queryParams: {
        accountId,
        delegateName: values.name
      }
    })) as any
    const isNameUnique = !response?.responseMessages[0]

    if (isNameUnique) {
      const stepPrevData = {
        name: values.name,
        identifier: values.identifier,
        description: values.description
      }
      const tagsArray = Object.keys(values.tags || {})
      set(stepPrevData, 'tags', tagsArray)
      props?.nextStep?.(stepPrevData)
    } else {
      formikActions.setFieldError('name', getString('delegates.delegateNameNotUnique'))
    }
  }

  const onSubmit = (values: DockerDelegateWizardData, formikActions: FormikActions<DockerDelegateWizardData>) => {
    setInitValues(values)
    validateName(values, formikActions)
  }

  return (
    <Layout.Vertical padding="xxlarge">
      <Container padding="small">
        <Formik
          initialValues={formData}
          onSubmit={onSubmit}
          formName="delegateSetupStepForm"
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .trim()
              .required(getString('delegate.delegateNameRequired'))
              .matches(delegateNameRegex, getString('delegates.delegateNameRegexIssue'))
          })}
        >
          {() => {
            return (
              <FormikForm>
                <Container className={css.delegateForm}>
                  <Layout.Horizontal className={css.baseContainer}>
                    <Layout.Vertical className={css.leftPanel}>
                      <div className={css.formGroup}>
                        <AddDescriptionAndKVTagsWithIdentifier
                          forceOpenTags
                          identifierProps={{
                            inputLabel: getString('delegate.delegateName')
                          }}
                        />
                      </div>
                    </Layout.Vertical>
                    <Layout.Vertical className={css.rightPanel} />
                  </Layout.Horizontal>
                </Container>
                <Layout.Horizontal>
                  <Button
                    id="delegateSetupBackBtn"
                    intent="none"
                    text={getString('back')}
                    onClick={props.onBack}
                    icon="chevron-left"
                    margin={{ right: 'small' }}
                  />
                  <Button type="submit" intent="primary" text={getString('continue')} rightIcon="chevron-right" />
                </Layout.Horizontal>
              </FormikForm>
            )
          }}
        </Formik>
      </Container>
    </Layout.Vertical>
  )
}

export default Step1Setup
