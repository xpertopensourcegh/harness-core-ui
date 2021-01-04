export const renderFailureRate = (failureRate: number): number => {
  let scale = 1
  let value = failureRate

  if (failureRate === 0 || Math.round(failureRate * 100) > 0) {
    return Math.round(failureRate * 100)
  }

  while (value < 10) {
    scale *= 10
    value *= 10
  }

  return Math.round(value) / scale
}

export const SortByKey = {
  FAILURE_RATE: 'fail_pct',
  FAILED_TESTS: 'failed_tests',
  PASSED_TESTS: 'passed_tests',
  SKIPPED_TESTS: 'skipped_tests',
  DURATION_MS: 'duration_ms',
  TOTAL_TESTS: 'total_tests'
}

export const TestStatus = {
  PASSED: 'passed',
  SKIPPED: 'skipped',
  ERROR: 'error',
  FAILED: 'failed'
}
