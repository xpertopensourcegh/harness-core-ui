import React, { useState, useCallback, useEffect } from 'react'
import {
  Container,
  Heading,
  Button,
  Text,
  Color,
  Icon,
  FormikForm,
  FormInput,
  Link,
  Utils
} from '@wings-software/uicore'
import {
  Drawer,
  Position,
  IDrawerProps,
  IPopoverProps,
  PopoverInteractionKind,
  PopoverPosition,
  Popover
} from '@blueprintjs/core'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { Formik } from 'formik'
import { useStrings } from 'framework/strings'
import css from './LogAnalysisRiskAndJiraModal.module.scss'

interface LogAnalysisRiskAndJiraModalProps {
  count: number
  activityType?: string
  trendData?: Highcharts.Options
  onHide: (data?: any) => void
  logMessage: string
  feedback?: { risk: string; message?: string }
}

interface DataNameAndDataProps {
  dataName: string
  data?: string | number
}

interface RiskAndMessageFormProps {
  handleSubmit: () => void
  hasSubmitted?: boolean
}

interface ActivityHeadingContentProps {
  count: number
  trendData?: Highcharts.Options
}

interface SampleDataProps {
  logMessage?: string
}

const DrawerProps: IDrawerProps = {
  autoFocus: true,
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  enforceFocus: true,
  isOpen: true,
  hasBackdrop: true,
  position: Position.RIGHT,
  usePortal: true,
  size: '70%'
}

const ShareContentPopoverProps: IPopoverProps = {
  canEscapeKeyClose: true,
  interactionKind: PopoverInteractionKind.CLICK,
  minimal: true,
  position: PopoverPosition.BOTTOM,
  usePortal: true
}

const RiskOptions = [
  { label: 'P1', value: 'P1' },
  { label: 'P2', value: 'P2' },
  { label: 'P3', value: 'P3' },
  { label: 'P4', value: 'P4' },
  { label: 'P5', value: 'P5' }
]

export function DataNameAndData(props: DataNameAndDataProps): JSX.Element {
  const { dataName, data } = props
  return data ? (
    <Container className={css.dataNameData}>
      <Text color={Color.BLACK}>{dataName}</Text>
      <Text className={css.dataContent}>{data}</Text>
    </Container>
  ) : (
    <span />
  )
}

export function ActivityHeadingContent(props: ActivityHeadingContentProps): JSX.Element {
  const { count, trendData } = props
  const { getString } = useStrings()
  return (
    <Container className={css.activityContainer}>
      <DataNameAndData dataName={getString('instanceFieldOptions.instanceHolder')} data={count} />
      <Container className={css.trendChart}>
        <Text color={Color.BLACK}>{getString('cv.trend')}</Text>
        <Container className={css.chartContainer}>
          <HighchartsReact highchart={Highcharts} options={trendData} />
        </Container>
      </Container>
    </Container>
  )
}

function RiskAndMessageForm(props: RiskAndMessageFormProps): JSX.Element {
  const { hasSubmitted, handleSubmit } = props
  useEffect(() => {
    if (hasSubmitted) {
      handleSubmit()
    }
  }, [hasSubmitted, handleSubmit])
  return (
    <FormikForm className={css.formContainer}>
      <FormInput.Select name="risk" items={RiskOptions} label="Risk" />
      <FormInput.TextArea name="message" label="Message" className={css.message} />
    </FormikForm>
  )
}

function ShareLinkPopoverContent(): JSX.Element {
  const [copiedToClipboard, setCopied] = useState(false)
  const onCopyURLCallback = useCallback(() => {
    Utils.copy(window.location.href)
    setCopied(true)
  }, [])
  const { getString } = useStrings()
  return (
    <Container className={css.sharePopoverContent}>
      <Container className={css.urlContent}>
        <Text>{window.location.href}</Text>
      </Container>
      {!copiedToClipboard ? (
        <Link withoutHref className={css.copyButton} onClick={onCopyURLCallback}>
          {getString('cv.copyURL')}
        </Link>
      ) : (
        <Container className={css.copySuccess}>
          <Icon name="deployment-success-new" size={11} />
          <Text>{getString('cv.urlCopied')}</Text>
        </Container>
      )}
    </Container>
  )
}

function IconHeading(): JSX.Element {
  const popoverContent = <ShareLinkPopoverContent />
  const { getString } = useStrings()
  return (
    <Container flex>
      <Container flex className={css.iconContainer}>
        <Icon name="service-jira" className={css.logo} />
        <Text>{getString('connectors.title.jira')}</Text>
      </Container>
      <Container className={css.iconContainer}>
        <Popover {...ShareContentPopoverProps} content={popoverContent}>
          <Container flex>
            <Icon name="main-share" className={css.logo} />
            <Text>{getString('cv.share')}</Text>
          </Container>
        </Popover>
      </Container>
    </Container>
  )
}

export function SampleData(props: SampleDataProps): JSX.Element {
  const { logMessage } = props
  const { getString } = useStrings()
  return (
    <Container className={css.logMessageContainer}>
      <Text color={Color.BLACK} className={css.sampleEvent}>
        {getString('cv.sampleEvent')}
      </Text>
      <Text className={css.logMessage} lineClamp={30} tooltipProps={{ isOpen: false }}>
        {logMessage}
      </Text>
    </Container>
  )
}

export function LogAnalysisRiskAndJiraModal(props: LogAnalysisRiskAndJiraModalProps): JSX.Element {
  const { onHide, activityType, count, trendData, logMessage, feedback } = props
  const [isOpen, setOpen] = useState(true)
  const [hasSubmitted, setSubmit] = useState(false)
  const { getString } = useStrings()
  const onHideCallback = useCallback(() => {
    setOpen(false)
    onHide()
  }, [onHide])
  const onSubmitCallback = useCallback(
    data => {
      setSubmit(false)
      setOpen(false)
      onHide(data)
    },
    [onHide]
  )

  return (
    <Drawer {...DrawerProps} isOpen={isOpen} onClose={onHideCallback} className={css.main}>
      <Container className={css.headingContainer}>
        <Heading level={2} color={Color.BLACK}>
          {activityType}
        </Heading>
        <IconHeading />
      </Container>
      <Container className={css.formAndMessageContainer}>
        <Formik initialValues={feedback ?? {}} onSubmit={onSubmitCallback}>
          {formikProps => <RiskAndMessageForm handleSubmit={formikProps.handleSubmit} hasSubmitted={hasSubmitted} />}
        </Formik>
        <Container>
          <ActivityHeadingContent trendData={trendData} count={count} />
          <SampleData logMessage={logMessage} />
        </Container>
        <Container className={css.buttonContainer}>
          <Button onClick={() => onHide()}>{getString('back')}</Button>
          <Button type="submit" intent="primary" onClick={() => setSubmit(true)}>
            {getString('save')}
          </Button>
        </Container>
      </Container>
    </Drawer>
  )
}
