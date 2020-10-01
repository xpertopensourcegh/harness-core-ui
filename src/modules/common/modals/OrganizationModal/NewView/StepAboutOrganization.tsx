import React, { useState } from 'react'
import * as Yup from 'yup'

import {
  Button,
  Color,
  Container,
  Formik,
  FormikForm as Form,
  FormInput,
  Collapse,
  Heading,
  IconName,
  Layout,
  StepProps,
  ModalErrorHandlerBinding,
  ModalErrorHandler
} from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import { illegalIdentifiers } from 'modules/common/utils/StringUtils'
import { useAppStoreReader, useAppStoreWriter } from 'framework/exports'
import { OrganizationCard } from 'modules/common/components/OrganizationCard/OrganizationCard'
import { useToaster } from 'modules/common/components/Toaster/useToaster'
import { usePostOrganization, usePutOrganization } from 'services/cd-ng'
import type { Organization } from 'services/cd-ng'
import type { OrganizationModalInteraction } from '../OrganizationModalUtils'

import i18n from './StepAboutOrganization.i18n'
import css from './Steps.module.scss'

const collapseProps = {
  collapsedIcon: 'small-plus' as IconName,
  expandedIcon: 'small-minus' as IconName,
  isRemovable: false,
  className: 'collapse'
}

const descriptionCollapseProps = Object.assign({}, collapseProps, { heading: i18n.form.description })
const tagCollapseProps = Object.assign({}, collapseProps, { heading: i18n.form.tags })

export const StepAboutOrganization: React.FC<StepProps<Organization> & OrganizationModalInteraction> = props => {
  const { backToSelections, onSuccess, edit, data } = props
  const { accountId } = useParams()
  const { organisationsMap } = useAppStoreReader()
  const updateAppStore = useAppStoreWriter()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding>()
  const [showPreview, setShowPreview] = useState<boolean>(true)
  const { showSuccess } = useToaster()
  const [org, setOrg] = useState<Organization>(
    (edit && data) || {
      color: '',
      name: '',
      description: '',
      tags: [],
      identifier: ''
    }
  )
  const { mutate: createOrganization, loading: createLoading } = usePostOrganization({
    queryParams: { accountIdentifier: accountId }
  })
  const { mutate: updateOrganization, loading: updateLoading } = usePutOrganization({
    identifier: org.identifier || '',
    queryParams: {
      accountIdentifier: accountId
    }
  })

  const getErrorMessage = (errors: any): string => {
    const message: string[] = errors.map((error: any) => {
      return error.error
    })
    return message.toString()
  }

  const persistOrg = async (values: Organization): Promise<void> => {
    const dataToSubmit: Organization = {
      name: values.name,
      color: values.color,
      description: values.description,
      identifier: values.identifier,
      tags: values.tags
    }
    if (values.color == '') delete dataToSubmit.color
    try {
      if (edit) {
        await updateOrganization(dataToSubmit)
        showSuccess(i18n.form.editSuccess)
      } else {
        await createOrganization(dataToSubmit)
        showSuccess(i18n.form.createSuccess)
      }
      updateAppStore({ organisationsMap: organisationsMap.set(values.identifier || '', values) })
      onSuccess?.()
    } catch (error) {
      modalErrorHandler?.showDanger(error.data.message || getErrorMessage(error.data.errors))
    }
  }

  return (
    <Formik
      initialValues={org}
      validationSchema={Yup.object().shape({
        name: Yup.string().trim().required(i18n.form.errorName),
        identifier: Yup.string().when('name', {
          is: val => val?.length,
          then: Yup.string()
            .required(i18n.form.errorIdentifier)
            .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, i18n.form.validationIdentifierChars)
            .notOneOf(illegalIdentifiers)
        })
      })}
      validate={setOrg}
      onSubmit={(values: Organization) => {
        persistOrg(values)
      }}
    >
      {formikProps => (
        <Form>
          <ModalErrorHandler bind={setModalErrorHandler} />
          <Layout.Horizontal>
            <Layout.Vertical width="50%" padding="xxlarge">
              <Container style={{ minHeight: '450px' }}>
                <Heading level={2} color={Color.GREY_800} margin={{ bottom: 'xxlarge' }}>
                  {i18n.aboutTitle}
                </Heading>
                <FormInput.InputWithIdentifier inputLabel={i18n.form.name} isIdentifierEditable={!edit} />
                <FormInput.ColorPicker label={i18n.form.color} name="color" height={38} color={org?.color} />
                <div className={css.collapseDiv}>
                  <Collapse isOpen={formikProps.values.description === '' ? false : true} {...descriptionCollapseProps}>
                    <FormInput.TextArea name="description" className={css.desc} />
                  </Collapse>
                </div>
                <div className={css.collapseDiv}>
                  <Collapse isOpen={formikProps.values.tags?.length ? true : false} {...tagCollapseProps}>
                    <FormInput.TagInput
                      name="tags"
                      items={[]}
                      className={css.desc}
                      labelFor={name => name as string}
                      itemFromNewTag={newTag => newTag}
                      tagInputProps={{
                        showClearAllButton: true,
                        allowNewTag: true,
                        placeholder: i18n.form.addTag
                      }}
                    />
                  </Collapse>
                </div>
                <Button
                  minimal
                  onClick={() => {
                    showPreview ? setShowPreview(false) : setShowPreview(true)
                  }}
                  text={showPreview ? i18n.form.closePreview : i18n.form.preview}
                  margin={{ top: 'large' }}
                />
              </Container>
              <Layout.Horizontal spacing="xsmall">
                {!edit && <Button onClick={backToSelections} text={i18n.form.back} className={css.button} />}
                <Button
                  type="submit"
                  className={css.button}
                  text={i18n.form.save}
                  disabled={updateLoading || createLoading}
                />
              </Layout.Horizontal>
            </Layout.Vertical>
            <Container width="50%" flex={{ align: 'center-center' }} className={css.preview}>
              {showPreview ? <OrganizationCard data={org} isPreview /> : null}
            </Container>
          </Layout.Horizontal>
        </Form>
      )}
    </Formik>
  )
}
