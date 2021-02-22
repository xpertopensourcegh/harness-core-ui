import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import {
  Layout,
  Button,
  StepWizard,
  Formik,
  FormikForm,
  FormInput,
  Heading,
  StepProps,
  SelectOption,
  Icon,
  Color,
  Text
} from '@wings-software/uicore'
import { Radio, RadioGroup } from '@blueprintjs/core'
import {
  ConnectorReferenceField,
  ConnectorReferenceFieldProps
} from '@connectors/components/ConnectorReferenceField/ConnectorReferenceField'
import {
  AccessPoint,
  useAllCertificates,
  useAllExecutionRoles,
  useAllHostedZones,
  useAllRegions,
  useAllSecurityGroups,
  useAllVPCs,
  useCreateAccessPoint,
  useGetAccessPoint,
  useMapToDNS
} from 'services/lw'
import { useToaster } from '@common/exports'

interface Props extends StepProps<any> {
  name: string
  accessPoint: AccessPoint
  closeModal: () => void
  setAccessPoint: (ap: AccessPoint) => void
  refreshAccessPoints: () => void
}
interface CreateAccessPointWizardProps {
  accessPoint: AccessPoint
  closeModal: () => void
  setAccessPoint: (ap: AccessPoint) => void
  refreshAccessPoints: () => void
}

interface MapToProviderProps {
  accessPointID: string
}
const MapToProvider: React.FC<StepProps<MapToProviderProps> & Props> = props => {
  const { accountId, orgIdentifier, projectIdentifier } = useParams<{
    accountId: string
    orgIdentifier: string
    projectIdentifier: string
  }>()
  const { data: hostedZones, loading: hostedZonesLoading, refetch: loadHostedZones } = useAllHostedZones({
    org_id: orgIdentifier, // eslint-disable-line
    account_id: accountId, // eslint-disable-line
    project_id: projectIdentifier, // eslint-disable-line
    queryParams: {
      cloud_account_id: props.accessPoint.cloud_account_id as string, // eslint-disable-line
      region: 'us-east-1'
    },
    lazy: true
  })
  const { prevStepData } = props
  const mapToDNSProps = prevStepData as MapToProviderProps
  const [hostedZonesList, setHostedZonesList] = useState<SelectOption[]>([])
  const [dnsProvider, setDNSProvider] = useState<string>()
  const [mappedToDNS, setMappedToDNS] = useState<boolean>(false)

  const { showError } = useToaster()
  const { mutate: mapToDNS, loading: maptoDNSLoading } = useMapToDNS({
    org_id: orgIdentifier, // eslint-disable-line
    project_id: projectIdentifier, // eslint-disable-line
    access_point_id: mapToDNSProps.accessPointID // eslint-disable-line
  })
  const onMapToDNS = async (selectedZone: string): Promise<void> => {
    try {
      await mapToDNS({
        dns_provider: dnsProvider, // eslint-disable-line
        details: {
          hosted_zone_id: selectedZone // eslint-disable-line
        }
      })
      setMappedToDNS(true)
    } catch (e) {
      setMappedToDNS(false)
      showError(e.data?.message || e.message)
    }
  }
  useEffect(() => {
    if (hostedZonesLoading) return
    if (hostedZones?.response?.length == 0) {
      return
    }
    const loadedhostedZones: SelectOption[] =
      hostedZones?.response?.map(r => {
        return {
          label: r.name as string,
          value: r.id as string
        }
      }) || []
    setHostedZonesList(loadedhostedZones)
  }, [hostedZones, hostedZonesLoading])
  useEffect(() => {
    if (dnsProvider == 'route53') loadHostedZones()
  }, [dnsProvider])
  return (
    <Layout.Vertical style={{ minHeight: '640px', width: '55%' }} padding="large" spacing="large">
      <Heading level={2}>{props.name}</Heading>
      <Formik
        initialValues={{
          customURL: '',
          publicallyAccessible: 'no',
          dnsProvider: 'route53',
          route53Account: '',
          accessPoint: ''
        }}
        onSubmit={values => {
          onMapToDNS(values.route53Account)
        }}
        render={formik => (
          <FormikForm>
            <Layout.Vertical spacing="medium">
              <RadioGroup
                inline={true}
                name="dnsProvider"
                label={'Select the DNS Provider'}
                onChange={e => {
                  formik.setFieldValue('dnsProvider', e.currentTarget.value)
                  setDNSProvider(e.currentTarget.value)
                }}
                selectedValue={formik.values.dnsProvider}
              >
                <Radio label="Route53" value="route53" />
                <Radio label="Others" value="others" />
              </RadioGroup>
              {formik.values.dnsProvider == 'route53' ? (
                <Layout.Horizontal spacing="medium">
                  <FormInput.Select
                    name="route53Account"
                    label={'Select Route53 hosted zone'}
                    placeholder={'Select route 53 hosted zone'}
                    items={hostedZonesList}
                    onChange={e => {
                      formik.setFieldValue('route53Account', e.value)
                    }}
                    style={{ width: '80%' }}
                  />
                  {mappedToDNS ? (
                    <Layout.Horizontal spacing="small" style={{ alignSelf: 'center' }}>
                      <Icon name="tick" color={Color.GREEN_500} />
                      <Text color={Color.GREEN_500}>Verified</Text>
                    </Layout.Horizontal>
                  ) : (
                    <Button
                      intent="primary"
                      text="Verify"
                      style={{ alignSelf: 'center' }}
                      onClick={formik.submitForm}
                      loading={maptoDNSLoading}
                      disabled={maptoDNSLoading}
                    />
                  )}
                </Layout.Horizontal>
              ) : null}
            </Layout.Vertical>
          </FormikForm>
        )}
      ></Formik>
      <Button
        intent="primary"
        text="Finish"
        onClick={() => {
          props.closeModal()
        }}
        style={{ position: 'absolute', bottom: 'var(--spacing-medium)', width: '10%' }}
      ></Button>
    </Layout.Vertical>
  )
}
const CreateTunnelStep: React.FC<StepProps<any> & Props> = props => {
  const { showSuccess, showError } = useToaster()

  const { accountId, orgIdentifier, projectIdentifier } = useParams<{
    accountId: string
    orgIdentifier: string
    projectIdentifier: string
  }>()
  const [accessPoint, setAccessPoint] = useState<AccessPoint>(props.accessPoint)
  const [regionOptions, setRegionOptions] = useState<SelectOption[]>([])
  const [vpcOptions, setvpcOptions] = useState<SelectOption[]>([])
  const [roleOptions, setRoleOptions] = useState<SelectOption[]>([])
  const [sgOptions, setSGOptions] = useState<SelectOption[]>([])
  const [certificateOptions, setCertificateOptions] = useState<SelectOption[]>([])
  const [selectedCloudAccount, setSelectedCloudAccount] = useState<string>(props.accessPoint.cloud_account_id as string)
  const [selectedRegion, setSelectedRegion] = useState<string>(props.accessPoint.region as string)
  const [selectedVpc, setSelectedVpc] = useState<string>(props.accessPoint.vpc as string)

  const { data: accessPointData, refetch, loading: accessPointStatusLoading } = useGetAccessPoint({
    org_id: orgIdentifier, // eslint-disable-line
    project_id: projectIdentifier, // eslint-disable-line
    access_point_id: accessPoint.id as string, //eslint-disable-line
    lazy: true
  })
  const { nextStep } = props
  useEffect(() => {
    if (!accessPointStatusLoading && accessPoint.id) {
      if (accessPointData?.response?.status == 'errored') {
        showError('could not create access point')
      } else if (accessPointData?.response?.status == 'created') {
        props.setAccessPoint(accessPointData?.response as AccessPoint)
        showSuccess('Access Point Created Succesfully')
        props.refreshAccessPoints()
        nextStep?.({
          accessPointID: accessPointData?.response.id as string
        })
      } else {
        const timerId = window.setTimeout(() => {
          refetch()
        }, 1000)
        return () => {
          window.clearTimeout(timerId)
        }
      }
    }
  }, [accessPointData, refetch, accessPointStatusLoading, accessPoint])
  const { mutate: createAccessPoint } = useCreateAccessPoint({
    org_id: orgIdentifier, // eslint-disable-line
    project_id: projectIdentifier // eslint-disable-line
  })
  const onSave = async (): Promise<void> => {
    try {
      const result = await createAccessPoint(accessPoint) // eslint-disable-line
      if (result.response) {
        setAccessPoint(result.response as AccessPoint)
      }
    } catch (e) {
      showError(e.data?.message || e.message)
    }
  }
  const { data: regions, loading: regionsLoading } = useAllRegions({
    org_id: orgIdentifier, // eslint-disable-line
    account_id: accountId, // eslint-disable-line
    project_id: projectIdentifier, // eslint-disable-line
    queryParams: {
      cloud_account_id: selectedCloudAccount // eslint-disable-line
    }
  })
  const { data: vpcs, loading: vpcsLoading } = useAllVPCs({
    org_id: orgIdentifier, // eslint-disable-line
    account_id: accountId, // eslint-disable-line
    project_id: projectIdentifier, // eslint-disable-line
    queryParams: {
      region: selectedRegion,
      cloud_account_id: selectedCloudAccount // eslint-disable-line
    }
  })
  const { data: roles, loading: rolesLoading } = useAllExecutionRoles({
    org_id: orgIdentifier, // eslint-disable-line
    account_id: accountId, // eslint-disable-line
    project_id: projectIdentifier, // eslint-disable-line
    queryParams: {
      cloud_account_id: selectedCloudAccount // eslint-disable-line
    }
  })
  const { data: certificates, loading: certificatesLoading } = useAllCertificates({
    org_id: orgIdentifier, // eslint-disable-line
    account_id: accountId, // eslint-disable-line
    project_id: projectIdentifier, // eslint-disable-line
    queryParams: {
      cloud_account_id: selectedCloudAccount, // eslint-disable-line
      region: selectedRegion
    }
  })
  const { data: securityGroups, loading: sgsLoading } = useAllSecurityGroups({
    org_id: orgIdentifier, // eslint-disable-line
    account_id: accountId, // eslint-disable-line
    project_id: projectIdentifier, // eslint-disable-line
    queryParams: {
      region: selectedRegion,
      vpc_id: selectedVpc, // eslint-disable-line
      cloud_account_id: selectedCloudAccount // eslint-disable-line
    }
  })
  useEffect(() => {
    if (regions?.response?.length == 0) {
      return
    }
    const loaded: SelectOption[] =
      regions?.response?.map(r => {
        return {
          label: r.label as string,
          value: r.name as string
        }
      }) || []
    setRegionOptions(loaded)
  }, [regions])
  useEffect(() => {
    if (vpcs?.response?.length == 0) {
      return
    }
    const loaded: SelectOption[] =
      vpcs?.response?.map(v => {
        return {
          label: v.name as string,
          value: v.id as string
        }
      }) || []
    setvpcOptions(loaded)
  }, [vpcs])
  useEffect(() => {
    if (roles?.response?.length == 0) {
      return
    }
    const loaded: SelectOption[] =
      roles?.response?.map(v => {
        return {
          label: v.name as string,
          value: v.id as string
        }
      }) || []
    setRoleOptions(loaded)
  }, [roles])
  useEffect(() => {
    if (securityGroups?.response?.length == 0) {
      return
    }
    const loaded: SelectOption[] =
      securityGroups?.response?.map(v => {
        return {
          label: v.name as string,
          value: v.id as string
        }
      }) || []
    setSGOptions(loaded)
  }, [securityGroups])
  useEffect(() => {
    if (certificates?.response?.length == 0) {
      return
    }
    const loaded: SelectOption[] =
      certificates?.response?.map(v => {
        return {
          label: v.name as string,
          value: v.id as string
        }
      }) || []
    setCertificateOptions(loaded)
  }, [certificates])
  const isLoading = (): boolean => {
    return accessPoint.status == 'submitted'
  }
  return (
    <Layout.Vertical style={{ minHeight: '640px', width: '55%' }} padding="large" spacing="medium">
      <Heading level={2}>{props.name}</Heading>
      <Formik
        initialValues={{
          cloudConnector: accessPoint.cloud_account_id, // eslint-disable-line
          accessPointName: '',
          accessPointRegion: accessPoint.region,
          vpc: accessPoint.vpc,
          role: accessPoint.metadata?.role,
          securityGroups: accessPoint.metadata?.security_groups // eslint-disable-line
        }}
        onSubmit={_ => {
          onSave()
        }}
        render={formik => (
          <FormikForm>
            <Layout.Vertical spacing="medium">
              <ConnectorReferenceField
                name="cloudConnector"
                placeholder={'Select Cloud Account'}
                selected={accessPoint.cloud_account_id as ConnectorReferenceFieldProps['selected']} // eslint-disable-line
                onChange={record => {
                  props.accessPoint.cloud_account_id = record?.identifier // eslint-disable-line
                  setAccessPoint(props.accessPoint)
                  setSelectedCloudAccount(props.accessPoint.cloud_account_id as string) // eslint-disable-line
                  formik.setFieldValue('cloudConnector', record?.identifier)
                }}
                accountIdentifier={accountId}
                label="Select Cloud Connector"
                category={'CLOUD_COST'}
              />
              <FormInput.Text
                name="accessPointName"
                label={'Enter Access Point Domain name'}
                placeholder={'Access Point Domain name'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  props.accessPoint.host_name = e.target.value // eslint-disable-line
                  props.accessPoint.name = e.target.value // eslint-disable-line
                  setAccessPoint(props.accessPoint)
                  formik.setFieldValue('accessPointName', e.target.value)
                }}
              />
              <FormInput.Select
                name="accessPointRegion"
                label={'Select region to install Access Point'}
                placeholder={'Select region'}
                items={regionOptions}
                onChange={e => {
                  props.accessPoint.region = e.value as string
                  setAccessPoint(props.accessPoint)
                  setSelectedRegion(props.accessPoint.region)
                  formik.setFieldValue('accessPointRegion', e.value)
                }}
                disabled={regionsLoading || regionOptions.length == 0}
              />
              <FormInput.Select
                name="certificate"
                label={'Select an certificate'}
                placeholder={'Select Certificate'}
                items={certificateOptions}
                onChange={e => {
                  formik.setFieldValue('certificate', e)
                  if (props.accessPoint.metadata) props.accessPoint.metadata.certificate_id = e.value as string // eslint-disable-line
                  setAccessPoint(props.accessPoint)
                }}
                disabled={certificatesLoading || certificateOptions.length == 0}
              />
              <FormInput.Select
                name="role"
                label={'Select Execution Role'}
                placeholder={'Select Execution Role'}
                items={roleOptions}
                onChange={e => {
                  formik.setFieldValue('role', e)
                  if (props.accessPoint.metadata) props.accessPoint.metadata.role = e.value as string
                  setAccessPoint(props.accessPoint)
                }}
                disabled={rolesLoading || roleOptions.length == 0}
              />
              <FormInput.Select
                name="vpc"
                label={'Select VPC'}
                placeholder={'Select VPC'}
                items={vpcOptions}
                onChange={e => {
                  formik.setFieldValue('vpc', e.value)
                  props.accessPoint.vpc = e.value as string
                  setAccessPoint(props.accessPoint)
                  setSelectedVpc(props.accessPoint.vpc)
                }}
                disabled={vpcsLoading || vpcOptions.length == 0}
              />
              <FormInput.MultiSelect
                name="securityGroups"
                label={'Select Security groups'}
                placeholder={'Select Security groups'}
                items={sgOptions}
                onChange={e => {
                  formik.setFieldValue('securityGroups', e)
                  // eslint-disable-next-line
                  if (props.accessPoint.metadata) {
                    // eslint-disable-next-line
                    props.accessPoint.metadata.security_groups = e.map(x => {
                      return x.value as string
                    })
                    setAccessPoint(props.accessPoint)
                  }
                }}
                disabled={sgsLoading || sgOptions.length == 0}
              />
              <Button
                intent="primary"
                text="Create Access Point"
                onClick={formik.submitForm}
                loading={isLoading()}
                disabled={isLoading()}
              ></Button>
            </Layout.Vertical>
          </FormikForm>
        )}
        validationSchema={Yup.object().shape({
          cloudConnector: Yup.string().required('Connector is a required field'),
          accessPointName: Yup.string().required('Access point Name is a required field'),
          accessPointRegion: Yup.string().required('Region is a required field'),
          vpc: Yup.string().required('VPC is a required field'),
          subnets: Yup.array(Yup.string()).min(2, 'Atleast 2 subnets are mandatory'),
          securityGroups: Yup.array(Yup.string()).min(1, 'Atleast one security group is mandatory')
        })}
      ></Formik>
    </Layout.Vertical>
  )
}
const CreateAccessPointWizard: React.FC<CreateAccessPointWizardProps> = props => {
  return (
    <StepWizard icon={'service-aws'} iconProps={{ size: 40 }} title={'Create New Access Point'}>
      <CreateTunnelStep
        name="Create access point"
        accessPoint={props.accessPoint}
        closeModal={props.closeModal}
        setAccessPoint={props.setAccessPoint}
        refreshAccessPoints={props.refreshAccessPoints}
      />
      <MapToProvider
        name="Map the domain"
        accessPoint={props.accessPoint}
        closeModal={props.closeModal}
        setAccessPoint={props.setAccessPoint}
        refreshAccessPoints={props.refreshAccessPoints}
      />
    </StepWizard>
  )
}

export default CreateAccessPointWizard
