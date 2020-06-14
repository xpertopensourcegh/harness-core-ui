export const connector = {
  name: 'Kubernetes connector',
  description: 'This is description',
  identifier: 'kubernetesidentifier',
  tags: ['Tag1', 'Tag2'],
  delegateMode: 'delegateMode',
  credentialType: 'MANUAL_CREDENTIALS',
  credential: {
    masterUrl: 'https://10.24.56.123',
    manualCredentialType: 'USER_PASSWORD',
    manualCredentials: {
      userName: 'deepak.patankar',
      encryptedPassword: 'avchjudjfaywonudahdu'
    }
  }
}
