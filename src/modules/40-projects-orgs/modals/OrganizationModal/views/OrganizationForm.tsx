import React from 'react'
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
  ModalErrorHandlerBinding,
  ModalErrorHandler
} from '@wings-software/uikit'
import { illegalIdentifiers } from '@common/utils/StringUtils'
import { OrganizationCard } from '@projects-orgs/components/OrganizationCard/OrganizationCard'
import type { Organization } from 'services/cd-ng'
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

interface OrganizationFormData {
  data?: Organization
  title: string
  submitTitle: string
  disableSubmit: boolean
  enableEdit: boolean
  onComplete: (organization: Organization) => Promise<void>
  setModalErrorHandler: (modalErrorHandler: ModalErrorHandlerBinding) => void
}

const OrganizationForm: React.FC<OrganizationFormData> = ({
  data,
  title,
  setModalErrorHandler,
  onComplete,
  submitTitle,
  disableSubmit,
  enableEdit
}) => {
  return (
    <Formik
      initialValues={{
        identifier: '',
        name: '',
        description: '',
        tags: {},
        ...data
      }}
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
      onSubmit={(values: Organization) => {
        onComplete(values)
      }}
    >
      {formikProps => (
        <Form>
          <ModalErrorHandler bind={setModalErrorHandler} />
          <Layout.Horizontal>
            <Layout.Vertical width="50%" padding="xxlarge">
              <Container style={{ minHeight: '450px' }}>
                <Heading level={2} color={Color.GREY_800} margin={{ bottom: 'xxlarge' }}>
                  {title}
                </Heading>
                <FormInput.InputWithIdentifier inputLabel={i18n.form.name} isIdentifierEditable={enableEdit} />
                <div className={css.collapseDiv}>
                  <Collapse isOpen={formikProps.values.description === '' ? false : true} {...descriptionCollapseProps}>
                    <FormInput.TextArea name="description" className={css.desc} />
                  </Collapse>
                </div>
                <div className={css.collapseDiv}>
                  <Collapse isOpen={formikProps.values.tags?.length ? true : false} {...tagCollapseProps}>
                    <FormInput.KVTagInput name="tags" className={css.desc} />
                  </Collapse>
                </div>
              </Container>
              <Layout.Horizontal spacing="xsmall">
                <Button type="submit" className={css.button} text={submitTitle} disabled={disableSubmit} />
              </Layout.Horizontal>
            </Layout.Vertical>
            <Container width="50%" flex={{ align: 'center-center' }} className={css.preview}>
              <OrganizationCard data={formikProps.values} isPreview />
            </Container>
          </Layout.Horizontal>
        </Form>
      )}
    </Formik>
  )
}

export default OrganizationForm
