import {
  getCPUValueInReadableForm,
  getMemValueInReadableForm,
  getMemValueInReadableFormForChart,
  getCPUValueInmCPUs,
  getMemValueInGB
} from '../formatResourceValue'

import { convertNumberToFixedDecimalPlaces } from '../convertNumberToFixedDecimalPlaces'

import formatCost from '../formatCost'

describe('test cases for recommendation utils', () => {
  test('test cases for CPU value formatter', () => {
    expect(getCPUValueInReadableForm(0.01)).toBe('10m')
    expect(getCPUValueInReadableForm(10)).toBe('10')
  })

  test('test cases for Memory value formatter', () => {
    expect(getMemValueInReadableForm(1000000000)).toBe('1000Mi')
    expect(getMemValueInReadableForm(100000000)).toBe('100Mi')
    expect(getMemValueInReadableForm(1000000)).toBe('1Mi')
    expect(getMemValueInReadableForm(4200000000)).toBe('4.2Gi')
  })

  test('test cases for converting number to fix decimal places', () => {
    expect(convertNumberToFixedDecimalPlaces('10.32324', 2)).toBe(10.32)
    expect(convertNumberToFixedDecimalPlaces(78.3232324, 2)).toBe(78.32)
  })

  test('test cases for getting mem value in GBs', () => {
    expect(getMemValueInGB(1000000000)).toBe('1Gi')
    expect(getMemValueInGB(100000000)).toBe('0.1Gi')
  })

  test('test cases for getting cpu values in mCPUs', () => {
    expect(getCPUValueInmCPUs(1)).toBe('1000')
    expect(getCPUValueInmCPUs(0.001)).toBe('1')
  })

  test('get mem in readable format for chart', () => {
    expect(getMemValueInReadableFormForChart(100000000)).toBe('100.00Mi')
    expect(getMemValueInReadableFormForChart(1000000)).toBe('1.00Mi')
  })
})

describe('test cases for formatcost', () => {
  test('should be able to render cost correctly', () => {
    expect(formatCost(20)).toBe('$20.00')
  })
})
