import React, { useState } from 'react'

import { Formik, FormikForm as Form, FormInput, Button, Text, Layout, StepProps } from '@wings-software/uikit'

import type { ProjectDTO } from 'services/cd-ng'
import EmailPreview from './EmailPreview/EmailPreview'

import i18n from 'modules/common/pages/ProjectsPage/ProjectsPage.i18n'
import css from './Steps.module.scss'

interface ProjectModalData {
  data: ProjectDTO | undefined
}

export interface StepThreeData {
  collaborators?: string[]
  invitationMessage?: string
}

const StepThree: React.FC<StepProps<ProjectDTO> & ProjectModalData> = props => {
  const { previousStep, nextStep, prevStepData } = props
  const [data, setData] = useState<StepThreeData>({})

  return (
    <>
      <Text font="medium">{i18n.newProjectWizard.stepThree.name}</Text>
      <table style={{ width: '100%', margin: '20px 0' }}>
        <tbody>
          <tr>
            <td className={css.halfWidth}>
              <Formik
                initialValues={{ collaborators: [], invitationMessage: '' }}
                validate={values => {
                  setData(values)
                }}
                onSubmit={() => {
                  if (prevStepData) {
                    nextStep?.({ ...prevStepData })
                  }
                }}
              >
                {() => (
                  <Form>
                    <Layout.Vertical spacing="small">
                      <FormInput.TagInput
                        label={i18n.newProjectWizard.stepThree.addCollab}
                        name="collaborators"
                        // TODO: replace with api response
                        items={['Peter', 'Tony', 'Bruce']}
                        labelFor={name => name as string}
                        itemFromNewTag={newTag => newTag}
                        tagInputProps={{}}
                      />
                      <FormInput.TextArea
                        label={i18n.newProjectWizard.stepThree.invitationMsg}
                        name="invitationMessage"
                      />
                      <Layout.Horizontal spacing="small">
                        <Button onClick={() => previousStep?.(prevStepData)} text={i18n.newProjectWizard.back} />
                        <Button
                          type="submit"
                          style={{ color: 'var(--blue-500)' }}
                          text={i18n.newProjectWizard.saveAndClose}
                        />
                      </Layout.Horizontal>
                    </Layout.Vertical>
                  </Form>
                )}
              </Formik>
            </td>
            <td style={{ width: '50%' }}>
              <Text>{i18n.newProjectWizard.stepThree.preview}</Text>
              <EmailPreview data={data} />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default StepThree
