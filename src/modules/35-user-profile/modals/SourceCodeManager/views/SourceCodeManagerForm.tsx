import React, { useState } from 'react'
import {
  Button,
  Color,
  Formik,
  FormikForm as Form,
  Layout,
  Text,
  FormInput,
  CardSelect,
  CardBody,
  IconName,
  Container,
  SelectOption,
  ModalErrorHandler,
  ModalErrorHandlerBinding
} from '@wings-software/uicore'
import * as Yup from 'yup'
import { useStrings } from 'framework/exports'
import { regexName } from '@common/utils/StringUtils'
import type { SecretReference } from '@secrets/components/CreateOrSelectSecret/CreateOrSelectSecret'
import { TextReferenceInterface, ValueType } from '@secrets/components/TextReference/TextReference'
import { SourceCodeManagerDTO, useSaveSourceCodeManagers } from 'services/cd-ng'
import { SourceCodeTypes } from '@user-profile/utils/utils'
import Authentication, { AuthTypes } from './Authentication'
import css from '../useSourceCodeManager.module.scss'

interface SourceCodeManagerProps {
  onSubmit: () => void
  onClose: () => void
}

export interface SCMData {
  name: string
  authType?: AuthTypes
  username?: TextReferenceInterface
  password?: SecretReference
  sshKey?: SecretReference
}
interface SourceCodeType {
  text: string
  value: SourceCodeTypes
  icon: IconName
}

enum ConnectionType {
  HTTP = 'Http',
  SSH = 'Ssh'
}

const SourceCodeManagerForm: React.FC<SourceCodeManagerProps> = props => {
  const { onSubmit, onClose } = props
  const { getString } = useStrings()
  const [selected, setSelected] = useState<SourceCodeType>()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding>()

  const { mutate: saveSourceCodeManager } = useSaveSourceCodeManagers({})

  const sourceCodeManagers: SourceCodeType[] = [
    { text: getString('repo-provider.githubLabel'), value: SourceCodeTypes.GITHUB, icon: 'github' },
    {
      text: getString('repo-provider.bitbucketLabel'),
      value: SourceCodeTypes.BITBUCKET,
      icon: 'bitbucket-blue'
    },
    { text: getString('repo-provider.gitlabLabel'), value: SourceCodeTypes.GITLAB, icon: 'service-gotlab' },
    {
      text: getString('repo-provider.awscodecommit'),
      value: SourceCodeTypes.AWS_CODECOMMIT,
      icon: 'service-aws-code-deploy'
    }
  ]

  const getDefaultSelected = (type?: SourceCodeTypes): AuthTypes | undefined => {
    switch (type) {
      case SourceCodeTypes.BITBUCKET:
        return AuthTypes.USERNAME_PASSWORD
      default:
        return undefined
    }
  }

  const getAuthOptions = (type: SourceCodeTypes): SelectOption[] => {
    switch (type) {
      case SourceCodeTypes.BITBUCKET:
        return [
          {
            label: getString('usernamePassword'),
            value: AuthTypes.USERNAME_PASSWORD
          },
          {
            label: getString('SSH_KEY'),
            value: AuthTypes.SSH_KEY
          }
        ]
      default:
        return []
    }
  }

  const handleSubmit = async (values: SCMData): Promise<void> => {
    if (selected?.value === SourceCodeTypes.BITBUCKET) {
      const dataToSubmit = {
        type: SourceCodeTypes.BITBUCKET,
        name: values.name,
        authentication: {
          ...(values.authType === AuthTypes.USERNAME_PASSWORD
            ? {
                type: ConnectionType.HTTP,
                spec: {
                  type: AuthTypes.USERNAME_PASSWORD,
                  spec: {
                    ...(values.username?.type === ValueType.TEXT
                      ? { username: values.username.value }
                      : { usernameRef: values.username?.value }),
                    passwordRef: values.password?.referenceString
                  }
                }
              }
            : {
                type: ConnectionType.SSH,
                spec: {
                  sshKeyRef: values.sshKey
                }
              })
        }
      }
      try {
        const saved = await saveSourceCodeManager(dataToSubmit as SourceCodeManagerDTO)
        if (saved) {
          onSubmit()
        }
      } catch (e) {
        modalErrorHandler?.showDanger(e.data?.message || e.message)
      }
    }
  }

  return (
    <Layout.Vertical padding="xxxlarge">
      <Layout.Vertical spacing="large">
        <Text color={Color.BLACK} font="medium">
          {getString('userProfile.addSCM')}
        </Text>
        <Formik<SCMData>
          initialValues={{
            name: ''
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .trim()
              .required(getString('validation.nameRequired'))
              .matches(regexName, getString('formValidation.name')),
            username: Yup.string().when(['authType'], {
              is: AuthTypes.USERNAME_PASSWORD,
              then: Yup.string().trim().required(getString('validation.username')),
              otherwise: Yup.string().nullable()
            }),
            password: Yup.object().when(['authType'], {
              is: AuthTypes.USERNAME_PASSWORD,
              then: Yup.object().required(getString('validation.password')),
              otherwise: Yup.object().nullable()
            }),
            sshKey: Yup.object().when(['authType'], {
              is: AuthTypes.SSH_KEY,
              then: Yup.object().required(getString('validation.sshKey')),
              otherwise: Yup.object().nullable()
            })
          })}
          onSubmit={values => {
            handleSubmit(values)
          }}
        >
          {formikProps => {
            return (
              <Form>
                <Layout.Vertical spacing="medium">
                  <ModalErrorHandler bind={setModalErrorHandler} />
                  <Container width={300}>
                    <FormInput.Text name="name" label={getString('name')} />
                  </Container>
                  <Text color={Color.BLACK}>{getString('userProfile.selectSCM')}</Text>
                  <Layout.Horizontal spacing="medium" flex={{ alignItems: 'center', justifyContent: 'flex-start' }}>
                    <CardSelect
                      data={selected ? [selected] : sourceCodeManagers}
                      cornerSelected={true}
                      className={css.cardRow}
                      cardClassName={css.card}
                      renderItem={(item, selectedItem) => (
                        <CardBody.Icon icon={item.icon} iconSize={25}>
                          <Text
                            font={{
                              size: 'small',
                              align: 'center'
                            }}
                            flex={{ justifyContent: 'center' }}
                            color={selectedItem ? Color.GREY_900 : Color.GREY_350}
                          >
                            {item.text}
                          </Text>
                        </CardBody.Icon>
                      )}
                      onChange={value => {
                        setSelected(value)
                        formikProps.setFieldValue('authType', getDefaultSelected(value.value))
                      }}
                      selected={selected}
                    />
                    {selected ? (
                      <Button
                        text={getString('change')}
                        minimal
                        intent="primary"
                        onClick={() => {
                          setSelected(undefined)
                        }}
                      />
                    ) : null}
                  </Layout.Horizontal>
                </Layout.Vertical>
                {selected ? (
                  <Authentication formikProps={formikProps} authOptions={getAuthOptions(selected.value)} />
                ) : null}
                <Layout.Horizontal spacing="small" padding={{ top: 'huge' }}>
                  <Button intent="primary" text={getString('add')} type="submit" />
                  <Button text={getString('cancel')} onClick={onClose} />
                </Layout.Horizontal>
              </Form>
            )
          }}
        </Formik>
      </Layout.Vertical>
    </Layout.Vertical>
  )
}

export default SourceCodeManagerForm
