import React from 'react'
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
        {() => (
          <Form>
            <Container className={css.aboutFlagContainer}>
              <Text color={Color.BLACK} font={{ size: 'medium', weight: 'bold' }} margin={{ bottom: 'large' }}>
                {i18n.aboutFlag.aboutFlagHeading.toUpperCase()}
              </Text>
              <Container margin={{ bottom: 'large' }} width="60%">
                <FormInput.InputWithIdentifier
                  inputName="name"
                  idName="identifier"
                  isIdentifierEditable={isEdit ? false : true}
                  inputGroupProps={{ placeholder: i18n.aboutFlag.ffNamePlaceholder }}
                />
              </Container>
              <Container>
                <div className={css.optionalCollapse}>
                  <Collapse {...collapseProps} heading={i18n.descOptional}>
                    <FormInput.TextArea name="description" />
                  </Collapse>
                </div>
                <div className={css.optionalCollapse}>
                  <Collapse {...collapseProps} heading={i18n.aboutFlag.tagsOptional}>
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
              <Container margin={{ top: 'huge' }}>
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
              <Button type="submit" text={i18n.next} className={css.aboutFlagContainerBtn} />
            </Container>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default FlagElemAbout
