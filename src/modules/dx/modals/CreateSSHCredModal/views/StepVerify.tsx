import React, { useState } from 'react'
import { StepProps, Container, Text, Formik, Color, FormikForm, FormInput, Button } from '@wings-software/uikit'
import { pick } from 'lodash-es'

import type { SSHKeyValidationMetadata as ValidationMetadata } from 'services/cd-ng'

import VerifySecret, { Status } from './VerifySecret'
import type { SSHCredSharedObj } from '../useCreateSSHCredModal'

import i18n from '../CreateSSHCredModal.i18n'

interface StepVerifyProps {
  closeModal: () => void
}

const StepVerify: React.FC<StepProps<SSHCredSharedObj> & StepVerifyProps> = ({ prevStepData, closeModal }) => {
  const [validationMetadata, setValidationMetadata] = useState<ValidationMetadata>()
  const [finishStatus, setFinishStatus] = useState<Status | undefined>()

  return (
    <Container padding="small" height={500}>
      <Text margin={{ bottom: 'xlarge' }} font={{ size: 'medium' }} color={Color.BLACK}>
        {i18n.stepTitleVerify}
      </Text>
      <Container width={300}>
        <Formik<ValidationMetadata>
          onSubmit={formData => {
            setValidationMetadata({
              type: 'SSHKey',
              host: formData.host
            })
          }}
          initialValues={{
            host: '',
            ...pick(prevStepData, 'host')
          }}
        >
          {() => {
            return (
              <FormikForm>
                <FormInput.Text name="host" label={i18n.labelHostname} disabled={!!validationMetadata} />
                <Text font={{ size: 'xsmall', weight: 'bold' }}>{i18n.hostnameInfo.toUpperCase()}</Text>
                {validationMetadata ? null : (
                  <Button
                    type="submit"
                    text={i18n.btnVerifyConnection.toUpperCase()}
                    style={{ fontSize: 'smaller' }}
                    margin={{ top: 'medium' }}
                  />
                )}
              </FormikForm>
            )
          }}
        </Formik>
      </Container>
      {validationMetadata ? (
        <Container margin={{ top: 'xxxlarge' }}>
          <VerifySecret
            identifier={prevStepData?.detailsData?.identifier as string}
            validationMetadata={validationMetadata}
            onFinish={status => {
              setFinishStatus(status)
            }}
          />
          {finishStatus ? (
            <Button
              text={i18n.verifyRetest.toUpperCase()}
              minimal
              intent="primary"
              margin={{ top: 'medium' }}
              onClick={() => {
                setValidationMetadata(undefined)
              }}
            />
          ) : null}
          <Container margin={{ top: 'large' }}>
            {finishStatus ? (
              <Button
                text={i18n.verifyFinish.toUpperCase()}
                onClick={() => {
                  closeModal()
                }}
              />
            ) : null}
          </Container>
        </Container>
      ) : null}
    </Container>
  )
}

export default StepVerify
