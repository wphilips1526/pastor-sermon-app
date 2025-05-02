mkdir -p amplify/functions/transcribe-sermon
cat << 'EOF' > amplify/functions/transcribe-sermon/resource.ts
import { defineFunction } from '@aws-amplify/backend';

export const transcribeSermon = defineFunction({
  name: 'transcribe-sermon',
  entry: './handler.ts',
  timeoutSeconds: 900,
  memoryMB: 512,
  environment: {
    BUCKET_NAME: 'my-sermon-app13ea2-dev',
    DYNAMODB_TABLE: 'SermonStyleAnalysis',
    REGION: 'us-east-1',
  },
});
EOF