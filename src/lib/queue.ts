import { Queue, Worker, type Processor, type WorkerOptions, type QueueOptions } from 'bullmq'
import { createRedisConnection } from '@/lib/redis'

const defaultQueueOptions: Partial<QueueOptions> = {
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
  },
}

const defaultWorkerOptions: Partial<WorkerOptions> = {
  concurrency: 5,
}

export function createQueue<T>(name: string, opts?: Partial<QueueOptions>): Queue<T> {
  return new Queue<T>(name, {
    ...defaultQueueOptions,
    ...opts,
    connection: createRedisConnection(),
  })
}

export function createWorker<T>(
  name: string,
  processor: Processor<T>,
  opts?: Partial<WorkerOptions>,
): Worker<T> {
  return new Worker<T>(name, processor, {
    ...defaultWorkerOptions,
    ...opts,
    connection: createRedisConnection(),
  })
}
