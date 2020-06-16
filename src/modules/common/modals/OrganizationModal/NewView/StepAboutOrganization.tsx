import {
  Button,
  Color,
  Container,
  Formik,
  FormikForm as Form,
  FormInput,
  Heading,
  Layout,
  StepProps,
  Utils
} from '@wings-software/uikit'
import { OrganizationCard } from 'modules/common/components/OrganizationCard/OrganizationCard'
import {
  OrganizationDTO,
  CreateOrganizationDTO,
  UpdateOrganizationDTO,
  useCreate,
  useUpdateOrganization
} from 'services/cd-ng'
import React, { useState, useCallback } from 'react'
import * as Yup from 'yup'
import type { OrganizationModalInteraction } from '../OrganizationModalUtils'
import i18n from './StepAboutOrganization.i18n'
import { routeParams } from 'framework/exports'
import { pick } from 'lodash-es'

const icons = [
  { label: 'Gitlab', value: 'service-gotlab' },
  { label: 'Datadog', value: 'service-datadog' },
  { label: 'Github', value: 'service-github' },
  { label: 'GCP', value: 'service-gcp' },
  { label: 'Jenkins', value: 'service-jenkins' },
  { label: 'Slack', value: 'service-slack' },
  { label: 'Harness', value: 'harness' }
]

export const StepAboutOrganization: React.FC<StepProps<OrganizationDTO> & OrganizationModalInteraction> = ({
  nextStep,
  backToSelections,
  onSuccess,
  edit,
  data
}) => {
  const {
    params: { accountId }
  } = routeParams()
  const [org, setOrg] = useState<OrganizationDTO>(
    (edit && data) || {
      color: '',
      name: '',
      description: '',
      tags: [],
      identifier: ''
    }
  )
  const { mutate: createOrganization } = useCreate({})
  const { mutate: updateOrganization } = useUpdateOrganization({ organizationId: org.id || '' })
  const persistOrg = useCallback(async (values: OrganizationDTO) => {
    const organization: CreateOrganizationDTO = {
      accountId,
      identifier: values.identifier || Utils.randomId(), // TODO Use name field with auto-first-time-ediable identifier
      name: values.name,
      description: values.description || '',
      tags: values.tags || [],
      color: values.color || ''
    }
    try {
      if (edit) {
        await updateOrganization(pick(organization, ['name', 'color', 'description', 'tags']) as UpdateOrganizationDTO)
      } else {
        await createOrganization(organization)
      }

      onSuccess?.(organization)
    } catch (error) {
      alert(error) // TODO: Implement modal error handling
    }
  }, []) // eslint-disable-line

  return (
    <Layout.Horizontal padding={{ top: 'large', right: 'large', left: 'large' }}>
      <Container width="50%">
        <Heading level={2} color={Color.GREY_800} margin={{ bottom: 'xxlarge' }}>
          {i18n.aboutTitle}
        </Heading>
        <Formik
          initialValues={org}
          validationSchema={Yup.object().shape({
            name: Yup.string().trim().required()
          })}
          validate={values => {
            setOrg(values)
          }}
          onSubmit={(values: OrganizationDTO) => {
            persistOrg(values)
          }}
        >
          {() => (
            <Form>
              <FormInput.Text label={i18n.form.name} name="name" />
              <Layout.Horizontal spacing="small">
                <FormInput.ColorPicker label={i18n.form.color} name="color" color={org?.color} />
                <FormInput.Select label={i18n.form.icon} name="icon" items={icons} />
              </Layout.Horizontal>
              <FormInput.TextArea label={i18n.form.description} name="description" />
              <FormInput.TagInput
                name="tags"
                label={i18n.form.tags}
                items={[]}
                labelFor={name => name as string}
                itemFromNewTag={newTag => newTag}
                tagInputProps={{
                  showClearAllButton: true,
                  allowNewTag: true,
                  placeholder: i18n.form.addTag
                }}
              />
              {/* <FormInput.CheckBox name="preview" label={i18n.form.preview} checked className={css.checkbox} /> */}

              <Layout.Horizontal spacing="small" margin={{ top: 'xxxlarge' }}>
                {!edit && <Button onClick={backToSelections} text={i18n.form.back} />}
                <Button
                  type="submit"
                  style={{ color: 'var(--blue-500)', borderColor: 'var(--blue-500)' }}
                  text={i18n.form.save}
                />
              </Layout.Horizontal>
            </Form>
          )}
        </Formik>
      </Container>
      <Layout.Vertical width="50%" padding={{ top: 'xxlarge', left: 'xxlarge' }} style={{ position: 'relative' }}>
        <Heading level={4} margin={{ bottom: 'xsmall' }}>
          {i18n.preview}
        </Heading>
        <OrganizationCard data={org} isPreview />
        <Button
          minimal
          text={i18n.form.addCollaborators}
          rightIcon="chevron-right"
          onClick={() => nextStep?.(org)}
          style={{ position: 'absolute', left: '20px', bottom: 0 }}
        />
      </Layout.Vertical>
    </Layout.Horizontal>
  )
}
