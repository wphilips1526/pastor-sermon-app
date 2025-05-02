import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  name: 'pastorSermonAuth',
  loginWith: {
    email: true,
  },
});
