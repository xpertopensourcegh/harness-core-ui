export interface KubFormData {
  name?: string
  description?: string
  identifier?: string
  tags?: string[]
  delegateType?: string
  inheritConfigFromDelegate?: string
  masterUrl?: string
  authType?: string
  username?: string
  password?: string
}
