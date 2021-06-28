import React from 'react'
import { Formik, FormikProps } from 'formik'
import { noop } from 'lodash-es'
import * as Yup from 'yup'
import { Button, Card, Icon, IconName, Layout, Text } from '@wings-software/uicore'
import cx from 'classnames'
import { String, useStrings } from 'framework/strings'
import { StageErrorContext } from '@pipeline/context/StageErrorContext'
import { DeployTabs } from '@cd/components/PipelineStudio/DeployStageSetupShell/DeployStageSetupShellUtils'
import css from '@cd/components/PipelineStudio/DeployInfraSpecifications/DeployInfraSpecifications.module.scss'

interface DeploymentTypeItem {
  name: string
  icon: IconName
  type: string
  enabled: boolean
}

interface DeploymentTypeGroup {
  name: string
  items: DeploymentTypeItem[]
}

interface SelectDeploymentTypeProps {
  selectedDeploymentType?: string
  onChange: (deploymentType: string | undefined) => void
  isReadonly: boolean
}

export default function SelectDeploymentType(props: SelectDeploymentTypeProps): JSX.Element {
  const { selectedDeploymentType, onChange, isReadonly } = props
  const { getString } = useStrings()
  const deploymentTypes: DeploymentTypeGroup[] = [
    {
      name: getString('pipelineSteps.deploy.infrastructure.directConnection'),
      items: [
        {
          name: getString('pipelineSteps.deploymentTypes.kubernetes'),
          icon: 'service-kubernetes',
          type: 'KubernetesDirect',
          enabled: true
        }
      ]
    },
    {
      name: getString('pipelineSteps.deploy.infrastructure.viaCloudProvider'),
      items: [
        {
          name: getString('pipelineSteps.deploymentTypes.gk8engine'),
          icon: 'google-kubernetes-engine',
          type: 'KubernetesGcp',
          enabled: true
        }
      ]
    }
  ]

  const filterSelectedDeploymentType = (
    deploymentTypeGroups: DeploymentTypeGroup[],
    selDeploymentType: string
  ): DeploymentTypeGroup[] => {
    const groups = deploymentTypeGroups.filter(group => group?.items?.find(type => type.type === selDeploymentType))
    if (groups[0]) {
      groups[0].items = groups[0].items.filter(type => type.type === selDeploymentType)
      return groups
    }
    return deploymentTypeGroups
  }

  const visibleDeploymentTypes = selectedDeploymentType
    ? filterSelectedDeploymentType(deploymentTypes, selectedDeploymentType)
    : deploymentTypes

  const { subscribeForm, unSubscribeForm } = React.useContext(StageErrorContext)

  const formikRef = React.useRef<FormikProps<unknown> | null>(null)

  React.useEffect(() => {
    subscribeForm({ tab: DeployTabs.INFRASTRUCTURE, form: formikRef })
    return () => unSubscribeForm({ tab: DeployTabs.INFRASTRUCTURE, form: formikRef })
  }, [])

  return (
    <Formik<{ deploymentType?: string }>
      onSubmit={noop}
      initialValues={{ deploymentType: selectedDeploymentType }}
      enableReinitialize
      validationSchema={Yup.object().shape({
        deploymentType: Yup.string().required(getString('cd.pipelineSteps.infraTab.deploymentType'))
      })}
    >
      {formik => {
        window.dispatchEvent(new CustomEvent('UPDATE_ERRORS_STRIP', { detail: DeployTabs.INFRASTRUCTURE }))
        formikRef.current = formik
        const { values, errors } = formik
        return (
          <Card className={cx(css.sectionCard, css.shadow, { [css.error]: errors.deploymentType })}>
            <div className={css.stepContainer}>
              <div className={css.subheading}>
                <String stringID="pipelineSteps.deploy.infrastructure.selectMethod" />
              </div>
              <div className={css.deploymentTypeGroups}>
                {visibleDeploymentTypes.map(deploymentTypeGroup => {
                  return (
                    <div className={css.deploymentTypeGroup} key={deploymentTypeGroup.name}>
                      <div className={css.connectionType}>{deploymentTypeGroup.name}</div>
                      <Layout.Horizontal>
                        {deploymentTypeGroup.items.map(type => (
                          <div key={type.name} className={css.squareCardContainer}>
                            <Card
                              disabled={!type.enabled || isReadonly}
                              interactive={true}
                              selected={type.type === values.deploymentType}
                              onClick={() => {
                                if (values.deploymentType !== type.type) {
                                  onChange(type.type)
                                }
                              }}
                              cornerSelected={type.type === values.deploymentType}
                              className={cx({ [css.disabled]: !type.enabled }, css.squareCard)}
                            >
                              <Icon name={type.icon as IconName} size={26} height={26} />
                            </Card>
                            <Text
                              style={{
                                fontSize: '12px',
                                color: type.enabled ? 'var(--grey-900)' : 'var(--grey-350)',
                                textAlign: 'center'
                              }}
                            >
                              {type.name}
                            </Text>
                          </div>
                        ))}
                      </Layout.Horizontal>
                    </div>
                  )
                })}
                {!!values.deploymentType && (
                  <Button
                    className={css.changeButton}
                    disabled={isReadonly}
                    minimal
                    intent="primary"
                    onClick={() => {
                      onChange(undefined)
                    }}
                    text={getString('change')}
                  />
                )}
              </div>
              {!!errors.deploymentType && (
                <Text font="small" className={css.deploymentTypeError}>
                  {errors.deploymentType}
                </Text>
              )}
            </div>
          </Card>
        )
      }}
    </Formik>
  )
}
