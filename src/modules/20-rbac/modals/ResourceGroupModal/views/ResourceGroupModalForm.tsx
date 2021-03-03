import React, { useState } from 'react'
import {
  Button,
  Container,
  Formik,
  FormikForm as Form,
  FormInput,
  Layout,
  ModalErrorHandler,
  ModalErrorHandlerBinding
} from '@wings-software/uicore'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'
import { pick } from 'lodash-es'
import { illegalIdentifiers, regexIdentifier } from '@common/utils/StringUtils'
import { NameIdDescriptionTags, useToaster } from '@common/components'
import {
  ResourceGroupDTO,
  useCreateResourceGroup,
  ResourceGroupRequestRequestBody,
  useUpdateResourceGroup
} from 'services/cd-ng'
import { useStrings } from 'framework/exports'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { DEFAULT_COLOR } from '@common/constants/Utils'

interface ResourceGroupModalData {
  data?: ResourceGroupDTO
  onSubmit?: () => void
  editMode: boolean
}

const ResourceGroupForm: React.FC<ResourceGroupModalData> = props => {
  const { onSubmit, data, editMode } = props
  const { accountId, orgIdentifier, projectIdentifier } = useParams<ProjectPathProps>()
  const { getString } = useStrings()
  const { showSuccess } = useToaster()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding>()
  const { mutate: createResourceGroup, loading: saving } = useCreateResourceGroup({
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier
    }
  })
  const { mutate: updateResourceGroup, loading: updating } = useUpdateResourceGroup({
    identifier: data?.identifier || '',
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier
    }
  })
  const handleSubmit = async (
    values: Pick<ResourceGroupDTO, 'name' | 'color' | 'tags' | 'description' | 'identifier'>
  ): Promise<void> => {
    const dataToSubmit: ResourceGroupRequestRequestBody = {
      resourcegroup: {
        ...pick(values, ['name', 'description', 'color', 'tags']),
        resourceSelectors: [],
        identifier: values.identifier,
        accountIdentifier: accountId,
        orgIdentifier,
        projectIdentifier
      }
    }
    try {
      if (!editMode) {
        const created = await createResourceGroup(dataToSubmit)
        if (created) {
          showSuccess(getString('resourceGroup.createSuccess'))
          onSubmit?.()
        }
      } else {
        const updated = await updateResourceGroup(dataToSubmit)
        if (updated) {
          showSuccess(getString('resourceGroup.updateSuccess'))
          onSubmit?.()
        }
      }
    } catch (e) {
      /* istanbul ignore next */
      modalErrorHandler?.showDanger(e.data?.message || e.message)
    }
  }
  return (
    <Layout.Vertical padding="xxxlarge">
      <Layout.Vertical spacing="large">
        <Formik
          initialValues={{
            identifier: '',
            name: '',
            description: '',
            tags: {},
            color: DEFAULT_COLOR,
            ...(editMode && data)
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().trim().required(),
            identifier: Yup.string().when('name', {
              is: val => val?.length,
              then: Yup.string().required().matches(regexIdentifier).notOneOf(illegalIdentifiers)
            }),
            color: Yup.string().trim().required()
          })}
          onSubmit={values => {
            handleSubmit(values)
          }}
        >
          {formikProps => {
            return (
              <Form>
                <Container>
                  <ModalErrorHandler bind={setModalErrorHandler} />
                  <NameIdDescriptionTags
                    formikProps={formikProps}
                    identifierProps={{ isIdentifierEditable: !editMode }}
                  />
                  <FormInput.ColorPicker label={getString('resourceGroup.color')} name="color" />
                </Container>
                <Layout.Horizontal>
                  <Button
                    intent="primary"
                    text={getString('filters.apply')}
                    type="submit"
                    disabled={saving || updating}
                  />
                </Layout.Horizontal>
              </Form>
            )
          }}
        </Formik>
      </Layout.Vertical>
    </Layout.Vertical>
  )
}

export default ResourceGroupForm
