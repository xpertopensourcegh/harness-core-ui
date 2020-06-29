import React, { useState, useCallback } from 'react'
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
} from '@wings-software/uikit'
import {
  Drawer,
  Position,
  IDrawerProps,
  IPopoverProps,
  PopoverInteractionKind,
  PopoverPosition,
  Popover
} from '@blueprintjs/core'
import i18n from './LogAnalysisRiskAndJiraModal.i18n'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import css from './LogAnalysisRiskAndJiraModal.module.scss'
import { Formik } from 'formik'

interface MetricsVerificationModalProps {
  startTime: number
  endTime: number
  environment: string
  service: string
  count: number
  activityType?: string
  activityIdentifier?: string
  trendData?: Highcharts.Options
  onHide: () => void
  logMessage: string
}

interface StartAndEndTimeTextProps {
  endTime: number
  startTime: number
}

interface DataNameAndDataProps {
  dataName: string
  data?: string | number
}

interface RiskAndMessageFormProps {
  logMessage: string
  onHide: MetricsVerificationModalProps['onHide']
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
  size: '60%'
}

const ShareContentPopoverProps: IPopoverProps = {
  canEscapeKeyClose: true,
  interactionKind: PopoverInteractionKind.CLICK,
  minimal: true,
  position: PopoverPosition.BOTTOM,
  usePortal: true
}

const RiskOptions = [
  { label: 'P1', value: 'p1' },
  { label: 'P2', value: 'p2' },
  { label: 'P3', value: 'p3' },
  { label: 'P4', value: 'p4' },
  { label: 'P5', value: 'p5' }
]

function DataNameAndData(props: DataNameAndDataProps): JSX.Element {
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

function StartAndEndTimeText(props: StartAndEndTimeTextProps): JSX.Element {
  const { startTime, endTime } = props
  return (
    <Container className={css.startAndEndTime}>
      <Container>
        <Text inline className={css.timeLabel}>
          {i18n.subHeading.from}
        </Text>
        <Text color={Color.BLACK} inline>
          {new Date(startTime).toLocaleString()}
        </Text>
      </Container>
      <Container>
        <Text inline className={css.timeLabel}>
          {i18n.subHeading.to}
        </Text>
        <Text color={Color.BLACK} inline>
          {new Date(endTime).toLocaleString()}
        </Text>
      </Container>
    </Container>
  )
}

function RiskAndMessageForm(props: RiskAndMessageFormProps): JSX.Element {
  const { logMessage, onHide } = props
  return (
    <Formik initialValues={{}} onSubmit={() => undefined}>
      <FormikForm className={css.formContainer}>
        <Container className={css.formContent}>
          <Container>
            <FormInput.Select name="risk" items={RiskOptions} label="Risk" />
            <FormInput.TextArea name="message" label="Message" className={css.message} />
          </Container>
          <Container>
            <Text color={Color.BLACK} className={css.sampleEvent}>
              {i18n.sampleEvent}
            </Text>
            <Text className={css.logMessage}>{logMessage}</Text>
          </Container>
          <Container className={css.buttonContainer}>
            <Button onClick={() => onHide()}>{i18n.backButtonLabel}</Button>
            <Button type="submit" intent="primary">
              {i18n.saveButtonLabel}
            </Button>
          </Container>
        </Container>
      </FormikForm>
    </Formik>
  )
}

function ShareLinkPopoverContent(): JSX.Element {
  const [copiedToClipboard, setCopied] = useState(false)
  const onCopyURLCallback = useCallback(() => {
    Utils.copy(window.location.href)
    setCopied(true)
  }, [])
  return (
    <Container className={css.sharePopoverContent}>
      <Container className={css.urlContent}>
        <Text>{window.location.href}</Text>
      </Container>
      {!copiedToClipboard ? (
        <Link withoutHref className={css.copyButton} onClick={onCopyURLCallback}>
          {i18n.popoverContentCopyURL}
        </Link>
      ) : (
        <Container className={css.copySuccess}>
          <Icon name="deployment-success-new" size={11} />
          <Text>URL Copied!</Text>
        </Container>
      )}
    </Container>
  )
}

function IconHeading(): JSX.Element {
  const popoverContent = <ShareLinkPopoverContent />
  return (
    <Container flex>
      <Container flex className={css.iconContainer}>
        <Icon name="service-jira" className={css.logo} />
        <Text>{i18n.heading.jira}</Text>
      </Container>
      <Container className={css.iconContainer}>
        <Popover {...ShareContentPopoverProps} content={popoverContent}>
          <Container flex>
            <Icon name="main-share" className={css.logo} />
            <Text>{i18n.heading.share}</Text>
          </Container>
        </Popover>
      </Container>
    </Container>
  )
}

export default function LogAnalysisRiskAndJiraModal(props: MetricsVerificationModalProps): JSX.Element {
  const {
    endTime = new Date().getTime(),
    startTime = new Date().getTime() - 15000,
    onHide,
    service,
    activityType,
    activityIdentifier,
    count,
    trendData,
    environment,
    logMessage
  } = props
  const [isOpen, setOpen] = useState(true)
  const onHideCallback = useCallback(() => {
    setOpen(false)
    onHide()
  }, [onHide])
  return (
    <Drawer {...DrawerProps} isOpen={isOpen} onClose={onHideCallback} className={css.main}>
      <Container className={css.headingContainer}>
        <Heading level={2} color={Color.BLACK}>
          {activityType}
        </Heading>
        <IconHeading />
      </Container>
      <Text color={Color.BLACK} className={css.verificationPeriod}>
        {i18n.subHeading.verificationPeriod}
      </Text>
      <StartAndEndTimeText startTime={startTime} endTime={endTime} />
      <Container className={css.activityContainer}>
        <DataNameAndData dataName={i18n.contentDescription.activityIdentifier} data={activityIdentifier} />
        <DataNameAndData dataName={i18n.contentDescription.environment} data={environment} />
        <DataNameAndData dataName={i18n.contentDescription.services} data={service} />
        <DataNameAndData dataName={i18n.contentDescription.count} data={count} />
        <Container className={css.trendChart}>
          <Text color={Color.BLACK}>{i18n.contentDescription.trend}</Text>
          <Container className={css.chartContainer}>
            <HighchartsReact highchart={Highcharts} options={trendData} />
          </Container>
        </Container>
      </Container>
      <RiskAndMessageForm logMessage={logMessage} onHide={onHideCallback} />
    </Drawer>
  )
}
