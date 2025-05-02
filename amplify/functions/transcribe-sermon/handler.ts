import { S3Event } from 'aws-lambda';
import { TranscribeClient, StartTranscriptionJobCommand } from '@aws-sdk/client-transcribe';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const transcribeClient = new TranscribeClient({ region: process.env.REGION });
const dynamoClient = new DynamoDBClient({ region: process.env.REGION });

export const handler = async (event: S3Event) => {
  for (const record of event.Records) {
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
    if (!key.startsWith('sermons/') || !/\.(mp3|mp4|wav|flac)$/i.test(key)) {
      console.log(`Skipping ${key}: not a supported audio/video file`);
      continue;
    }

    const jobName = `transcribe-${key.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`;
    const params = {
      TranscriptionJobName: jobName,
      LanguageCode: 'en-US',
      Media: {
        MediaFileUri: `s3://${process.env.BUCKET_NAME}/${key}`,
      },
      OutputBucketName: process.env.BUCKET_NAME,
      OutputKey: `transcripts/${key}.json`,
    };

    try {
      await transcribeClient.send(new StartTranscriptionJobCommand(params));
      console.log(`Started transcription job ${jobName} for ${key}`);

      // Store initial job status in DynamoDB
      await dynamoClient.send(new PutItemCommand({
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
          sermonId: { S: key },
          transcriptionJobName: { S: jobName },
          status: { S: 'STARTED' },
          uploadTimestamp: { N: Math.floor(Date.now() / 1000).toString() },
        },
      }));
      console.log(`Stored job status for ${key} in DynamoDB`);
    } catch (error) {
      console.error(`Error processing ${key}:`, error);
      throw error;
    }
  }
};
