import AWS from 'aws-sdk';
import fetch from 'cross-fetch';
import { log, LogLevel } from '@/core/utils/logger.js';
import { AWS_ACCOUNT_ID, REGION, SQS_ENDPOINT } from '../constants.js';

global.fetch = fetch;

const AwsConfig = {
  accessKeyId: 'ASIA6CHE22CV7QUJWQAX',
  accessSecretKey: 'z1ySweITv46WbsKwkb9fcp',
  region: 'ap-south-1',
};
AWS.config.update(AwsConfig);

const client = new AWS.SQS({
  endpoint: SQS_ENDPOINT,
  region: REGION,
});

const QUEUE_URL = `https://${SQS_ENDPOINT}/${AWS_ACCOUNT_ID}/`;

export async function pushToSQS(queueName: string, content: any) {
  try {
    log(`Pushing event to queue ${queueName}.`);
    const result = await client
      .sendMessage({
        QueueUrl: QUEUE_URL + queueName,
        MessageBody: JSON.stringify(content),
        MessageGroupId: 'event',
      })
      .promise();
    log(
      `Successfully published event to SQS. Message ID: ${result.MessageId}`,
      LogLevel.DEBUG,
    );
    return result;
  } catch (err: any) {
    log(`Unable to publish event to SQS. Error: ${err.stack}`);
    throw err;
  }
}

async function handleMessage(
  handlerFunc: (params: any) => any,
  body: any,
): Promise<boolean> {
  try {
    const result = await handlerFunc(JSON.parse(body));
    log(
      `Handling of SQS event completed with result ${JSON.stringify(result)}`,
      LogLevel.INFO,
    );
    return true;
  } catch (error: any) {
    log(
      `Error was found during working on model ${body}\n${error.stack}`,
      LogLevel.DEBUG,
    );
    return false;
  }
}

export async function handleSqsEvent(
  handlerFunc: (params: any) => any,
  event: any,
) {
  const records = event.Records;
  for (let i = 0; i < records.length; i++) {
    /* eslint-disable no-await-in-loop */
    let isSuccess = false;
    while (!isSuccess) {
      isSuccess = await handleMessage(handlerFunc, records[i].body);
    }
  }
}
