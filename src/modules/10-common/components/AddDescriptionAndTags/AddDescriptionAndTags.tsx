import React, { useState } from 'react'
import { Color, Container, FormInput, Layout, TagInputProps, Text } from '@wings-software/uikit'
import type { InputWithIdentifierProps } from '@wings-software/uikit/dist/components/InputWithIdentifier/InputWithIdentifier'
import cx from 'classnames'
import i18n from './AddDescriptionAndTags.i18n'
import css from './AddDescriptionAndTags.module.scss'

export interface DescriptionAndTagsInputProps {
  formComponent: JSX.Element
  tagInputProps?: TagInputProps<any>
  className?: string
}

export interface NameResourceWithDescriptionAndTagsProps {
  identifierProps: Omit<InputWithIdentifierProps, 'formik'>
}

interface FieldLabelWithHideOptionProps {
  onHide: () => void
  fieldLabel: string
}

interface AddFieldOptionProps {
  onClick: () => void
  label: string
  isOpen: boolean
}

function FieldLabelWithHideOption(props: FieldLabelWithHideOptionProps): JSX.Element {
  const { onHide, fieldLabel } = props
  return (
    <Container className={css.headerRow}>
      <Text inline>{fieldLabel}</Text>
      <Text inline className={css.fieldToggleLabel} onClick={onHide} color={Color.BLUE_500}>
        {i18n.hideInput}
      </Text>
    </Container>
  )
}

function AddFieldOption(props: AddFieldOptionProps): JSX.Element | null {
  const { onClick, label, isOpen } = props
  if (!isOpen) return null
  return (
    <Text className={css.fieldToggleLabel} onClick={onClick} color={Color.BLUE_500}>
      {label}
    </Text>
  )
}

export function AddDescriptionAndTags(props: DescriptionAndTagsInputProps): JSX.Element {
  const { formComponent, className } = props
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
  const [isTagsOpen, setIsTagsOpen] = useState(false)
  return (
    <Container className={cx(css.main, className)}>
      <Container className={css.connectorFormNameWarpper}>
        <Container className={cx(css.connectorFormNameElm)}>{formComponent}</Container>
        {(!isDescriptionOpen || !isTagsOpen) && (
          <Layout.Vertical margin="small" padding={{ left: 'large', top: 'small' }} spacing="xsmall">
            <AddFieldOption
              label={i18n.addDescriptionLabel}
              onClick={() => setIsDescriptionOpen(true)}
              isOpen={!isDescriptionOpen}
            />
            <AddFieldOption label={i18n.addTagsLabel} onClick={() => setIsTagsOpen(true)} isOpen={!isTagsOpen} />
          </Layout.Vertical>
        )}
      </Container>
      {isDescriptionOpen && (
        <FormInput.TextArea
          className={css.expandedDescription}
          name="description"
          label={
            <FieldLabelWithHideOption onHide={() => setIsDescriptionOpen(false)} fieldLabel={i18n.descriptionLabel} />
          }
        />
      )}
      {isTagsOpen && (
        <FormInput.TagInput
          name="tags"
          label={<FieldLabelWithHideOption onHide={() => setIsTagsOpen(false)} fieldLabel={i18n.tagsLabel} />}
          labelFor={name => (typeof name === 'string' ? name : '')}
          itemFromNewTag={newTag => newTag}
          items={[]}
          className="expandedTags"
          tagInputProps={{
            noInputBorder: true,
            openOnKeyDown: false,
            showAddTagButton: true,
            showClearAllButton: true,
            allowNewTag: true
          }}
        />
      )}
    </Container>
  )
}

export function DescriptionAndTagsWithIdentifier(props: NameResourceWithDescriptionAndTagsProps): JSX.Element {
  const { identifierProps } = props
  return <AddDescriptionAndTags formComponent={<FormInput.InputWithIdentifier {...identifierProps} />} />
}
