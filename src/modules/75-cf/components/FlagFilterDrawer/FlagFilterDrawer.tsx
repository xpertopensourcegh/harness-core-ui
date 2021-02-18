import React, { useState } from 'react'
import {
  Formik,
  FormikForm as Form,
  FormInput,
  Layout,
  Button,
  FlexExpander,
  Radio,
  RadioGroup,
  Text,
  Color,
  DateInput
} from '@wings-software/uicore'
import i18n from './FlagFilterDrawer.i18n'
import css from './FlagFilterDrawer.module.scss'

// TODO: Check these ...SelectOptions fields
const envSelectOptions = [
  { label: 'Production', value: 'production' },
  { label: 'Development', value: 'development' }
]

const termSelectOptions = [
  { label: 'Temporary', value: 'temporary' },
  { label: 'Permanent', value: 'Permanent' }
]

const switchSelectOptions = [
  { label: 'On', value: 'on' },
  { label: 'Off', value: 'off' }
]

const statusSelectOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Live', value: 'live' },
  { label: 'Never Requested', value: 'neverRequested' },
  { label: 'Archived', value: 'archived' }
]

interface FlagFilterDrawerProps {
  isSaveFiltersOn: boolean
  setIsSaveFiltersOn: (param: boolean) => void
}

const FlagFilterDrawer: React.FC<FlagFilterDrawerProps> = props => {
  const { isSaveFiltersOn, setIsSaveFiltersOn } = props
  const [isBtnsFilterDisabled, setIsBtnsFilterDisabled] = useState(true)

  const onChangeOwner = (itemsArray: unknown[]): void => {
    itemsArray.length > 0 ? setIsBtnsFilterDisabled(false) : setIsBtnsFilterDisabled(true)
  }

  const onBtnSaveFilter = (saveOrApplyFilter: boolean): void => {
    setIsSaveFiltersOn(saveOrApplyFilter)
  }

  const fncNewFilter = (): JSX.Element => {
    return (
      <Formik
        initialValues={{}}
        onSubmit={vals => {
          alert(JSON.stringify(vals, null, 2))
        }}
      >
        {() => (
          <Form>
            <Layout.Vertical padding="large" height="100%">
              <FormInput.Select
                name="env"
                items={envSelectOptions}
                label={i18n.environment}
                placeholder={i18n.envDefault}
              />

              <Layout.Horizontal flex>
                <FormInput.Select name="term" items={termSelectOptions} label={i18n.term} placeholder={i18n.any} />

                <FormInput.Select
                  name="switch"
                  items={switchSelectOptions}
                  label={i18n.switchOnOff}
                  placeholder={i18n.any}
                />

                <FormInput.Select
                  name="status"
                  items={statusSelectOptions}
                  label={i18n.status}
                  placeholder={i18n.any}
                />
              </Layout.Horizontal>

              {/* TODO: Check the UIKit for some alternative, it doesn't render nicely inside Drawer */}
              <Layout.Horizontal margin={{ top: 'medium', bottom: 'medium' }}>
                <DateInput placeholder={i18n.any} />
                <FlexExpander />
                <DateInput placeholder={i18n.any} />
              </Layout.Horizontal>

              <FormInput.TagInput
                name="owner"
                label={i18n.owner}
                items={['placeholder1', 'placeholder2']}
                labelFor={nameIcon => nameIcon as string}
                itemFromNewTag={newTag => newTag}
                tagInputProps={{
                  allowNewTag: true,
                  placeholder: i18n.ownerOrPinPlaceholder
                }}
                onChange={items => onChangeOwner(items)}
              />

              <FormInput.Text name="creator" placeholder={i18n.creatorPlaceholder} label={i18n.creator} />

              <FormInput.TagInput
                name="tags"
                label={i18n.tags}
                items={['placeholder1', 'placeholder2']}
                labelFor={nameIcon => nameIcon as string}
                itemFromNewTag={newTag => newTag}
                tagInputProps={{
                  allowNewTag: true,
                  placeholder: i18n.tagsPlaceholder
                }}
              />

              <FormInput.Text name="pinnedBy" placeholder={i18n.ownerOrPinPlaceholder} label={i18n.flagsBy} />

              <FormInput.Text name="target" placeholder={i18n.individualTargets} label={i18n.target} />

              <FlexExpander />

              <Layout.Horizontal className={css.flagFilterBtns}>
                <Button
                  type="submit"
                  intent="primary"
                  text={i18n.apply.toUpperCase()}
                  margin={{ right: 'medium' }}
                  disabled={isBtnsFilterDisabled}
                />
                <Button
                  minimal
                  text={i18n.saveFilters}
                  disabled={isBtnsFilterDisabled}
                  onClick={() => onBtnSaveFilter(true)}
                />
              </Layout.Horizontal>
            </Layout.Vertical>
          </Form>
        )}
      </Formik>
    )
  }

  const fncSaveFilter = (): JSX.Element => {
    return (
      <Formik initialValues={{}} onSubmit={vals => alert(JSON.stringify(vals, null, 2))}>
        {() => (
          <Form>
            <Layout.Vertical height="100%" padding="large" className={css.saveFilterContainer}>
              <RadioGroup name="radioGroupOne">
                <Layout.Horizontal>
                  <Radio name="radioProp" label={i18n.overwriteRadio} font={{ weight: 'bold' }} width="35%" />
                  <FormInput.Text name="overwriteExisting" style={{ width: '45%' }} />
                </Layout.Horizontal>

                <Layout.Horizontal>
                  <Radio name="radioProp" label={i18n.createFilter} font={{ weight: 'bold' }} width="35%" />
                  <FormInput.Text name="createNew" style={{ width: '45%' }} />
                </Layout.Horizontal>
              </RadioGroup>

              <FormInput.CheckBox name="defaultFilter" disabled defaultChecked label={i18n.defaultFilter} />
              <Text>{i18n.defaultFilterText}</Text>

              <RadioGroup name="radioGroupTwo">
                <Text color={Color.BLACK}>{i18n.filterVisible}</Text>
                <Layout.Vertical>
                  <Radio name="radioPropVisible" label={i18n.onlyMe} />
                  <Radio name="radioPropVisible" label={i18n.everyone} />
                </Layout.Vertical>
              </RadioGroup>

              <Layout.Horizontal flex className={css.flagFilterBtns}>
                <Button type="submit" intent="primary" text={i18n.save.toUpperCase()} margin={{ right: 'medium' }} />
                <Button
                  minimal
                  text={i18n.cancel}
                  disabled={isBtnsFilterDisabled}
                  onClick={() => onBtnSaveFilter(false)}
                />
              </Layout.Horizontal>
            </Layout.Vertical>
          </Form>
        )}
      </Formik>
    )
  }

  return <>{isSaveFiltersOn ? fncSaveFilter() : fncNewFilter()}</>
}

export default FlagFilterDrawer
