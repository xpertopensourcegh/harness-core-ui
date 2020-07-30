import React, { useState } from 'react'

import { Formik, FormikForm as Form, FormInput, Button, Text, Layout, StepProps } from '@wings-software/uikit'

import type { ProjectDTO } from 'services/cd-ng'
import i18n from 'modules/common/pages/ProjectsPage/ProjectsPage.i18n'
import EmailPreview from './EmailPreview/EmailPreview'

import css from './Steps.module.scss'

interface ProjectModalData {
  data: ProjectDTO | undefined
}

export interface CollaboratorsData {
  collaborators?: string[]
  invitationMessage?: string
}

const Collaborators: React.FC<StepProps<ProjectDTO> & ProjectModalData> = props => {
  const { previousStep, nextStep, prevStepData } = props
  const [data, setData] = useState<CollaboratorsData>({})

  return (
    <>
      <Text font="medium">{i18n.newProjectWizard.Collaborators.name}</Text>
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
                        label={i18n.newProjectWizard.Collaborators.addCollab}
                        name="collaborators"
                        // TODO: replace with api response
                        items={['Peter', 'Tony', 'Bruce']}
                        labelFor={name => name as string}
                        itemFromNewTag={newTag => newTag}
                        tagInputProps={{}}
                      />
                      <FormInput.TextArea
                        label={i18n.newProjectWizard.Collaborators.invitationMsg}
                        name="invitationMessage"
                      />
                      <Layout.Horizontal spacing="small">
                        <Button onClick={() => previousStep?.(prevStepData)} text={i18n.newProjectWizard.back} />
                        <Button
                          type="submit"
                          style={{ color: 'var(--blue-500)' }}
                          text={i18n.newProjectWizard.saveAndContinue}
                        />
                      </Layout.Horizontal>
                    </Layout.Vertical>
                  </Form>
                )}
              </Formik>
            </td>
            <td style={{ width: '50%' }}>
              <Text>{i18n.newProjectWizard.Collaborators.preview}</Text>
              <EmailPreview data={data} />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}
export default Collaborators
