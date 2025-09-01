import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/auth';
import { DEFAULT_TOKEN } from '../lib/env';

export default function LoginScreen({ navigation }: any) {
  const { setToken } = useAuthStore();
  const [value, setValue] = useState(DEFAULT_TOKEN);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login (Mock)</Text>
      <TextInput
        placeholder="Paste token here"
        value={value}
        onChangeText={setValue}
        style={styles.input}
        autoCapitalize="none"
      />
      <Button
        title="Continue"
        onPress={() => {
          setToken(value);
          navigation.replace('Events');
        }}
      />
      <Text style={{ marginTop: 16 }}>Try user2: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.user2.signature</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, marginBottom: 12, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12 },
});
