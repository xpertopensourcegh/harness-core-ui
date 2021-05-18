import type { Provider } from './components/COCreateGateway/models'

export const allProviders: Provider[] = [
  {
    name: 'AWS',
    value: 'aws',
    icon: 'service-aws'
  },
  {
    name: 'Azure',
    value: 'azure',
    icon: 'service-azure'
  }
  // {
  //   name: 'Digital Ocean',
  //   value: 'do',
  //   icon: 'harness'
  // }
]

export enum PROVIDER_TYPES {
  AWS = 'aws',
  AZURE = 'azure',
  DIGITAL_OCEAN = 'do'
}
