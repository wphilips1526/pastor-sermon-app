import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { transcribeSermon } from './functions/transcribe-sermon/resource';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3notifications from 'aws-cdk-lib/aws-s3-notifications';

const backend = defineBackend({
  auth,
  data,
  storage,
  transcribeSermon,
});

// Add S3 event trigger
const bucket = backend.storage.resources.bucket as s3.Bucket;
bucket.addEventNotification(
  s3.EventType.OBJECT_CREATED,
  new s3notifications.LambdaDestination(backend.transcribeSermon.resources.lambda),
  { prefix: 'sermons/' }
);

// Grant permissions
backend.transcribeSermon.resources.lambda.addToRolePolicy(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [
      'transcribe:StartTranscriptionJob',
      's3:GetObject',
      's3:PutObject',
      'dynamodb:PutItem',
    ],
    resources: [
      `arn:aws:s3:::my-sermon-app13ea2-dev/*`,
      `arn:aws:dynamodb:us-east-1:736747803139:table/SermonStyleAnalysis`,
    ],
  })
);
