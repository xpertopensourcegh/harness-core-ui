import React, { useState } from 'react'
import {
  Formik,
  FormikForm as Form,
  FormInput,
  Button,
  Text,
  Layout,
  StepProps,
  Container
} from '@wings-software/uikit'
import * as Yup from 'yup'
import { illegalIdentifiers } from 'framework/utils/StringUtils'

import i18n from 'modules/common/pages/ProjectsPage/ProjectsPage.i18n'
import ProjectCard from 'modules/common/pages/ProjectsPage/views/ProjectCard/ProjectCard'

// import { useGetOrganizations } from 'services/cd-ng'
import type { ProjectDTO } from 'services/cd-ng'

interface ProjectModalData {
  data: ProjectDTO | undefined
}

interface StepTwoData extends ProjectDTO {
  preview?: boolean
  skipCollab?: 'skip' | ''
}

// interface SelectOption {
//   label: string
//   value: string
// }

const StepTwo: React.FC<StepProps<ProjectDTO> & ProjectModalData> = props => {
  const { previousStep, nextStep, prevStepData, gotoStep, data: projectData } = props
  const [showPreview, setShowPreview] = useState<boolean>(false)
  // const { loading, data } = useGetOrganizations({})

  // const organisations: SelectOption[] =
  //   data?.content?.map(org => {
  //     return {
  //       label: org.name || '',
  //       value: org.id || ''
  //     }
  //   }) || []

  return (
    <>
      <Text font="medium">{i18n.newProjectWizard.stepTwo.name}</Text>
      <Formik
        initialValues={{
          color: '',
          identifier: '',
          name: '',
          description: '',
          tags: [],
          skipCollab: '',
          ...projectData,
          ...prevStepData
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required(),
          identifier: Yup.string()
            .trim()
            .required()
            .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, 'Identifier can only contain alphanumerics, _ and $')
            .notOneOf(illegalIdentifiers),
          color: Yup.string().required('required')
          // orgId: Yup.string().required()
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
            <Layout.Horizontal padding={{ top: 'xlarge' }}>
              <Container width="50%">
                <input type="hidden" name="skipCollab" />
                <FormInput.InputWithIdentifier />
                {/* <Layout.Horizontal spacing="small"> */}
                <FormInput.ColorPicker
                  label={i18n.newProjectWizard.stepTwo.color}
                  name="color"
                  height={38}
                  color={formikProps.initialValues.color}
                />
                {/* <FormInput.Select
                        label={i18n.newProjectWizard.stepTwo.org}
                        name="orgId"
                        items={organisations}
                        disabled={loading}
                      /> */}
                {/* </Layout.Horizontal> */}
                <FormInput.TextArea label={i18n.newProjectWizard.stepTwo.desc} name="description" />
                <FormInput.TagInput
                  name="tags"
                  label={i18n.newProjectWizard.stepTwo.tags}
                  items={[]}
                  labelFor={name => name as string}
                  itemFromNewTag={newTag => newTag}
                  tagInputProps={{
                    showClearAllButton: true,
                    allowNewTag: true,
                    placeholder: i18n.newProjectWizard.stepTwo.addTags
                  }}
                />
                {showPreview ? (
                  <Button
                    minimal
                    onClick={() => {
                      setShowPreview(false)
                    }}
                    text={i18n.newProjectWizard.stepTwo.closePreview}
                  />
                ) : (
                  <Button
                    minimal
                    onClick={() => {
                      setShowPreview(true)
                    }}
                    text={i18n.newProjectWizard.stepTwo.previewProjectCard}
                  />
                )}
              </Container>
              <Container width="50%">
                {showPreview ? (
                  <Layout.Vertical spacing="large" padding={{ top: 'large', left: 'huge' }}>
                    <ProjectCard data={formikProps.values} isPreview={true} />
                  </Layout.Vertical>
                ) : null}
              </Container>
            </Layout.Horizontal>
            <Layout.Horizontal>
              <Container width="50%">
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
              </Container>
              <Container width="50%">
                <Layout.Horizontal padding={{ top: 'large' }} style={{ justifyContent: 'flex-end' }}>
                  <Button
                    text={i18n.newProjectWizard.stepTwo.addCollab.toUpperCase()}
                    onClick={async () => {
                      formikProps.setFieldValue('skipCollab', '')
                      formikProps.submitForm()
                    }}
                  />
                </Layout.Horizontal>
              </Container>
            </Layout.Horizontal>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default StepTwo
