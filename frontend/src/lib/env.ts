import Constants from 'expo-constants';

const ENV = (Constants.expoConfig?.extra as any) || {};
export const API_URL = process.env.API_URL || ENV.API_URL || 'http://localhost:4000/graphql';
export const WS_URL = process.env.WS_URL || ENV.WS_URL || 'http://localhost:4000';
export const DEFAULT_TOKEN = process.env.DEFAULT_TOKEN || ENV.DEFAULT_TOKEN || '';
