import React, { useState } from 'react'
import { Color, Container, FormInput, Layout, TagInputProps, Text } from '@wings-software/uikit'
import type { InputWithIdentifierProps } from '@wings-software/uikit/dist/components/InputWithIdentifier/InputWithIdentifier'
import cx from 'classnames'
import i18n from './AddDescriptionAndTags.i18n'
import css from './AddDescriptionAndTags.module.scss'

export interface DescriptionAndTagsInputProps<T> {
  formComponent: JSX.Element
  tagInputProps?: TagInputProps<T>
  className?: string
  defaultOpenFields?: string[]
}

export interface AddDescriptionAndTagsWithIdentifier {
  identifierProps: Omit<InputWithIdentifierProps, 'formik'>
  className?: string
  defaultOpenFields?: string[]
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

// Deprecated
export function AddDescriptionAndTags<T>(props: DescriptionAndTagsInputProps<T>): JSX.Element {
  const { formComponent, className, defaultOpenFields = [] } = props
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(defaultOpenFields.includes('description'))
  const [isTagsOpen, setIsTagsOpen] = useState(defaultOpenFields.includes('tags'))
  return (
    <Container className={cx(css.main, className)}>
      <Container className={css.connectorFormNameWrapper}>
        <Container className={css.connectorFormNameElm}>{formComponent}</Container>
        {(!isDescriptionOpen || !isTagsOpen) && (
          <Layout.Vertical spacing="xsmall" style={{ justifyContent: 'center', marginLeft: 'var(--spacing-large)' }}>
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

export function AddDescriptionAndKVTags<T>(props: DescriptionAndTagsInputProps<T>): JSX.Element {
  const { formComponent, className, defaultOpenFields = [] } = props
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(defaultOpenFields.includes('description'))
  const [isTagsOpen, setIsTagsOpen] = useState(defaultOpenFields.includes('tags'))

  return (
    <Container className={cx(css.main, className)}>
      <Container className={css.connectorFormNameWrapper}>
        <Container className={css.connectorFormNameElm}>{formComponent}</Container>
        {(!isDescriptionOpen || !isTagsOpen) && (
          <Layout.Vertical spacing="xsmall" style={{ justifyContent: 'center', marginLeft: 'var(--spacing-large)' }}>
            <AddFieldOption
              label={i18n.addDescriptionLabel}
              onClick={() => setIsDescriptionOpen(true)}
              isOpen={!isDescriptionOpen}
            />
            <AddFieldOption label={i18n.addTagsLabel} onClick={() => setIsTagsOpen(true)} isOpen={!isTagsOpen} />
          </Layout.Vertical>
        )}
      </Container>

      <Container className={css.connectorFormElm}>
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
          <FormInput.KVTagInput
            name="tags"
            label={<FieldLabelWithHideOption onHide={() => setIsTagsOpen(false)} fieldLabel={i18n.tagsLabel} />}
            className="expandedTags"
          />
        )}
      </Container>
    </Container>
  )
}

export function AddDescriptionAndTagsWithIdentifier(props: AddDescriptionAndTagsWithIdentifier): JSX.Element {
  const { identifierProps, ...additionalProps } = props
  return (
    <AddDescriptionAndTags
      {...additionalProps}
      formComponent={<FormInput.InputWithIdentifier {...identifierProps} />}
    />
  )
}

export function AddDescriptionAndKVTagsWithIdentifier(props: AddDescriptionAndTagsWithIdentifier): JSX.Element {
  const { identifierProps, ...additionalProps } = props
  return (
    <AddDescriptionAndKVTags
      {...additionalProps}
      formComponent={<FormInput.InputWithIdentifier {...identifierProps} />}
    />
  )
}
