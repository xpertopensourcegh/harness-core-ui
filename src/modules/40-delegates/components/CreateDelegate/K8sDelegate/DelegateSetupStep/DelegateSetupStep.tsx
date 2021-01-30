import React from 'react'
import { useParams } from 'react-router-dom'
import {
  Layout,
  Formik,
  Button,
  FormikForm,
  FormInput,
  Container,
  CardSelect,
  SelectOption,
  Text,
  StepProps,
  Tag,
  Color
} from '@wings-software/uicore'
import * as Yup from 'yup'
import {
  useGetDelegateProfilesV2,
  DelegateSizesResponse,
  useGetDelegateSizes,
  useValidateKubernetesYaml
} from 'services/portal'

import { useStrings } from 'framework/exports'
import type { DelegateProfile } from '@delegates/DelegateInterface'

import { AddDescriptionWithIdentifier } from '@common/components/AddDescriptionAndTags/AddDescriptionAndTags'
import type { DelegateYaml, StepK8Data } from '@delegates/DelegateInterface'

import css from './DelegateSetupStep.module.scss'

interface DelegateSetupStepProps {
  onBack?: any
}

const formatProfileList = (data: any): Array<SelectOption> => {
  const profiles: Array<DelegateProfile> = data?.resource?.response

  const options: Array<SelectOption> = profiles
    ? profiles.map((item: DelegateProfile) => {
        return { label: item.name || '', value: item.uuid || '' }
      })
    : [{ label: '', value: '' }]
  return options
}

const getDefaultDelegateConfiguration = (data: any) => {
  const configurations: DelegateProfile[] = data?.resource?.response
  return configurations ? configurations.find((item: DelegateProfile) => item.primary) : null
}

const filterDelegatesize = (delegateSizes: any, size: any) => {
  return delegateSizes.find((item: any) => item.size === size.value)
}

const formatDelegateSizeArr = (delegateSizes: any) => {
  if (!delegateSizes) {
    return []
  }
  return delegateSizes.map((item: any) => ({
    label: item.label,
    value: item.size
  }))
}

const getDefaultDelegateSize = (delegateSizes: DelegateSizesResponse[]) => {
  return delegateSizes ? delegateSizes.find((item: DelegateSizesResponse) => item.size === 'EXTRA_SMALL') : undefined
}

const getProfile = (data: any, configId: any) => {
  const configs: DelegateProfile[] = data?.resource?.response
  const selProfile = configs ? configs.find(item => item.uuid == configId) : null
  return selProfile?.selectors
}

const DelegateSetup: React.FC<StepProps<StepK8Data> & DelegateSetupStepProps> = props => {
  const initialValues = {
    name: '',
    identifier: '',
    description: '',
    delegateConfigurationId: '',
    size: 'EXTRA_SMALL',
    sesssionIdentifier: ''
  }
  const { accountId } = useParams()
  const { getString } = useStrings()

  const { mutate: createKubernetesYaml } = useValidateKubernetesYaml({ queryParams: { accountId } })

  const { data } = useGetDelegateProfilesV2({ queryParams: { accountId } })
  const { data: delegateSizes } = useGetDelegateSizes({
    queryParams: { accountId }
  })
  const delegateSizeMappings: DelegateSizesResponse[] | undefined = delegateSizes?.resource
  const selectCardData = formatDelegateSizeArr(delegateSizeMappings)
  const profileOptions: SelectOption[] = formatProfileList(data)
  const defaultProfile = getDefaultDelegateConfiguration(data)
  const defaultSize: DelegateSizesResponse | undefined = delegateSizeMappings
    ? getDefaultDelegateSize(delegateSizeMappings)
    : undefined

  const [selectedCard, setSelectedCard] = React.useState<SelectOption | undefined>()

  const [formData, setInitValues] = React.useState<DelegateYaml>(initialValues)

  const onSubmit = async (values: DelegateYaml) => {
    const response = await createKubernetesYaml(values)
    const delegateYaml = response.resource
    if (delegateSizeMappings) {
      const delegateSize: DelegateSizesResponse =
        delegateSizeMappings.find((item: DelegateSizesResponse) => item.size === values.size) || delegateSizeMappings[0]
      if (delegateSize) {
        const stepPrevData = {
          delegateYaml,
          replicas: delegateSize?.replicas
        }
        props?.nextStep?.(stepPrevData)
      }
    }
  }

  React.useEffect(() => {
    if (defaultSize) {
      const defaultCard: SelectOption = selectCardData.find((item: SelectOption) => item.value === defaultSize.size)
      setSelectedCard(defaultCard)
    }
  }, [defaultSize])

  React.useEffect(() => {
    if (defaultProfile) {
      formData['delegateConfigurationId'] = defaultProfile?.uuid
      setInitValues(formData)
    }
  }, [defaultProfile, formData])

  return (
    <Layout.Vertical padding="xxlarge">
      <Container padding="small">
        <Formik
          initialValues={formData}
          onSubmit={values => {
            onSubmit(values)
            /** to do here */
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().trim().required(getString('delegate.delegateNameRequired')),
            size: Yup.string().trim().required(getString('delegate.delegateSizeRequired')),
            delegateConfigurationId: Yup.string().trim().required(getString('delegate.delegateConfigRequired'))
          })}
        >
          {formikProps => {
            const selectedProfile: any = getProfile(data, formikProps.values.delegateConfigurationId)
            return (
              <FormikForm>
                <Container style={{ minHeight: 460 }} className={css.container}>
                  <div className={css.formGroup}>
                    <AddDescriptionWithIdentifier identifierProps={{ inputName: 'name' }} />
                  </div>
                  {delegateSizeMappings && (
                    <Layout.Vertical className={css.delegateSizeField}>
                      <label className={css.delegateSizeLabel}>{getString('delegate.delegateSize')}</label>
                      <div className={css.formGroup}>
                        <CardSelect
                          cornerSelected={true}
                          data={selectCardData}
                          selected={
                            selectCardData[selectCardData.findIndex((card: any) => card.value === selectedCard?.value)]
                          }
                          renderItem={item => {
                            const cardData = filterDelegatesize(delegateSizeMappings, item)

                            const tagClsName =
                              cardData.size === 'small'
                                ? css.small
                                : cardData.size === 'medium'
                                ? css.medium
                                : css.large

                            return (
                              <Container className={`${css.cardWrapper}`}>
                                <div className={`${tagClsName} ${css.sizeTag}`}>{cardData.label}</div>
                                <Container>
                                  <Text>{cardData.ram}</Text>
                                  <Text>
                                    {getString('delegate.replicaText')}
                                    {cardData.replicas}{' '}
                                  </Text>
                                </Container>
                                <Container className={css.footer}>
                                  <div>
                                    <Text> {getString('delegate.totalMem')}</Text>
                                    <Text>{cardData.taskLimit} </Text>
                                  </div>

                                  <div>
                                    <Text>{getString('delegate.totalCpu')}</Text>
                                    <Text>{cardData.cpu}</Text>
                                  </div>
                                </Container>
                              </Container>
                            )
                          }}
                          onChange={size => {
                            /* istanbul ignore next */
                            setSelectedCard(size)
                            formikProps.setFieldValue('size', size.value)
                          }}
                          className={`grid ${css.delegateSizeWrapper}`}
                        ></CardSelect>
                      </div>

                      <Container className={css.workloadSeparator}>
                        <Text color={Color.ORANGE_500}>{getString('delegate.productionWorkloads')}</Text>
                      </Container>
                    </Layout.Vertical>
                  )}
                  <div className={`${css.formGroup} ${css.profileSelect}`}>
                    <FormInput.Select
                      items={profileOptions}
                      label={getString('delegate.delegateConfigurations')}
                      name={'delegateConfigurationId'}
                    />
                  </div>

                  {formikProps.values.delegateConfigurationId && selectedProfile && selectedProfile?.selectors && (
                    <Container className={css.profileSelectors}>
                      <Text>Delegate Tags</Text>
                      <Text>Tags inherited from the delegate configuration</Text>

                      {selectedProfile?.selectors &&
                        selectedProfile.selectors.map((item: string) => {
                          return <Tag key={item}>{item}</Tag>
                        })}
                    </Container>
                  )}

                  <Layout.Horizontal className={css.footer}>
                    <Button
                      id="stepReviewScriptBackButton"
                      text={getString('back')}
                      onClick={props.onBack}
                      icon="chevron-left"
                      margin={{ right: 'small' }}
                    />
                    <Button
                      type="submit"
                      text={getString('continue')}
                      intent="primary"
                      rightIcon="chevron-right"
                      // onClick={() => {
                      //   if (props?.nextStep) {
                      //     props?.nextStep?.()
                      //   }
                      //   // const selectedIdx = selectedTabIndex
                      //   // setSelectedTabId(panels[selectedIdx + 1].id)
                      //   // setSelectedTabIndex(selectedIdx + 1)
                      // }}
                    />
                  </Layout.Horizontal>
                </Container>
              </FormikForm>
            )
          }}
        </Formik>
      </Container>
    </Layout.Vertical>
  )
}

export default DelegateSetup
