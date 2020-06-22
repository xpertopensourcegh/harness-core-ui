# Services

This folder contains swagger specs and auto-generated code for services. We are using [`restful-react`](https://github.com/contiamo/restful-react).

Each sub-folder consists the following files:

- `index.tsx`: The auto-generated code.
- `overrides.yaml`: File for providing overrides in swagger as they are not 100% compliant with the spec.

## Generating/Updating Services

Run `yarn services` to generate the services.

More to come...

## Overrides

`overrides.yaml` has the following structure

| key                  | value type               | description                                                                                                                                                                                                                                                                                                     |
| -------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| allowpaths           | `string[]`               | List of paths for which the service code should be generated. This must have the same value as the the key form the `paths` object from `swaggerr.json`. You can provide `*` for all paths. The rationale behind this that, for some services, we have hundreds of paths and we might not be using all of them. |
| operationIdOverrides | `Record<string, string>` | A map for overriding `operationId` for an operation. The key is "path" and "operation" joined by a `.` (dot). Example. If you want to override the `operationId` for `get` for the path `/projects`, the key must be `/projects.get`. The value must be the override value.                                     |

## Using a service

### Fetching data (GET)

```tsx
// For which service to use see FAQs > How do I look up a service?
import { useGetProject } from 'services/cd-ng'

function MyComponent() {
  /**
   * By using this hook, the API call is triggered automatically on mount.
   * Cancellation of in-progress API calls on unmount is handled automatically.
   *
   * The hooks returns the following values:
   * data: The response from the API server. This key is initailized with `null`
   *       and will remain `null` until a valid 2xx response is recieved.
   *       For non-2xx resposnes, the server response will be populated in `error.data`
   *
   * loading : The loading stae of the API. This will be `true` while the data is fetched.
   *           Will change to false once its complete.
   *
   * error: This object is usually null. This is populated only when a non-2xx response is recieved.
   *        `error.data` contains the response object from server.
   *
   * refetch: This can be used to re-trigger the API call manually.
   */
  const { data, loading, error, refetch } = useProject({
    /**
     * Query parameters (as an object) to be passed to the server.
     * The object will be automatically converted to a string.
     * Any change to any value of the object will automatically
     * re-trigger an API call with updated params
     */
    queryParams: {},
    /**
     * Using this flag, you can defer the fetch to a later stage,
     * allowing it to be fetched as a response to an event like the click of a button.
     *
     * This is `false` by default
     */
    lazy: false,
    /**
     * Using this flag, you can debounce the API request.
     * It accepts a number (in ms), a boolean or an object with wait and options as keys.
     *
     * For object param, wait will be a number and options will be
     * options from [lodash's debounce](https://lodash.com/docs/4.17.10#debounce) function
     */
    debounce: false
  })

  return <div>{/* My component logic */}</div>
}
```

### Create/Updating a resource (POST, PUT)

```tsx
// For which service to use see FAQs > How do I look up a service?
import { useCreateProject } from 'services/cd-ng'

function MyComponent() {
  /**
   * Hooks for creating / updating a resource are not called on mount.
   *
   * The hook returns the following properties:
   * mutate: This is a function which will take your request body as an argument.
   *         Calling this function will trigger the API call. If for some reason,
   *         the component is unmounted before the API call is complete, it will be
   *         automatically cancelled.
   * cancel: This is a function which will cancel the current request. This can be used
   *         to cancel a request manually in some cases.
   */
  const { mutate, cancel } = useCreateProject({
    /**
     * Query parameters (as an object) to be passed to the server.
     * The object will be automatically converted to a string.
     * Any change to any value of the object will not automatically
     * re-trigger an API call. It is not recommended to use this.
     * instead use the second argument of mutate method (see below).
     */
    queryParams: {}
  })

  function handleClick() {
    try {
      const response = await mutate(
        {
          /* Request body here */
        },
        {
          /* other options like headers, pathParams, queryParams */
        }
      )
    } catch (e) {
      // handle error here
      // e.data contains server response
    }
  }

  return <div onClick={handleClick}>{/* My component logic */}</div>
}
```

### Deleting a resource (DELETE)

Delete requests are generally of the form `DELETE resource/{resourceId}`. One big difference between `POST/PUT` and `DELETE` in `restful-react` is how it treats the `resourceId` param in case of `DELETE`. It accpets `resourceId` as the first param of `mutate` method. Please take a look at the example below.

```tsx
// For which service to use see FAQs > How do I look up a service?
import { useDeleteProject } from 'services/cd-ng'

function MyComponent() {
  /**
   * Hooks for deleting a resource are not called on mount.
   *
   * This hook also returns same values as for POST/PUT. See above example.
   */
  const { mutate, cancel } = useDeleteProject({})

  function handleClick() {
    try {
      const response = await mutate(
        /* resourceId here */
        {
          /* other options like headers, pathParams, queryParams */
        }
      )
    } catch (e) {
      // handle error here
      // e.data contains server response
    }
  }

  return <div onClick={handleClick}>{/* My component logic */}</div>
}
```

### Polling

see https://github.com/contiamo/restful-react#polling-with-poll

## Best Practices

### GET

- When using a `GET` hook, do not write your own handling logic for refetching data when parameters change. It will automtically do it for you.
- Rename `data` to something meaningful using the object destructuring syntax. Example `{ data: projects } = useGetProjects({})`. This will also be helpful when using multiple hooks.

### POST/POST/DELETE

- Use `queryParams` in the `mutate` method call instead of the hooks call.
- Rename `mutate` to something meaningful using the object destructuring syntax. Example `{ mutate: createProject } = useCreateProject({})` and `{ mutate: deleteProject } = useDeleteProject({})`. This will also be helpful when using multiple hooks.

## FAQs

**How do I look up a service?**
Open the service file (example, `servies/cd-ng/index.ts`) and search by path.

**A service that I'm using has wrong type definitions. What should I do?**

This might happen when you are on an old build and the BE has deployed newer changes. You can rebase with master and try, else generate the services again. See relevent section above.

**A service that I'm using has wrong/confusing name. What should I do?**

This might happen when the BE has not given unique/meaningful names to services. In that case you can use `overrides.yaml` for this. See relevent section above.

**I want to use a service but it is not available. What should I do?**

This might happen due to one of the following reasons:

- You are on an old build. Try rebasing with master or generate services again.
- The service itself is not exposed from the BE. Ask BE to expose it.
- The service is exposed from BE but is not added to `allowpaths` in `overrides.yaml`. Add it to `allowpaths`.
- BE has not provided a unique/meaningful name to service. Either you can ask BE to do that or provide an override in `overrides.yaml`.

**How do I handle errors for POST/PUT calls?**

You can handle errors by wrapping your `mutate` call in a `try/catch` block.

```ts
function handleClick() {
  try {
    const response = await mutate(
      /* resourceId here */
      {
        /* other options like headers, pathParams, queryParams */
      }
    )
  } catch (e) {
    // handle error here
    // e.data contains server response
  }
}
```
