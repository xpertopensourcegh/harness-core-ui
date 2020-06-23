import React from 'react'
import { Formik, FormikForm as Form, FormInput, Button, Text, Layout, StepProps } from '@wings-software/uikit'
import * as Yup from 'yup'
import { illegalIdentifiers } from 'framework/utils/StringUtils'

import type { SharedData } from '../ProjectsPage'
import i18n from '../ProjectsPage.i18n'
import ProjectCard from './ProjectCard/ProjectCard'

import { useGetOrganizations } from 'services/cd-ng'
import type { ProjectDTO } from 'services/cd-ng'

import css from './Steps.module.scss'

export interface StepTwoData extends ProjectDTO {
  preview?: boolean
  skipCollab?: 'skip' | ''
}

export interface SelectOption {
  label: string
  value: string
}

const StepTwo: React.FC<StepProps<SharedData>> = ({ previousStep, nextStep, prevStepData, gotoStep }) => {
  const { loading, data } = useGetOrganizations({})

  const organisations: SelectOption[] =
    data?.content?.map(org => {
      return {
        label: org.name || '',
        value: org.id || ''
      }
    }) || []

  return (
    <>
      <Text font="medium">{i18n.newProject}</Text>
      <Formik
        initialValues={{
          color: '',
          identifier: '',
          name: '',
          description: '',
          tags: [],
          orgId: '',
          preview: true,
          skipCollab: '',
          ...prevStepData
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required(),
          identifier: Yup.string()
            .trim()
            .required()
            .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, 'Identifier can only contain alphanumerics, _ and $')
            .notOneOf(illegalIdentifiers),
          color: Yup.string().required('required'),
          orgId: Yup.string().required()
        })}
        onSubmit={(values: StepTwoData) => {
          if (values.skipCollab === 'skip') {
            gotoStep?.(4, { ...prevStepData, ...values })
          } else {
            nextStep?.({ ...prevStepData, ...values })
          }
        }}
      >
        {formikProps => (
          <Form>
            <table>
              <tbody>
                <tr>
                  <td className={css.halfWidth}>
                    <input type="hidden" name="skipCollab" />
                    <FormInput.InputWithIdentifier />
                    <Layout.Horizontal spacing="small">
                      <FormInput.ColorPicker label={i18n.newProjectWizard.stepTwo.color} name="color" height={38} />
                      <FormInput.Select
                        label={i18n.newProjectWizard.stepTwo.org}
                        name="orgId"
                        items={organisations}
                        disabled={loading}
                      />
                    </Layout.Horizontal>
                    <FormInput.TextArea label={i18n.newProjectWizard.stepTwo.desc} name="description" />
                    <FormInput.TagInput
                      name="tags"
                      label={i18n.newProjectWizard.stepTwo.tags}
                      // TODO: replace with api response
                      items={['apac', 'emea', 'test']}
                      labelFor={name => name as string}
                      itemFromNewTag={newTag => newTag}
                      tagInputProps={{
                        showClearAllButton: true,
                        allowNewTag: true,
                        placeholder: i18n.newProjectWizard.stepTwo.addTags
                      }}
                    />
                    <FormInput.CheckBox
                      name="preview"
                      label={i18n.newProjectWizard.stepTwo.previewProjectCard}
                      style={{ margin: 'var(--spacing-xlarge) var(--spacing-medium)' }}
                    />
                  </td>

                  <td className={css.halfWidth}>
                    {formikProps.values.preview ? (
                      <Layout.Vertical spacing="large" padding={{ top: 'large', left: 'huge' }}>
                        <ProjectCard data={formikProps.values} isPreview={true} />
                        <Text font="small">{i18n.newProjectWizard.stepTwo.previewSubtitle}</Text>
                      </Layout.Vertical>
                    ) : null}
                  </td>
                </tr>
                <tr>
                  <td>
                    <Layout.Horizontal spacing="small" padding={{ top: 'large' }}>
                      <Button onClick={() => previousStep?.(prevStepData)} text={i18n.newProjectWizard.back} />
                      <Button
                        intent="primary"
                        text={i18n.newProjectWizard.saveAndClose}
                        onClick={async () => {
                          formikProps.setFieldValue('skipCollab', 'skip')
                          formikProps.submitForm()
                        }}
                      />
                    </Layout.Horizontal>
                  </td>
                  <td>
                    <Layout.Horizontal
                      spacing="small"
                      padding={{ top: 'large' }}
                      style={{ justifyContent: 'flex-end' }}
                    >
                      <Button
                        text={i18n.newProjectWizard.stepTwo.addCollab.toUpperCase()}
                        onClick={async () => {
                          formikProps.setFieldValue('skipCollab', '')
                          formikProps.submitForm()
                        }}
                      />
                    </Layout.Horizontal>
                  </td>
                </tr>
              </tbody>
            </table>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default StepTwo
