# Logging

`logging` is a Framework's sub-module to allow logging UI issues directly to a live server (Bugsnag is used at the moment). The idea of live logging is not to serve developers' debugging purposes, but to monitor Harness business transations in realtime so we can act quickly and proactively when something wrong happens.

## Interface

```js
type LogFunction = (message: string, obj?: object) => void

interface Logger {
  error: LogFunction
  warn: LogFunction
  info: LogFunction
  debug: LogFunction
}
```

## Usage

Module obtains a logger from Framework usinng Framework's `loggerFor` builder.

```js
import { loggerFor, ModuleName } from 'framework'

// Obtains a logger for CV module
const logger = loggerFor(ModuleName.CV)

// `loggerFor` support a second optional sub-module name parameter. For example:
// const logger = loggerFor(ModuleName.CV, 'NewRelicSetup')

// Then at some place you want to log an error with an
// errorDetails object
logger.error('Something wrong just happened', errorDetails)
```
