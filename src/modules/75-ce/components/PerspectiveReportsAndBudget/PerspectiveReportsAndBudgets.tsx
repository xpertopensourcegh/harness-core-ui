import React, { useState, useMemo, ReactNode } from 'react'
import cronstrue from 'cronstrue'
import { Dialog, IDialogProps } from '@blueprintjs/core'
import { useHistory, useParams } from 'react-router-dom'
import type { Column, CellProps, Renderer } from 'react-table'
import {
  Container,
  Text,
  Layout,
  useModalHook,
  Button,
  Icon,
  FlexExpander,
  Formik,
  FormInput,
  FormikForm
} from '@wings-software/uicore'
import { Popover, Position, Classes, PopoverInteractionKind } from '@blueprintjs/core'
import { DEFAULT_GROUP_BY } from '@ce/utils/perspectiveUtils'
import routes from '@common/RouteDefinitions'
import { QlceViewFieldInputInput, ViewChartType } from 'services/ce/services'
import { CEView, useGetReportSetting } from 'services/ce'
import { useStrings } from 'framework/strings'

import Table from './Table'
import PerspectiveBuilderPreview from '../PerspectiveBuilderPreview/PerspectiveBuilderPreview'
import { getBudgetsResponse } from './Mock'
import css from './PerspectiveReportsAndBudgets.module.scss'

interface ListProps {
  title: string
  subTitle: string
  grid: ReactNode
  buttonText: string
  hasData: boolean
  loading: boolean
  onButtonClick: () => void
}

interface ReportTableParams {
  uuid?: string
  name?: string
  userCron?: string
  recipients?: string[]
}

interface BudgetTableParams {
  budgetAmount?: number
  alertThresholds?: { percentage?: number }[]
  actualCost?: number
  lastMonthCost?: number
}

interface TableActionsProps {
  onClickEdit: () => void
  onClickDelete: () => void
}

interface ReportsAndBudgetsProps {
  values?: CEView
  onPrevButtonClick: () => void
}

const ReportsAndBudgets: React.FC<ReportsAndBudgetsProps> = ({ values, onPrevButtonClick }) => {
  const [groupBy, setGroupBy] = useState<QlceViewFieldInputInput>(() => {
    return (values?.viewVisualization?.groupBy as QlceViewFieldInputInput) || DEFAULT_GROUP_BY
  })

  const [chartType, setChartType] = useState<ViewChartType>(() => {
    return (values?.viewVisualization?.chartType as ViewChartType) || ViewChartType.StackedLineChart
  })

  const history = useHistory()
  const { getString } = useStrings()
  const { perspectiveId, accountId } = useParams<{ perspectiveId: string; accountId: string }>()

  const savePerspective = (): void => {
    history.push(
      routes.toPerspectiveDetails({
        accountId,
        perspectiveId,
        perspectiveName: perspectiveId
      })
    )
  }

  return (
    <Container className={css.mainContainer}>
      <Container className={css.innerContainer}>
        <Layout.Vertical
          spacing="xxlarge"
          height="100%"
          padding={{ left: 'large', right: 'xxlarge', bottom: 'xxlarge', top: 'xxlarge' }}
        >
          <ScheduledReports />
          <Budgets />
          <FlexExpander />
          <Layout.Horizontal padding={{ top: 'medium' }} spacing="large">
            <Button icon="chevron-left" text={getString('previous')} onClick={onPrevButtonClick} />
            <Button intent="primary" text={getString('ce.perspectives.save')} onClick={() => savePerspective()} />
          </Layout.Horizontal>
        </Layout.Vertical>
        {values && (
          <PerspectiveBuilderPreview
            setGroupBy={(gBy: QlceViewFieldInputInput) => setGroupBy(gBy)}
            groupBy={groupBy}
            chartType={chartType}
            setChartType={(type: ViewChartType) => {
              setChartType(type)
            }}
            formValues={values}
          />
        )}
      </Container>
    </Container>
  )
}

const ScheduledReports: React.FC = () => {
  const { getString } = useStrings()
  const [openModal] = useCreateReportModal()
  const { accountId, perspectiveId } = useParams<{ accountId: string; perspectiveId: string }>()
  const { data, loading } = useGetReportSetting({ accountId, queryParams: { perspectiveId } })
  // const { mutate: createReport } = useCreateReportSetting({ accountId })
  // const { mutate: deleteReport } = useDeleteReportSetting({ pathParams: { accountId } }) // find out how to pass selected uuid

  const handleCreateNewReport = (): void => {
    openModal()
    // const sampleCron = ['30 * * * * *', '0 13 * * 1 *', '*/5 * * * * *', '0 */2 * * * *']
    // const rand = ~~(Math.random() * 4)

    // try {
    //   const response = await createReport({
    //     viewsId: [perspectiveId],
    //     name: `Bdj ${rand}`,
    //     userCron: sampleCron[rand],
    //     description: 'Hello, I am description',
    //     recipients: ['akash.bhardwaj@harness.io', 'yo@lo.com', 'no@email.com']
    //   })

    //   // console.log('response of create report: ', response)
    // } catch (e) {
    //   // console.log('error in creating report::::: ', e)
    // }
  }

  const handleEdit = (): void => {
    return // fix this when api is integrated.
  }

  const handleDelete = (): void => {
    return // fix this when api is integrated
  }

  const columns: Column<ReportTableParams>[] = useMemo(
    () => [
      {
        Header: getString('ce.perspectives.reports.reportName'),
        accessor: 'name'
      },
      {
        Header: getString('ce.perspectives.reports.frequency'),
        accessor: 'userCron',
        Cell: RenderReportFrequency
      },
      {
        Header: getString('ce.perspectives.reports.recipients'),
        accessor: 'recipients',
        Cell: RenderReportRecipients
      },
      {
        id: 'edit-delete-action-column',
        Cell: () => <RenderEditDeleteActions onClickEdit={() => handleEdit()} onClickDelete={() => handleDelete()} />
      }
    ],
    []
  )

  const reports = data?.resource || []
  return (
    <List
      title={getString('ce.perspectives.reports.title')}
      subTitle={`${getString('ce.perspectives.reports.desc')} ${
        !reports.length ? getString('ce.perspectives.reports.msg') : ''
      }`}
      buttonText={getString('ce.perspectives.reports.createNew')}
      onButtonClick={() => handleCreateNewReport()}
      hasData={!!reports.length}
      loading={loading}
      grid={<Table<ReportTableParams> data={reports} columns={columns} />}
    />
  )
}

const Budgets = (): JSX.Element => {
  const { getString } = useStrings()
  const response = getBudgetsResponse()
  const columns: Column<BudgetTableParams>[] = useMemo(
    () => [
      {
        Header: getString('ce.perspectives.budgets.amount'),
        accessor: 'budgetAmount'
      },
      {
        Header: getString('ce.perspectives.budgets.alerts'),
        accessor: 'alertThresholds',
        Cell: RenderAlertThresholds
      },
      {
        Header: getString('ce.perspectives.budgets.actualCost'),
        accessor: 'actualCost'
      },
      {
        Header: getString('ce.perspectives.budgets.lastMonthCost'),
        accessor: 'lastMonthCost'
      },
      {
        id: 'edit-delete-action-column',
        Cell: ({ row }: CellProps<BudgetTableParams>) => (
          <RenderEditDeleteActions onClickEdit={() => row.original} onClickDelete={() => row.original} />
        )
      }
    ],
    []
  )

  const budgets = response?.resource || []
  return (
    <List
      title={getString('ce.perspectives.budgets.title')}
      subTitle={getString('ce.perspectives.budgets.desc')}
      buttonText={getString('ce.perspectives.budgets.createNew')}
      onButtonClick={() => 'TEST'}
      hasData={!!budgets.length}
      loading={false}
      grid={<Table<BudgetTableParams> columns={columns} data={budgets} />}
    />
  )
}

const List = (props: ListProps): JSX.Element => {
  const { title, subTitle, grid, buttonText, hasData, onButtonClick, loading } = props

  const renderLoader = (): JSX.Element => {
    return (
      <Container className={css.loader}>
        <Icon name="spinner" color="blue500" size={30} />
      </Container>
    )
  }

  return (
    <Container>
      <Text color="grey800" style={{ fontSize: 16 }}>
        {title}
      </Text>
      <Text padding={{ top: 'large', bottom: 'large' }} color="grey800" font={'small'}>
        {subTitle}
      </Text>
      {loading && renderLoader()}
      {!loading && hasData && grid}
      {!loading && (
        <Layout.Horizontal
          spacing="small"
          style={{
            justifyContent: hasData ? 'flex-end' : 'center',
            alignItems: 'center'
          }}
        >
          <Button
            type="submit"
            withoutBoxShadow={true}
            className={css.createBtn}
            text={buttonText}
            onClick={onButtonClick}
          />
        </Layout.Horizontal>
      )}
    </Container>
  )
}

const RenderReportFrequency: Renderer<CellProps<ReportTableParams>> = ({ row }) => {
  const cron = row.original.userCron || ''
  return <span>{cronstrue.toString(cron)}</span>
}

const RenderReportRecipients: Renderer<CellProps<ReportTableParams>> = ({ row }) => {
  const recipients = [...(row.original.recipients || [])]
  const email = recipients.shift()
  const remainingEmailsCount = recipients.length ? `(+${recipients.length})` : ''

  return (
    <Layout.Horizontal spacing="xsmall">
      <Text color="grey700" font="small">
        {email}
      </Text>
      {recipients.length ? (
        <Popover
          popoverClassName={Classes.DARK}
          position={Position.BOTTOM}
          interactionKind={PopoverInteractionKind.HOVER}
          content={
            <div className={css.popoverContent}>
              <ul>
                {recipients.map((em, idx) => (
                  <li key={idx}>{em}</li>
                ))}
              </ul>
            </div>
          }
        >
          <Text color="primary7" font="small">
            {remainingEmailsCount}
          </Text>
        </Popover>
      ) : null}
    </Layout.Horizontal>
  )
}

const RenderEditDeleteActions = (props: TableActionsProps): JSX.Element => {
  const { onClickEdit, onClickDelete } = props
  return (
    <Layout.Horizontal
      spacing="medium"
      style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Icon size={14} name={'Edit'} color="primary7" onClick={onClickEdit} className={css.icon} />
      <Icon size={14} name={'trash'} color="primary7" onClick={onClickDelete} className={css.icon} />
    </Layout.Horizontal>
  )
}

const RenderAlertThresholds: Renderer<CellProps<BudgetTableParams>> = ({ row }) => {
  const alerts = row.original.alertThresholds || []
  const percentages = alerts.map(a => a.percentage)
  return <span>{percentages.join(', ')}</span>
}

interface ReportDetailsForm {
  name: string
  viewsId: string[]
  recipients: string[]
  description: string
  frequency: string
  day: number
  time: number
}

const useCreateReportModal = () => {
  const { perspectiveId } = useParams<{ perspectiveId: string; accountId: string }>()
  const modalPropsLight: IDialogProps = {
    isOpen: true,
    usePortal: true,
    autoFocus: true,
    canEscapeKeyClose: true,
    canOutsideClickClose: true,
    enforceFocus: false,
    className: Classes.DIALOG,
    style: { width: 450, height: 650 }
  }
  const handleSubmit = (): void => {
    return
  }

  const [openModal, hideModal] = useModalHook(() => (
    <Dialog onClose={hideModal} {...modalPropsLight}>
      <Container padding="xlarge">
        <Layout.Vertical spacing="xlarge">
          <Container padding="small">
            <Formik<ReportDetailsForm>
              onSubmit={_ => {
                handleSubmit()
              }}
              formName="createReportScheduleForm"
              initialValues={{
                viewsId: [perspectiveId],
                name: '',
                recipients: ['a'],
                description: '',
                frequency: 'weekly',
                day: 2,
                time: 9
              }}
            >
              {() => {
                return (
                  <FormikForm>
                    <Container style={{ minHeight: 560 }}>
                      <FormInput.Text name={'name'} label={'Name'} />
                      <FormInput.Select
                        items={[
                          { label: 'Weekly', value: 'weekly' },
                          { label: 'Monthly', value: 'monthly' }
                        ]}
                        name={'frequency'}
                        label={'Add a report schedule'} // This is WIP. Will move to strings when complete.
                      />
                      <FormInput.Select
                        items={[
                          { label: 'Sunday', value: 0 },
                          { label: 'Monday', value: 1 },
                          { label: 'Tuesday', value: 2 },
                          { label: 'Wednesday', value: 3 },
                          { label: 'Thursday', value: 4 },
                          { label: 'Friday', value: 5 },
                          { label: 'Saturday', value: 6 }
                        ]}
                        name={'day'}
                      />
                      <FormInput.Select
                        items={[
                          { label: '9am', value: 9 },
                          { label: '1pm', value: 13 }
                        ]}
                        name={'time'}
                      />
                    </Container>
                    <Layout.Horizontal>
                      <Button type="submit" intent="primary" rightIcon="chevron-right" disabled={false}>
                        Save
                      </Button>
                    </Layout.Horizontal>
                  </FormikForm>
                )
              }}
            </Formik>
          </Container>
        </Layout.Vertical>
      </Container>
    </Dialog>
  ))

  return [openModal, hideModal]
}

export default ReportsAndBudgets
