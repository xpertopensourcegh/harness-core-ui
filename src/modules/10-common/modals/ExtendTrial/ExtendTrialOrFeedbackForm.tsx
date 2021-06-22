import React from 'react'
import {
  Formik,
  FormikForm,
  Heading,
  Container,
  Text,
  Layout,
  Button,
  FormInput,
  Color,
  Tag
} from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import css from './useExtendTrialOrFeedbackModal.module.scss'

export interface FeedbackFormValues {
  experience?: string
  suggestion?: string
}

interface FeedBackFormProps {
  moduleDescription: string
  onCloseModal: () => void
  onSubmit: (values: FeedbackFormValues) => void
}

interface ExtendTrialFormProps {
  expiryDateStr: string
  moduleDescription: string
  onCloseModal: () => void
  onSubmit: (values: FeedbackFormValues) => void
}

const enum EXPERIENCE {
  USEFUL = 'useful',
  NEEDMORE = 'need_more',
  IMPROVE = 'improve'
}

const Feedback = ({ moduleDescription }: { moduleDescription: string }): React.ReactElement => {
  const { getString } = useStrings()
  return (
    <Container padding={{ bottom: 'large' }}>
      <FormInput.RadioGroup
        className={css.experience}
        name="experience"
        label={getString('common.extendTrial.feedback.ifUseful', { moduleDescription: moduleDescription })}
        items={[
          {
            label: getString('common.extendTrial.feedback.answers.useful'),
            value: EXPERIENCE.USEFUL
          },
          {
            label: getString('common.extendTrial.feedback.answers.needMore'),
            value: EXPERIENCE.NEEDMORE
          },
          {
            label: getString('common.extendTrial.feedback.answers.improve'),
            value: EXPERIENCE.IMPROVE
          }
        ]}
      />
      <FormInput.TextArea
        className={css.suggestion}
        name="suggestion"
        label={getString('common.extendTrial.feedback.suggestion', { moduleDescription: moduleDescription })}
      />
    </Container>
  )
}

const Footer = ({ onCloseModal }: { onCloseModal: () => void }): React.ReactElement => {
  const { getString } = useStrings()
  return (
    <Layout.Horizontal spacing="medium">
      <Button intent="primary" text={getString('submit')} type="submit" />
      <Button
        intent="none"
        text={getString('common.extendTrial.doItLater')}
        type="reset"
        onClick={() => onCloseModal()}
      />
    </Layout.Horizontal>
  )
}

export const FeedBackForm: React.FC<FeedBackFormProps> = ({ onCloseModal, onSubmit, moduleDescription }) => {
  const { getString } = useStrings()
  return (
    <Formik
      initialValues={{
        experience: '',
        suggestion: ''
      }}
      onSubmit={onSubmit}
      formName="feedbackForm"
    >
      <FormikForm>
        <Heading color={Color.BLACK} font={{ size: 'large', weight: 'bold' }} padding={{ bottom: 'large' }}>
          {`${moduleDescription} ${getString('common.extendTrial.feedback.title')}`}
        </Heading>
        <Feedback moduleDescription={moduleDescription} />
        <Footer onCloseModal={onCloseModal} />
      </FormikForm>
    </Formik>
  )
}

export const ExtendTrialForm: React.FC<ExtendTrialFormProps> = ({
  expiryDateStr,
  onCloseModal,
  onSubmit,
  moduleDescription
}) => {
  const { getString } = useStrings()
  return (
    <Formik
      initialValues={{
        experience: '',
        suggestion: ''
      }}
      onSubmit={onSubmit}
      formName="extendTrialForm"
    >
      <FormikForm>
        <Heading color={Color.BLACK} font={{ size: 'large', weight: 'bold' }} padding={{ bottom: 'large' }}>
          {getString('common.extendTrial.heading')}
        </Heading>
        <Tag round className={css.tag}>
          {getString('common.trialInProgress')}
        </Tag>
        <Text padding={{ top: 'small', bottom: 'large' }} className={css.description}>
          {getString('common.extendTrial.description')}
        </Text>
        <Layout.Horizontal padding={{ bottom: 'large' }}>
          <Text padding={{ right: 'small' }}>{`${getString('common.extendTrial.expiryDate')}:`}</Text>
          <Text color={Color.BLACK}>{expiryDateStr}</Text>
        </Layout.Horizontal>
        <Feedback moduleDescription={moduleDescription} />
        <Footer onCloseModal={onCloseModal} />
      </FormikForm>
    </Formik>
  )
}
