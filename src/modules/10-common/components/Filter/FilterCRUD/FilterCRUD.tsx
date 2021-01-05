import React, { useState } from 'react'
import * as Yup from 'yup'
import cx from 'classnames'
import {
  Button,
  Color,
  Formik,
  FormInput,
  Icon,
  Layout,
  FormikForm,
  Label,
  Popover,
  useModalHook
} from '@wings-software/uicore'
import type { FormikProps, FormikErrors } from 'formik'
import { Menu, Classes, Position, PopoverInteractionKind, Dialog, IDialogProps } from '@blueprintjs/core'
import { useStrings } from 'framework/exports'
import type { FilterInterface } from '../Constants'

import css from './FilterCRUD.module.scss'

interface FilterCRUDProps<T> extends Partial<Omit<FormikProps<T>, 'initialValues'>> {
  filters?: T[]
  initialValues: FormikProps<T>['initialValues']
  onSaveOrUpdate: (isUpdate: boolean, data: T) => Promise<void>
  onDelete: (identifier: string) => Promise<void>
  onClose: () => void
  onDuplicate: (name: string) => Promise<void>
}

const FILTER_LIST_MAX_HEIGHT = 56

export const FilterCRUD = <T extends FilterInterface>(props: FilterCRUDProps<T>) => {
  const { filters, initialValues, onSaveOrUpdate, onClose, onDelete, onDuplicate } = props
  const [isEditEnabled, setIsEditEnabled] = useState<boolean>()
  const [isNewFilter, setIsNewFilter] = useState<boolean>(false)
  const [filterInContext, setFilterInContext] = useState<T | null>()
  const { getString } = useStrings()
  const onAddNewFilter = (event: React.MouseEvent<Element, MouseEvent>): void => {
    event.preventDefault()
    event.stopPropagation()
    setIsEditEnabled(true)
    setIsNewFilter(true)
  }

  const confirmDialogProps: IDialogProps = {
    isOpen: true,
    usePortal: true,
    autoFocus: true,
    canEscapeKeyClose: true,
    canOutsideClickClose: true,
    enforceFocus: true,
    style: { width: 500, height: 200 }
  }

  const [showModal, hideModal] = useModalHook(() => {
    const { name, visible } = filterInContext as T
    return (
      <Dialog
        title={getString('filters.confirmDelete')}
        icon="warning-sign"
        {...confirmDialogProps}
        onClose={hideModal}
      >
        <div className={Classes.DIALOG_BODY}>
          {visible === 'OnlyCreator'
            ? getString('filters.deleteFilterForUser')
            : getString('filters.deleteFilterForEveryone')}
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <Button
            intent="primary"
            text={getString('confirm')}
            onClick={() => {
              if (name) {
                onDelete(name)
              }
              hideModal()
            }}
          />
          &nbsp; &nbsp;
          <Button text={getString('cancel')} onClick={hideModal} />
        </div>
      </Dialog>
    )
  }, [filterInContext])

  const renderOptionMenu = (filter: T): JSX.Element => {
    return (
      <Popover interactionKind={PopoverInteractionKind.HOVER} className={Classes.DARK} position={Position.RIGHT_TOP}>
        <Button
          id="filtermenu"
          minimal
          icon="main-more"
          onClick={e => {
            e.stopPropagation()
          }}
        />
        <Menu>
          <Menu.Item
            icon="edit"
            text={getString('edit')}
            className={css.menuItem}
            onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
              event.preventDefault()
              event.stopPropagation()
              setFilterInContext(filter)
              setIsEditEnabled(true)
              setIsNewFilter(false)
            }}
          />
          <Menu.Item
            icon="duplicate"
            text={getString('duplicate')}
            className={css.menuItem}
            onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
              event.preventDefault()
              event.stopPropagation()
              onDuplicate(filter.name)
              setIsEditEnabled(false)
            }}
          />
          <Menu.Item
            icon="trash"
            text={getString('delete')}
            className={css.menuItem}
            onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
              event.preventDefault()
              event.stopPropagation()
              showModal()
              setFilterInContext(filter)
              setIsEditEnabled(false)
            }}
          />
        </Menu>
      </Popover>
    )
  }

  const renderFilter = (filter: T): JSX.Element => {
    const { name, visible } = filter
    return (
      <Layout.Horizontal
        flex
        spacing="small"
        padding={{ right: 'medium' }}
        className={cx(css.filter, { [css.isActive]: name === initialValues?.name || name === filterInContext?.name })}
        key={name}
      >
        <Layout.Horizontal spacing="small" padding={{ top: 'small', left: 'medium', right: 'medium', bottom: 'small' }}>
          {visible === 'OnlyCreator' ? (
            <Icon name="lock" margin={{ left: 'xsmall' }} />
          ) : (
            <span className={css.noElement} />
          )}
          <div className={css.filterLabel}>{name}</div>
        </Layout.Horizontal>
        {renderOptionMenu(filter)}
      </Layout.Horizontal>
    )
  }

  const renderFilterList = (
    submitCount: number,
    errors: FormikErrors<{
      name: string
      visible: T['visible']
    }>
  ): JSX.Element => {
    const errorCount = Object.keys(errors).length
    const needsResize = submitCount > 0 && errorCount > 0
    const resizedHeight = `${FILTER_LIST_MAX_HEIGHT - 2 * errorCount}vh`
    const items = filters?.filter((filter: T) => filter.name).map((filter: T) => renderFilter(filter))
    return (
      <ol
        className={cx(css.filters)}
        style={{ maxHeight: needsResize ? resizedHeight : `${FILTER_LIST_MAX_HEIGHT}vh` }}
      >
        {items}
      </ol>
    )
  }

  const getCRUDOperationLabel = (): string => {
    if (isNewFilter) {
      return getString('save')
    } else if (isEditEnabled) {
      return getString('update')
    }
    return getString('save')
  }

  return (
    <div className={css.main}>
      <Layout.Vertical spacing="large" padding={{ top: 'large', left: 'medium', right: 'small' }}>
        <Layout.Horizontal flex>
          <Layout.Horizontal spacing="small" className={css.layout}>
            <Icon name="ng-filter" size={25} color={Color.WHITE} />
            <span className={css.title}>Filter</span>
          </Layout.Horizontal>
          <Button intent="primary" minimal icon="cross" onClick={onClose} />
        </Layout.Horizontal>
      </Layout.Vertical>
      <Layout.Vertical padding={{ top: 'xlarge' }}>
        <Button
          intent="primary"
          icon="plus"
          text={getString('filters.newFilter')}
          className={css.addNewFilterBtn}
          onClick={onAddNewFilter}
          padding={{ left: 'large' }}
          border={false}
        />
      </Layout.Vertical>
      <Formik
        onSubmit={values => {
          const payload = Object.assign(values, {
            identifier: filterInContext?.identifier
          }) as T
          if (payload?.name && payload?.visible) {
            onSaveOrUpdate(isNewFilter ? false : true, payload)
          }
          setIsEditEnabled(false)
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required(getString('filters.nameRequired')),
          visible: Yup.mixed().oneOf(['OnlyCreator', 'EveryOne']).required(getString('filters.visibilityRequired'))
        })}
        initialValues={isEditEnabled ? { name: '', visible: undefined } : initialValues}
        enableReinitialize={true}
      >
        {formik => {
          return (
            <FormikForm>
              {filters && filters.length > 0 ? renderFilterList(formik?.submitCount, formik?.errors) : null}
              {isEditEnabled ? (
                <Layout.Vertical spacing="large" padding={{ top: 'xlarge', left: 'large', right: 'large' }}>
                  <FormInput.Text
                    name={'name'}
                    label={
                      <Label style={{ fontSize: 'small', color: Color.WHITE, paddingBottom: 'var(--spacing-small)' }}>
                        {getString('filters.name')}
                      </Label>
                    }
                    className={css.filterName}
                    placeholder={getString('filters.typeFilterName')}
                  />
                  <Layout.Vertical spacing={'medium'} margin={{ top: 'large' }}>
                    <Label style={{ fontSize: 'small', color: Color.WHITE }}>{getString('filters.visible')}</Label>
                    <FormInput.RadioGroup
                      inline
                      name="visible"
                      items={[
                        { label: getString('filters.visibileToOnlyMe'), value: 'OnlyCreator' },
                        {
                          label: getString('filters.visibleToEveryone'),
                          value: 'EveryOne'
                        }
                      ]}
                      style={{ display: 'flex', flexDirection: 'column' }}
                      className={css.radioBtns}
                    />
                  </Layout.Vertical>
                  <Layout.Horizontal spacing={'medium'} margin={{ top: 'large' }}>
                    <Button
                      text={getCRUDOperationLabel()}
                      className={css.saveFilterBtn}
                      type="submit"
                      onClick={(event: React.MouseEvent<Element, MouseEvent>) => {
                        event.preventDefault()
                        event.stopPropagation()
                        formik.submitForm()
                      }}
                    />
                    <Button
                      type="reset"
                      intent={'primary'}
                      minimal
                      text={getString('cancel')}
                      className={css.cancelBtn}
                      onClick={(event: React.MouseEvent<Element, MouseEvent>) => {
                        event.preventDefault()
                        event.stopPropagation()
                        if (isEditEnabled) setIsEditEnabled(false)
                        if (isNewFilter) setIsNewFilter(false)
                        setFilterInContext(null)
                      }}
                    />
                  </Layout.Horizontal>
                </Layout.Vertical>
              ) : null}
            </FormikForm>
          )
        }}
      </Formik>
    </div>
  )
}
