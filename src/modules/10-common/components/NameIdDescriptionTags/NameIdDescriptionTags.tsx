import React from 'react'
import { Container, FormInput, Collapse } from '@wings-software/uicore'
import type { InputWithIdentifierProps } from '@wings-software/uicore/dist/components/InputWithIdentifier/InputWithIdentifier'
import { isEmpty } from 'lodash-es'
import type { ITagInputProps } from '@blueprintjs/core'
import cx from 'classnames'
import type { FormikProps } from 'formik'
import { useStrings } from 'framework/exports'
import {
  defaultCollapseProps,
  DescriptionComponentProps,
  DescriptionProps,
  FormikForNameIdDescriptionTags,
  NameIdDescriptionProps,
  NameIdDescriptionTagsDeprecatedProps,
  TagsComponentProps,
  TagsDeprecatedComponentProps
} from './NameIdDescriptionTagsConstants'
import css from './NameIdDescriptionTags.module.scss'

export interface NameIdDescriptionTagsProps {
  identifierProps?: Omit<InputWithIdentifierProps, 'formik'>
  descriptionProps?: DescriptionProps
  tagsProps?: Partial<ITagInputProps>
  formikProps: FormikProps<FormikForNameIdDescriptionTags>
  className?: string
}

interface NameIdProps {
  nameLabel?: string // Strong default preference for "Name" vs. Contextual Name (e.g. "Service Name") unless approved otherwise
  identifierProps?: Omit<InputWithIdentifierProps, 'formik'>
}

const NameId = (props: NameIdProps): JSX.Element => {
  const { identifierProps, nameLabel = 'Name' } = props
  const { getString } = useStrings()
  return <FormInput.InputWithIdentifier inputLabel={nameLabel || getString('name')} {...identifierProps} />
}

const Description = (props: DescriptionComponentProps): JSX.Element => {
  const { descriptionProps, hasValue } = props
  const { getString } = useStrings()
  return (
    <Collapse
      heading={getString('description')}
      isOpen={hasValue ? true : false}
      {...Object.assign(defaultCollapseProps)}
    >
      <FormInput.TextArea name="description" {...descriptionProps} />
    </Collapse>
  )
}

const Tags = (props: TagsComponentProps): JSX.Element => {
  const { tagsProps, hasValue } = props
  const { getString } = useStrings()
  return (
    <Collapse
      heading={getString('tagsLabel')}
      isOpen={hasValue ? true : false}
      {...Object.assign(defaultCollapseProps)}
    >
      <FormInput.KVTagInput name="tags" tagsProps={tagsProps} />
    </Collapse>
  )
}

function TagsDeprecated(props: TagsDeprecatedComponentProps): JSX.Element {
  const { hasValue } = props
  const { getString } = useStrings()
  return (
    <Collapse
      heading={getString('tagsLabel')}
      isOpen={hasValue ? true : false}
      {...Object.assign(defaultCollapseProps)}
    >
      <FormInput.TagInput
        name="tags"
        labelFor={name => (typeof name === 'string' ? name : '')}
        itemFromNewTag={newTag => newTag}
        items={[]}
        tagInputProps={{
          noInputBorder: true,
          openOnKeyDown: false,
          showAddTagButton: true,
          showClearAllButton: true,
          allowNewTag: true
        }}
      />
    </Collapse>
  )
}

export function NameIdDescriptionTags(props: NameIdDescriptionTagsProps): JSX.Element {
  const { className, identifierProps, descriptionProps, tagsProps, formikProps } = props
  return (
    <Container className={cx(css.main, className)}>
      <NameId identifierProps={identifierProps} />
      <Description descriptionProps={descriptionProps} hasValue={!!formikProps?.values.description} />
      <Tags tagsProps={tagsProps} hasValue={!isEmpty(formikProps?.values.tags)} />
    </Container>
  )
}

// Requires verification with existing tags
export function NameIdDescriptionTagsDeprecated<T>(props: NameIdDescriptionTagsDeprecatedProps<T>): JSX.Element {
  const { className, identifierProps, descriptionProps, formikProps } = props
  return (
    <Container className={cx(css.main, className)}>
      <NameId identifierProps={identifierProps} />
      <Description descriptionProps={descriptionProps} hasValue={!!formikProps?.values.description} />
      <TagsDeprecated hasValue={!isEmpty(formikProps?.values.tags)} />
    </Container>
  )
}

export function NameIdDescription(props: NameIdDescriptionProps): JSX.Element {
  const { className, identifierProps, descriptionProps, formikProps } = props
  return (
    <Container className={cx(css.main, className)}>
      <NameId identifierProps={identifierProps} />
      <Description descriptionProps={descriptionProps} hasValue={!!formikProps?.values.description} />
    </Container>
  )
}
