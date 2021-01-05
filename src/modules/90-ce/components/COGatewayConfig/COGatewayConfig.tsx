import React, { useState } from 'react'
import type { CellProps } from 'react-table'

import {
  Formik,
  FormikForm,
  FormInput,
  Container,
  Layout,
  Heading,
  CardSelect,
  CardBody,
  Label,
  Text,
  Table,
  Color,
  Tabs,
  Tab,
  Collapse,
  Button,
  ModalErrorHandler,
  ModalErrorHandlerBinding,
  TextInput,
  Switch
} from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import type { IconName } from '@blueprintjs/core'
import type { GatewayDetails, InstanceDetails } from '@ce/components/COCreateGateway/models'
import COInstanceSelector from '@ce/components/COInstanceSelector/COInstanceSelector'
import COHelpSidebar from '@ce/components/COHelpSidebar/COHelpSidebar'
import { useAllResourcesOfAccount } from 'services/lw'
import i18n from './COGatewayConfig.i18n'
import css from './COGatewayConfig.module.scss'

interface COGatewayConfigProps {
  gatewayDetails: GatewayDetails
  setGatewayDetails: (gwDetails: GatewayDetails) => void
}
interface CardData {
  text: string
  value: string
  icon: string
}
interface HealthCheck {
  protocol: string
  path: string
  port: number
  timeout: number
}

const defaultHealthCheck: HealthCheck = {
  protocol: 'http',
  path: '/',
  port: 80,
  timeout: 30
}

const instanceTypeCardData: CardData[] = [
  {
    text: 'Spot',
    value: 'spot',
    icon: 'harness'
  },
  {
    text: 'On-demand',
    value: 'ondemand',
    icon: 'harness'
  }
]

function TableCell(tableProps: CellProps<InstanceDetails>): JSX.Element {
  return (
    <Text lineClamp={3} color={Color.BLACK}>
      {tableProps.value}
    </Text>
  )
}
function NameCell(tableProps: CellProps<InstanceDetails>): JSX.Element {
  return (
    <Text lineClamp={3} color={Color.BLACK}>
      {tableProps.value} {tableProps.row.original.id}
    </Text>
  )
}
function HealthCell(tableProps: CellProps<InstanceDetails>): JSX.Element {
  return <TextInput defaultValue={tableProps.value} />
}
const COGatewayConfig: React.FC<COGatewayConfigProps> = props => {
  const [selectedInstances, setSelectedInstances] = useState<InstanceDetails[]>(props.gatewayDetails.selectedInstances)
  const [filteredInstances, setFilteredInstances] = useState<InstanceDetails[]>([])
  const [allInstances, setAllInstances] = useState<InstanceDetails[]>([])
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const [healthCheck, setHealthCheck] = useState<boolean>(false)

  const { orgIdentifier } = useParams()
  const { mutate: getInstances } = useAllResourcesOfAccount({
    org_id: orgIdentifier, // eslint-disable-line
    queryParams: {
      cloud_account_id: +props.gatewayDetails.cloudAccount, // eslint-disable-line
      type: 'instance'
    }
  })
  const onComplete = async (): Promise<void> => {
    try {
      const result = await getInstances(
        { Text: '' },
        {
          queryParams: {
            cloud_account_id: 1, // eslint-disable-line
            type: 'instance'
          }
        }
      )
      if (result && result.response) {
        const instances = result.response?.map(item => {
          return {
            name: item.name ? item.name : '',
            id: item.id ? item.id : '',
            ipAddress: item.ipv4 ? item.ipv4[0] : '',
            region: item.region ? item.region : '',
            type: item.type ? item.type : '',
            tags: '',
            launchTime: item.launch_time ? item.launch_time : '',
            status: item.status ? item.status : ''
          }
        })
        setAllInstances(instances)
        setFilteredInstances(instances)
      }
    } catch (e) {
      modalErrorHandler?.showDanger(e.data?.message || e.message)
    }
  }
  function handleSearch(text: string): void {
    if (!text) {
      setFilteredInstances(allInstances)
      return
    }
    const instances: InstanceDetails[] = []
    allInstances.forEach(t => {
      if (t.name.indexOf(text) >= 0 || t.id.indexOf(text) >= 0) {
        instances.push(t)
      }
    })
    setFilteredInstances(instances)
  }
  return (
    <Layout.Vertical className={css.page}>
      <ModalErrorHandler bind={setModalErrorHandler} />
      <COHelpSidebar pageName="configuration" />
      <Container style={{ margin: '0 auto', paddingTop: 10, marginLeft: '264px' }}>
        <Layout.Vertical spacing="large" padding="large">
          <Heading level={2} font={{ weight: 'semi-bold' }}>
            {i18n.configHeading}
          </Heading>
          <Formik
            initialValues={{
              idleTime: props.gatewayDetails.idleTimeMins,
              selectedIcon: props.gatewayDetails.fullfilment
            }}
            onSubmit={values => alert(JSON.stringify(values))}
            render={formik => (
              <FormikForm>
                <Layout.Vertical spacing="medium" width="50%">
                  <FormInput.Text name="idleTime" label="Idle time (mins)" placeholder="Enter time" />
                  <Label style={{ fontSize: '13px', lineHeight: '20px' }}>Select Instance type</Label>
                  <CardSelect
                    data={instanceTypeCardData}
                    className={css.instanceTypeViewGrid}
                    onChange={item => {
                      props.gatewayDetails.fullfilment = item.value
                      props.setGatewayDetails(props.gatewayDetails)
                      formik.setFieldValue('selectedIcon', item.value)
                    }}
                    renderItem={(item, _) => (
                      <Layout.Vertical spacing="large">
                        <CardBody.Icon className={css.card} icon={item.icon as IconName} iconSize={21}></CardBody.Icon>
                        <Text font={{ align: 'center' }} style={{ fontSize: 12 }}>
                          {item.text}
                        </Text>
                      </Layout.Vertical>
                    )}
                    selected={
                      instanceTypeCardData[
                        instanceTypeCardData.findIndex(card => card.value == formik.values.selectedIcon)
                      ]
                    }
                    cornerSelected={true}
                  ></CardSelect>
                </Layout.Vertical>
              </FormikForm>
            )}
            validationSchema={Yup.object().shape({
              idleTime: Yup.number().required('Idle Time is required field'),
              selectedIcon: Yup.string().required('Instance Type is required field')
            })}
          ></Formik>

          <Label style={{ fontSize: '13px', lineHeight: '20px' }}>Instances</Label>
          <Container style={{ background: 'var(--grey-100)', padding: 25 }}>
            <Text style={{ color: 'var(--grey-500)', lineHeight: '24px', fontSize: '13px', maxWidth: '897px' }}>
              {i18n.info}
            </Text>
            {selectedInstances.length ? (
              <Table<InstanceDetails>
                data={selectedInstances}
                bpTableProps={{}}
                className={css.instanceTable}
                columns={[
                  {
                    accessor: 'name',
                    Header: 'NAME AND ID',
                    width: '16.5%',
                    Cell: NameCell
                  },
                  {
                    accessor: 'ipAddress',
                    Header: 'IP ADDRESS',
                    width: '16.5%',
                    Cell: TableCell,
                    disableSortBy: true
                  },
                  {
                    accessor: 'region',
                    Header: 'REGION',
                    width: '16.5%',
                    Cell: TableCell
                  },
                  {
                    accessor: 'type',
                    Header: 'TYPE',
                    width: '16.5%',
                    Cell: TableCell
                  },
                  {
                    accessor: 'tags',
                    Header: 'TAGS',
                    width: '16.5%',
                    Cell: TableCell
                  },
                  {
                    accessor: 'launchTime',
                    Header: 'LAUNCH TIME',
                    width: '16.5%',
                    Cell: TableCell
                  },
                  {
                    accessor: 'status',
                    Header: 'STATUS',
                    width: '16.5%',
                    Cell: TableCell
                  }
                ]}
              />
            ) : null}
          </Container>
          <Container style={{ background: 'var(--grey-100)', padding: 25 }}>
            <Collapse collapsedIcon="plus" heading={i18n.addInstanceLabel}>
              <Button style={{ float: 'right' }} onClick={onComplete} icon="refresh" />
              <COInstanceSelector
                selectedInstances={selectedInstances}
                setSelectedInstances={setSelectedInstances}
                setGatewayDetails={props.setGatewayDetails}
                instances={filteredInstances}
                gatewayDetails={props.gatewayDetails}
                search={handleSearch}
              />
            </Collapse>
          </Container>
          <Container>
            <Layout.Horizontal spacing="small">
              <Tabs id="tabsId1">
                <Tab id="routing" title="Routing" panel={<Text>Config related to routing</Text>} />
                <Tab
                  id="healthcheck"
                  title="Health check"
                  panel={
                    <Container style={{ backgroundColor: '#FBFBFB' }}>
                      <Layout.Vertical spacing="large" padding="large">
                        <Switch
                          label={i18n.healthCheck}
                          className={css.switchFont}
                          onChange={e => {
                            setHealthCheck(e.currentTarget.checked)
                          }}
                        />
                        {healthCheck ? (
                          <Table<HealthCheck>
                            data={[defaultHealthCheck]}
                            bpTableProps={{}}
                            className={css.healthCheckTable}
                            columns={[
                              {
                                accessor: 'protocol',
                                Header: 'PROTOCOL',
                                width: '16.5%',
                                Cell: HealthCell
                              },
                              {
                                accessor: 'path',
                                Header: 'PATH',
                                width: '16.5%',
                                Cell: HealthCell,
                                disableSortBy: true
                              },
                              {
                                accessor: 'port',
                                Header: 'PORT',
                                width: '16.5%',
                                Cell: HealthCell
                              },
                              {
                                accessor: 'timeout',
                                Header: 'TIMEOUT(SECS)',
                                width: '16.5%',
                                Cell: HealthCell
                              }
                            ]}
                          />
                        ) : null}
                      </Layout.Vertical>
                    </Container>
                  }
                />
                <Tab
                  id="advanced"
                  title="Advanced Configuration"
                  panel={
                    <Container style={{ backgroundColor: '#FBFBFB' }}>
                      <Layout.Vertical spacing="medium" padding="large">
                        <Label style={{ color: ' #0092E4', fontSize: '12px', cursor: 'pointer' }}>
                          {i18n.addDependency}
                        </Label>
                        <Label style={{ fontSize: '11px', fontWeight: 500 }}>{i18n.customDomain}</Label>
                        <TextInput></TextInput>
                        <Text style={{ fontSize: '12px', lineHeight: '20px' }}>{i18n.customDomainHelp}</Text>
                        <Layout.Horizontal style={{ paddingTop: 24 }}>
                          <Switch label={i18n.allowTraffic} width="50%" className={css.switchFont} />
                          <Switch label={i18n.usePrivateIP} width="50%" className={css.switchFont} />
                        </Layout.Horizontal>
                        <Switch label={i18n.disable} className={css.switchFont} />
                      </Layout.Vertical>
                    </Container>
                  }
                />
              </Tabs>
            </Layout.Horizontal>
          </Container>
        </Layout.Vertical>
      </Container>
    </Layout.Vertical>
  )
}

export default COGatewayConfig
