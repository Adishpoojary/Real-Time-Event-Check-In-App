import { GraphQLClient, gql } from 'graphql-request';
import { API_URL } from './env';
import { useAuthStore } from '../store/auth';

export const getClient = () => {
  const token = useAuthStore.getState().token;
  return new GraphQLClient(API_URL, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

export const Queries = {
  EVENTS: gql`query Events { events { id name location startTime attendees { id name email } } }`,
  ME: gql`query Me { me { id name email } }`,
};

export const Mutations = {
  JOIN: gql`mutation Join($eventId: ID!) { joinEvent(eventId: $eventId) { id name attendees { id name email } } }`,
};
