export type PromiseThunk = (signal: AbortSignal) => Promise<unknown>

export class PQueue {
  private queue: Array<() => void> = []
  private runningCount = 0
  private concurrency = Infinity
  private controller = new AbortController()

  constructor(concurrency?: number) {
    if (typeof concurrency === 'number' && concurrency >= 1) {
      this.concurrency = concurrency
    }
  }

  add(fn: PromiseThunk): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const run = (): void => {
        this.runningCount++
        fn(this.controller.signal).then(
          (value: unknown) => {
            resolve(value)
            this.runningCount--
            this.next()
          },
          (err: Error) => {
            if (err instanceof DOMException && err.name === 'AbortError') {
              // do nothing
            } else {
              reject(err)
            }
            this.runningCount--
            this.next()
          }
        )
      }

      if (this.runningCount < this.concurrency) {
        run()
      } else {
        this.queue.push(run)
      }
    })
  }

  cancel(): void {
    this.controller.abort()
  }

  private next(): void {
    if (this.runningCount >= this.concurrency) {
      return
    }

    if (this.queue.length > 0) {
      const task = this.queue.shift()
      if (task) {
        task()
      }
    }
  }
}
