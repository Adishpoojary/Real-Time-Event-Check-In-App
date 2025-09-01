import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getClient, Queries } from '../lib/graphql';

export default function EventListScreen({ navigation }: any) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const client = getClient();
      const res = await client.request(Queries.EVENTS);
      return res.events;
    }
  });

  if (isLoading) return <View style={styles.center}><Text>Loading...</Text></View>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={data || []}
        keyExtractor={(item) => item.id}
        onRefresh={() => refetch()}
        refreshing={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('EventDetail', { eventId: item.id, event: item })}
            style={styles.card}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.location} • {new Date(item.startTime).toLocaleString()}</Text>
            <Text style={styles.small}>{item.attendees?.length || 0} joined</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginBottom: 12, backgroundColor: 'white' },
  name: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  small: { color: '#666', marginTop: 6 }
});
