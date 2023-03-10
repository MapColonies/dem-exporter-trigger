import jsLogger from '@map-colonies/js-logger';
import { trace } from '@opentelemetry/api';
import httpStatusCodes from 'http-status-codes';
import { getApp } from '../../../src/app';
import { SERVICES } from '../../../src/common/constants';
import { IJobStatusModel } from '../../../src/status/models/statusManager';
import { StatusRequestSender } from './helpers/requestSender';

describe('export', function () {
  let requestSender: StatusRequestSender;
  beforeEach(function () {
    const app = getApp({
      override: [
        { token: SERVICES.LOGGER, provider: { useValue: jsLogger({ enabled: false }) } },
        { token: SERVICES.TRACER, provider: { useValue: trace.getTracer('testTracer') } },
      ],
      useChild: true,
    });
    requestSender = new StatusRequestSender(app);
  });

  describe('Happy Path', function () {
    it('should return 200 status code and the resource', async function () {
      const response = await requestSender.getStatus();

      expect(response.status).toBe(httpStatusCodes.OK);
      expect(response).toSatisfyApiSpec();

      const resource = response.body as IJobStatusModel;
      expect(resource.kind).toBe('avi');
      expect(resource.isAlive).toBe(false);
    });
  });
  describe('Bad Path', function () {
    // All requests with status code of 400
  });
  describe('Sad Path', function () {
    // All requests with status code 4XX-5XX
  });
});
