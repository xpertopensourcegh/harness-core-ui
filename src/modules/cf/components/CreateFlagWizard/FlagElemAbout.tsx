import React, { useState } from 'react'
import {
  Color,
  Formik,
  FormikForm as Form,
  FormInput,
  Layout,
  Container,
  StepProps,
  Button,
  Collapse,
  Text
} from '@wings-software/uicore'
import type { FormikProps } from 'formik'
import type { IconName } from '@blueprintjs/core'
import * as Yup from 'yup'
import { illegalIdentifiers } from '@common/utils/StringUtils'
import i18n from './FlagWizard.i18n'
import css from './FlagElemAbout.module.scss'

const collapseProps = {
  collapsedIcon: 'plus' as IconName,
  expandedIcon: 'minus' as IconName,
  isOpen: false,
  isRemovable: false
}

type AboutFormProps = FormikProps<any> & { isEdit: boolean }
const AboutForm: React.FC<AboutFormProps> = props => {
  const [descOpened, setDescOpened] = useState<boolean>(Boolean(props.values.description.length))
  const [tagsOpened, setTagsOpened] = useState<boolean>(Boolean(props.values.tags.length))
  return (
    <Form>
      <Container className={css.aboutFlagContainer}>
        <Text color={Color.BLACK} font={{ size: 'medium', weight: 'bold' }} margin={{ bottom: 'large' }}>
          {i18n.aboutFlag.aboutFlagHeading.toUpperCase()}
        </Text>
        <Container margin={{ bottom: 'large' }} width="60%">
          <FormInput.InputWithIdentifier
            inputName="name"
            idName="identifier"
            isIdentifierEditable={props.isEdit ? false : true}
            inputGroupProps={{ placeholder: i18n.aboutFlag.ffNamePlaceholder }}
          />
        </Container>
        <Container>
          <div className={css.optionalCollapse}>
            <Collapse
              {...collapseProps}
              onToggleOpen={setDescOpened}
              heading={i18n.descOptional}
              isOpen={Boolean(props.values.description.length) || descOpened}
            >
              <FormInput.TextArea name="description" />
            </Collapse>
          </div>
          <div className={css.optionalCollapse}>
            <Collapse
              {...collapseProps}
              onToggleOpen={setTagsOpened}
              heading={i18n.aboutFlag.tagsOptional}
              isOpen={Boolean(props.values.tags.length) || tagsOpened}
            >
              <FormInput.TagInput
                name="tags"
                label={''}
                items={[]}
                labelFor={nameLabel => nameLabel as string}
                itemFromNewTag={newTag => newTag}
                tagInputProps={{
                  showClearAllButton: true,
                  allowNewTag: true,
                  placeholder: i18n.aboutFlag.tagsPlaceholder
                }}
              />
            </Collapse>
          </div>
        </Container>
        <Container margin={{ top: 'xlarge' }}>
          <Layout.Horizontal>
            <FormInput.CheckBox name="permanent" label={i18n.aboutFlag.permaFlag} />
            <Text
              margin={{ left: 'xsmall' }}
              tooltip={i18n.aboutFlag.permaFlagTooltip}
              tooltipProps={{
                isDark: true,
                portalClassName: css.tooltipAboutFlag
              }}
              inline
            />
          </Layout.Horizontal>
        </Container>
        <Container margin={{ top: 'large' }}>
          <Button text={i18n.next} onClick={() => props.handleSubmit()} />
        </Container>
      </Container>
    </Form>
  )
}

// FIXME: Change any for StepProps
const FlagElemAbout: React.FC<StepProps<any>> = props => {
  const { nextStep, prevStepData } = props
  const isEdit = Boolean(prevStepData)

  return (
    <>
      <Formik
        initialValues={{
          name: '',
          identifier: '',
          description: '',
          tags: [],
          permanent: false,
          ...prevStepData
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required(i18n.aboutFlag.nameRequired),
          identifier: Yup.string()
            .trim()
            .required(i18n.aboutFlag.idRequired)
            .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, i18n.aboutFlag.ffRegex)
            .notOneOf(illegalIdentifiers)
        })}
        onSubmit={vals => {
          nextStep?.({ ...vals })
        }}
      >
        {formikProps => <AboutForm {...formikProps} isEdit={isEdit} />}
      </Formik>
    </>
  )
}

export default FlagElemAbout
