mkdir -p amplify/storage
cat << 'EOF' > amplify/storage/resource.ts
import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'sermonStorage',
  access: (allow) => ({
    'sermons/*': [allow.authenticated.to(['read', 'write'])],
    'transcripts/*': [allow.authenticated.to(['read'])],
  }),
});
EOF