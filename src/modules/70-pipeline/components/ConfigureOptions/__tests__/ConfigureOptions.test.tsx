import React from 'react'
import { render, fireEvent, waitFor, getByText as getByTextBody } from '@testing-library/react'
import { ModalProvider } from '@wings-software/uikit'
import { findDialogContainer } from '@common/utils/testUtils'
import { StringsContext } from 'framework/exports'
import strings from 'strings/strings.en.yaml'
import { ConfigureOptions, ConfigureOptionsProps } from '../ConfigureOptions'

const onChange = jest.fn()
const fetchValuesCalled = jest.fn()

const getProps = (
  value: string,
  type: string | JSX.Element,
  variableName: string,
  isRequired = true,
  defaultValue = '',
  showDefaultField = true,
  showAdvanced = true
): ConfigureOptionsProps => ({
  value,
  isRequired,
  defaultValue,
  variableName,
  type,
  showDefaultField,
  showAdvanced,
  onChange,
  fetchValues: jest.fn().mockImplementation(args => {
    fetchValuesCalled(args)
    return Promise.resolve({})
  })
})

describe('Test ConfigureOptions', () => {
  test('should render configure options', async () => {
    const { container } = render(
      <StringsContext.Provider value={strings}>
        <ModalProvider>
          <ConfigureOptions {...getProps('${input}', 'test', 'var-test')} />
        </ModalProvider>
      </StringsContext.Provider>
    )
    const btn = container.querySelector('#configureOptions')
    fireEvent.click(btn as Element)
    const dialog = findDialogContainer() as HTMLElement
    await waitFor(() => getByTextBody(dialog, 'var-test'))
    expect(dialog).toMatchSnapshot()
  })

  test('test invalid expression error', async () => {
    const { container } = render(
      <StringsContext.Provider value={strings}>
        <ModalProvider>
          <ConfigureOptions {...getProps('', 'test', 'var-test')} />
        </ModalProvider>
      </StringsContext.Provider>
    )
    const btn = container.querySelector('#configureOptions')
    fireEvent.click(btn as Element)
    await waitFor(() => getByTextBody(document.body, 'Not a valid input Expression'))
    expect(getByTextBody(document.body, 'Not a valid input Expression')).toBeTruthy()
  })

  test('test regex expression', async () => {
    onChange.mockReset()
    const { container } = render(
      <StringsContext.Provider value={strings}>
        <ModalProvider>
          <ConfigureOptions {...getProps('${input}.regex(^a$)', 'test', 'var-test')} />
        </ModalProvider>
      </StringsContext.Provider>
    )
    const btn = container.querySelector('#configureOptions')
    fireEvent.click(btn as Element)
    const dialog = findDialogContainer() as HTMLElement
    await waitFor(() => getByTextBody(dialog, 'var-test'))
    expect(dialog).toMatchSnapshot()
    const submitBtn = getByTextBody(dialog, 'Submit')
    fireEvent.click(submitBtn)
    await waitFor(() => expect(onChange).toBeCalledTimes(1))
    expect(onChange).toBeCalledWith('${input}.regex(^a$)', '', true)
  })

  test('test allowed values', async () => {
    onChange.mockReset()
    const { container } = render(
      <StringsContext.Provider value={strings}>
        <ModalProvider>
          <ConfigureOptions
            {...getProps('${input}.allowedValues(abc,xyz)', 'test', 'var-test')}
            showRequiredField={true}
          />
        </ModalProvider>
      </StringsContext.Provider>
    )
    const btn = container.querySelector('#configureOptions')
    fireEvent.click(btn as Element)
    const dialog = findDialogContainer() as HTMLElement
    await waitFor(() => getByTextBody(dialog, 'var-test'))
    expect(dialog).toMatchSnapshot()
    const submitBtn = getByTextBody(dialog, 'Submit')
    fireEvent.click(submitBtn)
    await waitFor(() => expect(onChange).toBeCalledTimes(1))
    expect(onChange).toBeCalledWith('${input}.allowedValues(abc,xyz)', '', true)
  })

  test('test allowed advanced values', async () => {
    onChange.mockReset()
    const { container } = render(
      <StringsContext.Provider value={strings}>
        <ModalProvider>
          <ConfigureOptions
            {...getProps(
              '${input}.allowedValues(jexl(${env.type} == “prod” ? aws1, aws2 : aws3, aws4))',
              'test',
              'var-test'
            )}
            type={<div>Var Test</div>}
            showDefaultField={false}
          />
        </ModalProvider>
      </StringsContext.Provider>
    )
    const btn = container.querySelector('#configureOptions')
    fireEvent.click(btn as Element)
    const dialog = findDialogContainer() as HTMLElement
    await waitFor(() => getByTextBody(dialog, 'var-test'))
    expect(dialog).toMatchSnapshot()
    const submitBtn = getByTextBody(dialog, 'Submit')
    fireEvent.click(submitBtn)
    await waitFor(() => expect(onChange).toBeCalledTimes(1))
    expect(onChange).toBeCalledWith(
      '${input}.allowedValues(jexl(${env.type} == “prod” ? aws1, aws2 : aws3, aws4))',
      '',
      true
    )
  })

  test('test dialog open and close', async () => {
    onChange.mockReset()
    const { container } = render(
      <StringsContext.Provider value={strings}>
        <ModalProvider>
          <ConfigureOptions {...getProps('${input}', 'test', 'var-test')} />
        </ModalProvider>
      </StringsContext.Provider>
    )
    const btn = container.querySelector('#configureOptions')
    fireEvent.click(btn as Element)
    const dialog = findDialogContainer() as HTMLElement
    await waitFor(() => getByTextBody(dialog, 'var-test'))
    const closeBtn = dialog.querySelector('[icon="small-cross"]')
    fireEvent.click(closeBtn!)
    await waitFor(() => expect(onChange).toBeCalledTimes(1))
    expect(onChange).toBeCalled()
  })

  test('test dialog open and cancel btn', async () => {
    onChange.mockReset()
    const { container } = render(
      <StringsContext.Provider value={strings}>
        <ModalProvider>
          <ConfigureOptions {...getProps('${input}', 'test', 'var-test')} fetchValues={undefined} />
        </ModalProvider>
      </StringsContext.Provider>
    )
    const btn = container.querySelector('#configureOptions')
    fireEvent.click(btn as Element)
    const dialog = findDialogContainer() as HTMLElement
    await waitFor(() => getByTextBody(dialog, 'var-test'))
    onChange.mockReset()
    const cancelBtn = getByTextBody(dialog, 'Cancel')
    fireEvent.click(cancelBtn)
    await waitFor(() => expect(onChange).toBeCalledTimes(1))
    expect(onChange).toBeCalled()
  })
})
