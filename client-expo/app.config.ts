import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  if (process.env.NODE_ENV === 'production') {
    return {
      ...config,
      name: 'client-expo',
      slug: 'client-expo',
      scheme: 'allInOne',
      extra: {
        eas: {
          projectId: '8c92ef7a-0d26-4c3b-9119-6974a42d6904',
        },
        BACK_END_BASE_URL: 'https://allinone.gnanasurya.com',
      },
    };
  }
  return {
    ...config,
    slug: 'all-in-one',
    name: 'all-in-one',
    scheme: 'allInOne',
    android: {
      ...config?.android,
      package: 'com.anonymous.allinone',
    },
    extra: {
      eas: {
        projectId: 'e5461258-4d7a-440b-ac89-eaec09ad5505',
      },
      BACK_END_BASE_URL: 'https://allinone.gnanasurya.com',
    },
  };
};
