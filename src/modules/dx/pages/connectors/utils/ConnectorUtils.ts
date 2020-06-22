import i18n from './ConnectorUtils.i18n'

export const buildKubPayload = (formData: any) => {
  // console.log(formData)
  const savedData = {
    name: formData.name,
    identifier: formData.identifier,
    accountIdentifier: 'Test-account',
    orgIdentifier: 'Devops',
    kind: i18n.K8sCluster,
    spec: {
      masterUrl: formData.masterUrl,
      auth: {
        // kind: ,
        username: 'admin',
        password: 'kube_cluster_password',
        cacert: 'secretRef:kube_cluster_cacert'
      }
    }
  }
  return savedData
}
