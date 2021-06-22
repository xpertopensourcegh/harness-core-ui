import React, { useState } from 'react'
import type { FormikProps } from 'formik'
import { clone, merge } from 'lodash-es'
import type { FormikErrors } from 'formik'

interface DeployStageErrorState {
  errors: FormikErrors<unknown>
  forms: { [key: string]: React.MutableRefObject<FormikProps<unknown> | null>[] }
}

interface FormProps {
  tab: string
  form: React.MutableRefObject<FormikProps<unknown> | null>
}

export interface StageErrorContextInterface {
  state: DeployStageErrorState
  subscribeForm: (formData: FormProps) => void
  unSubscribeForm: (formData: FormProps) => void
  submitFormsForTab: (tab: string) => void
  checkErrorsForTab: (tab: string) => Promise<void>
}

export const StageErrorContext = React.createContext<StageErrorContextInterface>({
  state: {
    errors: {},
    forms: {}
  },
  subscribeForm: () => undefined,
  unSubscribeForm: () => undefined,
  submitFormsForTab: () => undefined,
  checkErrorsForTab: () => new Promise<void>(() => undefined)
})

export interface DeployStageErrorProviderProps {
  children: React.ReactNode
}

export function DeployStageErrorProvider(props: DeployStageErrorProviderProps): React.ReactElement {
  const [state, setState] = useState<DeployStageErrorState>({ errors: {}, forms: {} })
  const subscribeForm = React.useCallback((formData: FormProps): void => {
    setState(prevState => {
      const forms = clone(prevState).forms
      const existingForms = forms[formData.tab]
      if (existingForms) {
        existingForms.push(formData.form)
      } else {
        forms[formData.tab] = [formData.form]
      }
      return { ...prevState, forms }
    })
  }, [])
  const unSubscribeForm = React.useCallback((formData: FormProps) => {
    setState(prevState => {
      const forms = clone(prevState).forms
      const existingForms = forms[formData.tab]
      if (existingForms) {
        const index = existingForms.findIndex(form => form === formData.form)
        existingForms.splice(index, 1)
        if (existingForms.length === 0) delete forms[formData.tab]
        return { ...prevState, forms }
      }
      return { ...prevState }
    })
  }, [])
  const submitFormsForTab = (tab: string) => {
    const forms = state.forms[tab]
    if (!forms) return
    const promises = []
    for (const form of forms) {
      form.current?.submitForm()
      promises.push(form.current?.validateForm())
    }
    Promise.all(promises).then(values => {
      let errors = {}
      values.forEach(value => {
        errors = merge(errors, value)
      })
      setState({ ...state, errors })
    })
  }
  const checkErrorsForTab = (tab: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const forms = state.forms[tab]
      if (!forms) resolve()
      const promises = []
      for (const form of forms) {
        form.current?.submitForm()
        promises.push(form.current?.validateForm())
      }
      Promise.all(promises).then(values => {
        let errors = {}
        let errorsCount = 0
        values.forEach(value => {
          errorsCount += Object.keys(value ?? {}).length
          errors = merge(errors, value)
        })
        setState({ ...state, errors })
        if (errorsCount === 0) resolve()
        reject()
      })
    })
  }
  return (
    <StageErrorContext.Provider value={{ state, subscribeForm, unSubscribeForm, checkErrorsForTab, submitFormsForTab }}>
      {props.children}
    </StageErrorContext.Provider>
  )
}
