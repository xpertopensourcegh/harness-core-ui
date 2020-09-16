import React from 'react'
import { Button, Text, Color, StepProps, FormikForm, FormInput, Formik, Container, Layout } from '@wings-software/uikit'
import * as Yup from 'yup'
import type { SecretDTOV2 } from 'services/cd-ng'

import { illegalIdentifiers } from 'modules/common/utils/StringUtils'

import i18n from '../CreateSSHCredModal.i18n'
import type { SSHCredSharedObj } from '../useCreateSSHCredModal'

export type DetailsForm = Pick<SecretDTOV2, 'name' | 'identifier' | 'description' | 'tags'>

const StepSSHDetails: React.FC<StepProps<SSHCredSharedObj>> = ({ prevStepData, nextStep }) => {
  return (
    <Container padding="small" width={350} height={500}>
      <Text margin={{ bottom: 'xlarge' }} font={{ size: 'medium' }} color={Color.BLACK}>
        {i18n.titleDetails}
      </Text>
      <Formik<DetailsForm>
        onSubmit={values => {
          nextStep?.({ ...prevStepData, detailsData: values })
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required(i18n.validName),
          identifier: Yup.string()
            .trim()
            .required(i18n.validId)
            .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, i18n.validIdRegex)
            .notOneOf(illegalIdentifiers)
        })}
        initialValues={{
          name: '',
          identifier: '',
          description: '',
          tags: {},
          ...prevStepData?.detailsData
        }}
      >
        {() => {
          return (
            <FormikForm>
              <FormInput.InputWithIdentifier inputLabel={i18n.labelName} />
              <FormInput.TextArea name="description" label={i18n.labelDescription} />
              {/* <FormInput.TagInput
                name="tags"
                label={i18n.labelTags}
                items={[]}
                labelFor={name => name as string}
                itemFromNewTag={newTag => newTag}
                tagInputProps={{
                  showClearAllButton: true,
                  allowNewTag: true
                }}
              /> */}
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
