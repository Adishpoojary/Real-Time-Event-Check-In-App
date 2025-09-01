import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import io from 'socket.io-client';
import { WS_URL } from '../lib/env';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getClient, Mutations, Queries } from '../lib/graphql';

export default function EventDetailScreen({ route }: any) {
  const { eventId } = route.params;
  const queryClient = useQueryClient();
  const [attendees, setAttendees] = useState<any[]>([]);

  const { data } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const client = getClient();
      const res = await client.request(Queries.EVENTS);
      return res.events;
    }
  });

  const current = useMemo(() => (data || []).find((e: any) => e.id === eventId), [data, eventId]);

  useEffect(() => {
    if (current?.attendees) setAttendees(current.attendees);
  }, [current?.attendees]);

  useEffect(() => {
    const socket = io(WS_URL, { transports: ['websocket'] });
    socket.emit('joinEventRoom', { eventId });
    socket.on('attendeeUpdate', (payload: any) => {
      if (payload?.eventId === eventId) setAttendees(payload.attendees || []);
    });
    return () => socket.disconnect();
  }, [eventId]);

  const joinMutation = useMutation({
    mutationFn: async () => {
      const client = getClient();
      const res = await client.request(Mutations.JOIN, { eventId });
      return res.joinEvent;
    },
    onSuccess: () => {
      // refetch events to keep global cache fresh
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });

  if (!current) return <View style={styles.center}><Text>Event not found</Text></View>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.title}>{current.name}</Text>
      <Text style={{ marginBottom: 12 }}>{current.location} • {new Date(current.startTime).toLocaleString()}</Text>
      <Button title="Join" onPress={() => joinMutation.mutate()} />
      <Text style={styles.subtitle}>Attendees ({attendees.length})</Text>
      <FlatList
        data={attendees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.avatar}><Text>{item.name?.[0] || '?'}</Text></View>
            <View><Text style={styles.name}>{item.name}</Text><Text style={styles.email}>{item.email}</Text></View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { marginTop: 16, fontSize: 16, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '600' },
  email: { color: '#666' }
});
