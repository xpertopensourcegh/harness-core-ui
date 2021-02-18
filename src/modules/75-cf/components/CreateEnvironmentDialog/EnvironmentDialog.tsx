import React from 'react'
import { useParams } from 'react-router-dom'
import { get } from 'lodash-es'
import { Dialog, Spinner } from '@blueprintjs/core'
import {
  Button,
  Layout,
  useModalHook,
  Text,
  Formik,
  FormInput,
  Collapse,
  IconName,
  Color,
  CardSelect,
  Container
} from '@wings-software/uicore'
import { useCreateEnvironment } from 'services/cd-ng'
import { useToaster } from '@common/exports'
import { useEnvStrings } from '@cf/hooks/environment'
import css from './EnvironmentDialog.module.scss'

const collapseProps = {
  collapsedIcon: 'plus' as IconName,
  expandedIcon: 'minus' as IconName,
  isOpen: false,
  isRemovable: false
}

interface EnvironmentDialogProps {
  disabled?: boolean
  onCreate: () => void
}

const PRODUCTION = 'Production'
const PREPRODUCTION = 'PreProduction'
type EnvironmentType = typeof PRODUCTION | typeof PREPRODUCTION
interface EnvironmentValues {
  name: string
  identifier: string
  description: string
  tags: string[]
  type: EnvironmentType
}

const identity = (x: any) => x as string

const EnvironmentDialog: React.FC<EnvironmentDialogProps> = ({ disabled, onCreate }) => {
  const { showError } = useToaster()
  const { getString, getEnvString } = useEnvStrings()
  const { accountId, orgIdentifier, projectIdentifier } = useParams<Record<string, string>>()
  const { mutate: createEnv, loading } = useCreateEnvironment({
    queryParams: {
      accountId
    }
  })

  const envTypes = [
    {
      text: getString('production'),
      value: PRODUCTION
    },
    {
      text: getString('nonProduction'),
      value: PREPRODUCTION
    }
  ]

  const getTypeOption = (v: string) => envTypes.find(x => x.value === v) || envTypes[0]

  const initialValues: EnvironmentValues = {
    name: '',
    identifier: '',
    description: '',
    type: PREPRODUCTION,
    tags: []
  }

  const handleSubmit = (values: EnvironmentValues) => {
    createEnv({
      name: values.name,
      identifier: values.identifier,
      description: values.description,
      projectIdentifier,
      orgIdentifier,
      type: values.type,
      tags: values.tags.length > 0 ? values.tags.reduce((acc, next) => ({ ...acc, [next]: next }), {}) : {}
    })
      .then(hideModal)
      .then(onCreate)
      .catch(error => showError(get(error, 'data.error', error?.message)))
  }

  const [openModal, hideModal] = useModalHook(() => {
    return (
      <Dialog isOpen onClose={hideModal} className={css.dialog}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} onReset={hideModal}>
          {formikProps => {
            return (
              <Container
                padding={{ top: 'xxxlarge', left: 'xxxlarge', bottom: 'xxxlarge' }}
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <Text font={{ size: 'medium', weight: 'bold' }} color={Color.BLACK}>
                  {getEnvString('create.title')}
                </Text>
                <Text margin={{ top: 'xxlarge', bottom: 'xxlarge' }}>{getEnvString('create.description')}</Text>
                <Layout.Horizontal style={{ alignItems: 'flex-start', justifyContent: 'flex-start', flex: '1' }}>
                  <Container height="100%" style={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
                    <FormInput.InputWithIdentifier
                      inputName="name"
                      idName="identifier"
                      isIdentifierEditable
                      inputLabel={getEnvString('create.nameLabel')}
                    />
                    <Layout.Vertical spacing="small" style={{ margin: 'auto 0' }}>
                      <Text font={{ size: 'normal' }}>{getEnvString('create.envTypeLabel')}</Text>
                      <CardSelect
                        cornerSelected
                        data={envTypes}
                        selected={getTypeOption(formikProps.values.type)}
                        className={css.cardSelect}
                        onChange={nextValue => formikProps.setFieldValue('type', nextValue.value)}
                        renderItem={cardData => (
                          <Container
                            flex={{ align: 'center-center', distribution: 'space-between' }}
                            className="cardBody"
                          >
                            {cardData.text}
                          </Container>
                        )}
                      />
                    </Layout.Vertical>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        marginTop: 'auto'
                      }}
                    >
                      <Button
                        text={getString('createSecretYAML.create')}
                        onClick={() => formikProps.handleSubmit()}
                        intent="primary"
                        disabled={loading}
                      />
                      <Button text={getString('cancel')} onClick={() => formikProps.handleReset()} minimal />
                      {loading && <Spinner size={16} />}
                    </div>
                  </Container>
                  <Layout.Vertical
                    padding={{ left: 'medium', top: 'medium' }}
                    style={{
                      height: '100%',
                      width: '30%'
                    }}
                  >
                    <div className={css.collapse}>
                      <Collapse
                        {...collapseProps}
                        heading={getString('description')}
                        collapseHeaderClassName={css.collapseHeaderFix}
                      >
                        <FormInput.TextArea name="description" />
                      </Collapse>
                    </div>
                    <div className={css.collapse}>
                      <Collapse
                        {...collapseProps}
                        heading={getString('tagsLabel')}
                        collapseHeaderClassName={css.collapseHeaderFix}
                      >
                        <FormInput.TagInput
                          name="tags"
                          label=""
                          items={[]}
                          labelFor={identity}
                          itemFromNewTag={identity}
                          tagInputProps={{
                            showClearAllButton: true,
                            allowNewTag: true,
                            placeholder: 'Tags'
                          }}
                        />
                      </Collapse>
                    </div>
                  </Layout.Vertical>
                </Layout.Horizontal>
              </Container>
            )
          }}
        </Formik>
      </Dialog>
    )
  }, [loading])

  return (
    <Button
      disabled={disabled}
      onClick={openModal}
      text={`+ ${getString('environment')}`}
      intent="primary"
      padding={{
        top: 'small',
        bottom: 'small',
        left: 'huge',
        right: 'huge'
      }}
    />
  )
}

export default EnvironmentDialog
