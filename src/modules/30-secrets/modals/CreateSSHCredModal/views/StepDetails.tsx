import React from 'react'
import { Button, Text, Color, StepProps, FormikForm, Formik, Container, Layout } from '@wings-software/uikit'
import * as Yup from 'yup'
import type { SecretDTOV2 } from 'services/cd-ng'

import { AddDescriptionAndKVTagsWithIdentifier } from '@common/components/AddDescriptionAndTags/AddDescriptionAndTags'
import { StringUtils } from '@common/exports'
import type { SSHCredSharedObj } from '../CreateSSHCredWizard'
import i18n from '../CreateSSHCredModal.i18n'
import css from './StepDetails.module.scss'

export type DetailsForm = Pick<SecretDTOV2, 'name' | 'identifier' | 'description' | 'tags'>

const StepSSHDetails: React.FC<StepProps<SSHCredSharedObj> & SSHCredSharedObj> = ({
  prevStepData,
  nextStep,
  detailsData,
  authData
}) => {
  return (
    <Container padding="small" width={350} height={500}>
      <Text margin={{ bottom: 'xlarge' }} font={{ size: 'medium' }} color={Color.BLACK}>
        {i18n.titleDetails}
      </Text>
      <Formik<DetailsForm>
        onSubmit={values => {
          nextStep?.({ ...prevStepData, detailsData: values, authData })
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required(i18n.validName),
          identifier: Yup.string().when('name', {
            is: val => val?.length,
            then: Yup.string()
              .trim()
              .required(i18n.validId)
              .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, i18n.validIdRegex)
              .notOneOf(StringUtils.illegalIdentifiers)
          })
        })}
        initialValues={{
          name: '',
          identifier: '',
          description: '',
          tags: {},
          ...(prevStepData ? prevStepData.detailsData : detailsData)
        }}
      >
        {() => {
          return (
            <FormikForm>
              <Container className={css.formData}>
                <AddDescriptionAndKVTagsWithIdentifier
                  identifierProps={{ inputName: 'name', isIdentifierEditable: detailsData ? false : true }}
                />
              </Container>
              <Layout.Horizontal>
                <Button type="submit" text={i18n.btnContinue} />
              </Layout.Horizontal>
            </FormikForm>
          )
        }}
      </Formik>
    </Container>
  )
}

export default StepSSHDetails
