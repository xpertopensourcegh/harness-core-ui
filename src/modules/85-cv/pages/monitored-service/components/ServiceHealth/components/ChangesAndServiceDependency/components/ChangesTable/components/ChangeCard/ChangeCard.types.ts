import type { ChangeEventDTO } from 'services/cv'

export interface ChangeInfoData {
  triggerAt: string
  summary: {
    priority: string
    assignee: { name: string; url?: string }
    urgency: string
    policy: { name: string; url?: string }
  }
}

export interface ChangeDetailsDataInterface {
  type: ChangeEventDTO['type']
  category: ChangeEventDTO['category']
  status?: ChangeEventDTO['metadata']['status']
  details: {
    service: { name: string; url?: string }
    environment: { name: string; url?: string }
    source: { name: ChangeEventDTO['type']; url?: string }
  }
}

export interface ChangeTitleData {
  name: string | undefined
  type: ChangeEventDTO['type']
  executionId: string
}

export interface CustomChangeEventDTO extends ChangeEventDTO {
  id?: string
}
