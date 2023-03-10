import { inject, injectable } from 'tsyringe';
import config from 'config';
import { Logger } from '@map-colonies/js-logger';
import { ICreateTaskBody, JobManagerClient, OperationStatus } from '@map-colonies/mc-priority-queue';
import { SERVICES } from '../common/constants';
import {
  CreateJobBody,
  IJobParameters,
  IExportResponse,
  ITaskParameters,
  JobResponse,
} from '../common/interfaces';
import { filesToTasks } from '../common/utilities';

//this is the job manager api for find job DO NOT MODIFY
interface IFindJob {
  resourceId?: string;
  version?: string;
  isCleaned?: string;
  status?: string;
  type?: string;
  shouldReturnTasks?: string;
  fromDate?: Date;
  tillDate?: Date;
  productType?: string;
}

@injectable()
export class JobManagerWrapper extends JobManagerClient {
  private readonly tilesJobType: string;
  private readonly tilesTaskType: string;
  private readonly expirationDays: number;
  // private readonly jobDomain: string;

  public constructor(@inject(SERVICES.LOGGER) protected readonly logger: Logger) {
    super(
      logger,
      config.get<string>('worker.jobType'),
      config.get<string>('worker.taskType'),
      config.get<string>('jobManager.url')
    );
    this.expirationDays = config.get<number>('jobManager.expirationDays');
    this.tilesJobType = config.get<string>('worker.jobType');
    this.tilesTaskType = config.get<string>('worker.taskType');
    // this.jobDomain = config.get<string>('jobManager.jobDomain');
  }

  public async create(job: CreateJobBody): Promise<IExportResponse> {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + this.expirationDays);
    job.expirationDate = expirationDate;

    const jobResponse = await this.createJob<IJobParameters, ITaskParameters>(job);
    
    const res: IExportResponse = {
      jobID: jobResponse.id,
      status: OperationStatus.IN_PROGRESS
    }

    return res;
  }
}
