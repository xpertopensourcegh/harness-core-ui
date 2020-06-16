# Services

This folder contains swagger specs and auto-generated code for services.

Each sub-folder consists the following files:

- `index.tsx`: The auto-generated code.
- `overrides.yaml`: File for providing overrides in swagger as they are not 100% compliant with the spec.

## Overrides

`overrides.yaml` has the following structure

| key                  | value type               | description                                                                                                                                                                                                                                                                 |
| -------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| allowpaths           | `string[]`               | List of paths for which the service code should be generated. You can provide `*` for all paths. The rationale behind this that, for some services, we have hundreds of paths and we might not be using all of them.                                                        |
| operationIdOverrides | `Record<string, string>` | A map for overriding `operationId` for an operation. The key is "path" and "operation" joined by a `.` (dot). Example. If you want to override the `operationId` for `get` for the path `/projects`, the key must be `/projects.get`. The value must be the override value. |
