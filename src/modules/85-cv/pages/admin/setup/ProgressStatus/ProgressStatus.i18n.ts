export default {
  heading: 'Your Progress',
  serviceEnvCount: (services: number, env: number) => `You have ${services} services and ${env} environments.`,
  mapServices: 'Map the above services to a monitoring source.',
  serviceUsedInMonitoringSources: (services: number) => `${services} services are used in monitoring sources`,
  servicesUsedInActivitySources: (services: number) => `${services} services are used in activity sources`,
  servicesUndergoingHealthVerification: (services: number) => `${services} services have ongoing health verifications.`
}
