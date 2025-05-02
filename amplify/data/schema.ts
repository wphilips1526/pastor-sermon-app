import { a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  SermonStyleAnalysis: a
    .model({
      sermonId: a.string().required(),
      transcriptionJobName: a.string(),
      status: a.string(),
      transcript: a.json(),
      uploadTimestamp: a.integer(),
    })
    .authorization((allow) => [allow.authenticated()]),
});

export const data = defineData({
  schema,
  name: 'SermonStyleAnalysis',
});
