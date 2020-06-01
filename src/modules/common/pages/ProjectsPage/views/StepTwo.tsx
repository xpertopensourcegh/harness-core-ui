import React, { useState } from 'react'
import { Formik, FormikForm as Form, FormInput, Button, Text, Layout, StepProps } from '@wings-software/uikit'
import * as Yup from 'yup'
import cx from 'classnames'

import type { SharedData } from '../ProjectsPage'
import i18n from '../ProjectsPage.i18n'
import ProjectCard from './ProjectCard/ProjectCard'
// import type { ProjectDTO } from '@wings-software/swagger-ts/definitions'
// TODO replace with actual type from swagger
import type { ProjectDTO } from './ProjectCard/ProjectCard'

import css from './Step.module.scss'

export type StepTwoData = ProjectDTO

export interface SelectOption {
  label: string
  value: string
}

const colors: SelectOption[] = [
  {
    label: 'Blue',
    value: 'blue'
  },
  {
    label: 'Red',
    value: 'red'
  }
]

const organisations: SelectOption[] = [
  {
    label: 'Harness',
    value: 'harness'
  },
  {
    label: 'Wings',
    value: 'wings'
  }
]

const StepTwo: React.FC<StepProps<SharedData>> = ({ previousStep, nextStep, prevStepData }) => {
  const [data, setData] = useState<StepTwoData>()
  return (
    <table style={{ margin: 'var(--spacing-xxxlarge) 0' }}>
      <tbody>
        <tr>
          <td className={cx(css.halfWidth, css.leftCol)}>
            <Text font="medium" style={{ padding: 'var(--spacing-large), 0', marginBottom: 'var(--spacing-xxlarge' }}>
              {i18n.newProject}
            </Text>
            <Formik
              initialValues={{
                color: colors[0].value,
                name: '',
                description: '',
                tags: [],
                orgId: organisations[0].value
              }}
              validate={(values: StepTwoData) => {
                setData(values)
              }}
              validationSchema={Yup.object().shape({
                name: Yup.string().trim().required(),
                orgId: Yup.string().required()
              })}
              onSubmit={(values: StepTwoData) => {
                nextStep?.({ ...prevStepData, ...values })
              }}
            >
              {() => (
                <Form>
                  <FormInput.Text label={i18n.newProjectWizard.stepTwo.projectName} name="name" />
                  <Layout.Horizontal spacing="small">
                    <FormInput.Select label={i18n.newProjectWizard.stepTwo.color} name="color" items={colors} />
                    <FormInput.Select label={i18n.newProjectWizard.stepTwo.org} name="orgId" items={organisations} />
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
                  <Layout.Horizontal spacing="small">
                    <Button onClick={() => previousStep?.(prevStepData)} text={i18n.newProjectWizard.back} />
                    <Button type="submit" style={{ color: 'var(--blue-500)' }} text={i18n.newProjectWizard.next} />
                  </Layout.Horizontal>
                </Form>
              )}
            </Formik>
          </td>
          <td className={cx(css.halfWidth, css.rightCol)}>
            <Layout.Vertical>
              <Text font="small" style={{ margin: 'var(--spacing-small) 0 var(--spacing-xxlarge) 0' }}>
                {i18n.newProjectWizard.stepTwo.preview}
              </Text>
              <ProjectCard data={data} isPreview={true} />
              <br />
              <Text>{i18n.newProjectWizard.stepTwo.previewSubtitle}</Text>
            </Layout.Vertical>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default StepTwo
