import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { api, isUnauthorized } from './api';
import { styles } from './ui';

export default function LookupScreen({ onUnauthorized }) {
  const [term, setTerm] = useState('');
  const [word, setWord] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function search() {
    const q = term.trim();
    if (!q || busy) return;
    setBusy(true);
    setError(null);
    setWord(null);
    try {
      setWord(await api.lookupWord(q));
    } catch (err) {
      if (isUnauthorized(err)) return onUnauthorized?.();
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
        <TextInput
          value={term}
          onChangeText={setTerm}
          onSubmitEditing={search}
          placeholder="Nhập từ tiếng Anh"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          style={[styles.input, { flex: 1, paddingHorizontal: 14, paddingVertical: 12 }]}
        />
        <Pressable
          onPress={search}
          disabled={busy}
          style={{
            backgroundColor: '#111',
            borderRadius: 12,
            paddingHorizontal: 20,
            justifyContent: 'center',
            opacity: busy ? 0.5 : 1,
          }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Tra</Text>
        </Pressable>
      </View>

      {busy && <ActivityIndicator size="large" />}
      {!!error && <Text style={{ color: '#c94f4f' }}>{error}</Text>}

      {word && (
        <View style={styles.row}>
          <Text style={{ fontSize: 24, fontWeight: '800' }}>{word.term}</Text>
          {!!word.type && <Text style={styles.muted}>{word.type}</Text>}
          {!!word.level && <Text style={styles.muted}>CEFR {word.level}</Text>}
          <Text style={{ fontSize: 18, marginTop: 10 }}>{word.meaning}</Text>
          {!!word.example && (
            <Text style={[styles.example, { marginTop: 8 }]}>"{word.example}"</Text>
          )}
          {!!word.synonyms?.length && (
            <Text style={[styles.muted, { marginTop: 8 }]}>
              Đồng nghĩa: {word.synonyms.join(', ')}
            </Text>
          )}
          {!!word.antonyms?.length && (
            <Text style={styles.muted}>Trái nghĩa: {word.antonyms.join(', ')}</Text>
          )}
          {!!word.etymology?.etymology && (
            <Text style={[styles.muted, { marginTop: 8 }]}>{word.etymology.etymology}</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}
