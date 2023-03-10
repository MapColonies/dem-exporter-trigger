import config from 'config';
import { ICreateTaskBody } from '@map-colonies/mc-priority-queue';
import { ITaskParameters } from './interfaces';

export const filesToTasks = (files: string[], taskType: string, tasks: ICreateTaskBody<ITaskParameters>[]): ICreateTaskBody<ITaskParameters>[] => {
  const batchSize = config.get<number>("exporter.batches");
  for (let i = 0; i < files.length; i += batchSize) {
    const parameters: ITaskParameters = { paths: files.slice(i, i + batchSize) };
    const task: ICreateTaskBody<ITaskParameters> = { 
      type: taskType,
      parameters: parameters
    };
    tasks.push(task);
  }
  return tasks;
};