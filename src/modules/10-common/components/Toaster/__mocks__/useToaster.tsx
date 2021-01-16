export function useToaster() {
  return {
    showError: jest.fn(),
    showSuccess: jest.fn(),
    showWarning: jest.fn()
  }
}
