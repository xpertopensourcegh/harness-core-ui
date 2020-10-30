import React, { useState } from 'react'
import * as Yup from 'yup'
import { Button, Container, Formik, FormikForm, FormInput, Text } from '@wings-software/uikit'
import type { SSHKeyValidationMetadata as ValidationMetadata } from 'services/cd-ng'

import VerifySecret, { Status } from './VerifySecret'

import i18n from '../CreateSSHCredModal.i18n'

interface VerifyConnectionProps {
  identifier: string
  closeModal?: () => void
}

const VerifyConnection: React.FC<VerifyConnectionProps> = ({ identifier, closeModal }) => {
  const [validationMetadata, setValidationMetadata] = useState<ValidationMetadata>()
  const [finishStatus, setFinishStatus] = useState<Status | undefined>()

  return (
    <>
      <Container width={300}>
        <Formik<ValidationMetadata>
          onSubmit={formData => {
            setValidationMetadata({
              type: 'SSHKey',
              host: formData.host
            })
          }}
          initialValues={{
            host: ''
          }}
          validationSchema={Yup.object().shape({
            host: Yup.string().trim().required()
          })}
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
        <Container margin={{ top: 'xxlarge' }}>
          <VerifySecret
            identifier={identifier as string}
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
            {finishStatus && closeModal ? (
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
    </>
  )
}

export default VerifyConnection
