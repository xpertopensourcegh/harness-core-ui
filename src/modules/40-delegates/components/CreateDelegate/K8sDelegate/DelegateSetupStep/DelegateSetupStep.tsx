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
  StepProps
} from '@wings-software/uicore'
import * as Yup from 'yup'
import { useGetDelegateProfilesV2, useGetDelegateSizes, useValidateKubernetesYaml } from 'services/portal'

import { useStrings } from 'framework/exports'
import type { DelegateProfile } from '@delegates/DelegateInterface'

import { AddDescriptionWithIdentifier } from '@common/components/AddDescriptionAndTags/AddDescriptionAndTags'
import type { DelegateYaml } from '@delegates/DelegateInterface'

import css from './DelegateSetupStep.module.scss'

interface DelegateSetupStepProps {
  onBack?: any
}

const formatProfileList = (data: any): Array<SelectOption> => {
  const profiles: Array<DelegateProfile> = data?.resource?.response
  const options: Array<SelectOption> = profiles
    ? profiles.map((item: DelegateProfile) => {
        return { label: item.name || '', value: item.name || '' }
      })
    : [{ label: '', value: '' }]
  return options
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

const DelegateSetup: React.FC<StepProps<DelegateYaml> & DelegateSetupStepProps> = props => {
  const initialValues = {
    name: '',
    identifier: '',
    description: '',
    delegateConfigurationId: 'Primary',
    size: '',
    sesssionIdentifier: ''
  }
  const { accountId } = useParams()
  const { getString } = useStrings()
  const [selectedCard, setSelectedCard] = React.useState<any | undefined>()

  const { mutate: createKubernetesYaml } = useValidateKubernetesYaml({ queryParams: { accountId } })

  const { data } = useGetDelegateProfilesV2({ queryParams: { accountId } })
  const { data: delegateSizes } = useGetDelegateSizes({
    queryParams: { accountId }
  })
  const delegateSizeMappings = delegateSizes?.resource
  const selectCardData = formatDelegateSizeArr(delegateSizeMappings)
  const profileOptions: SelectOption[] = formatProfileList(data)

  const onSubmit = async (values: DelegateYaml) => {
    const response = await createKubernetesYaml(values)
    const delegateYaml = response.resource
    props?.nextStep?.(delegateYaml)
  }

  return (
    <Layout.Vertical padding="xxlarge">
      <Container padding="small">
        <Formik
          initialValues={initialValues}
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
            // const selProfile =
            //   data && data.resource ? data?.resource.find(item => item.uuid == formikProps.values.profile) : null
            return (
              <FormikForm>
                <Container style={{ minHeight: 460 }} className={css.container}>
                  <div className={css.formGroup}>
                    <AddDescriptionWithIdentifier identifierProps={{ inputName: 'name' }} />
                  </div>
                  {delegateSizeMappings && (
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
                            cardData.size === 'small' ? css.small : cardData.size === 'medium' ? css.medium : css.large

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
                  )}
                  <div className={`${css.formGroup} ${css.profileSelect}`}>
                    <FormInput.Select
                      items={profileOptions}
                      label={getString('delegate.delegateConfigurations')}
                      name={'delegateConfigurationId'}
                    />
                  </div>
                  {/* 
                    <Container>
                      <Text>Delegate Tags</Text>
                      <Text>Tags inherited from the delegate configuration</Text>

                      {selProfile?.selectors &&
                        selProfile.selectors.map(item => {
                          return <Tag>Tag</Tag>
                        })}
                    </Container> */}

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
