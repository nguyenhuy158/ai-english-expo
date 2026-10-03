import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { api, isUnauthorized } from './api';
import { ErrorText, Loading, styles } from './ui';
import { useApi } from './useApi';

// Worker: GET /api/translation/today -> {vietnamese, term}
//         POST /api/translation/review -> {corrected, corrections[], overallFeedback}
export default function TranslateScreen({ onUnauthorized }) {
  const [round, setRound] = useState(0);
  const exercise = useApi(() => api.translationToday(), [round], onUnauthorized);

  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const next = useCallback(() => {
    setAnswer('');
    setResult(null);
    setError(null);
    setRound((n) => n + 1);
  }, []);

  async function submit() {
    const text = answer.trim();
    if (!text || busy || !exercise.data?.vietnamese) return;
    setBusy(true);
    setError(null);
    try {
      setResult(await api.reviewTranslation(exercise.data.vietnamese, text));
    } catch (err) {
      if (isUnauthorized(err)) return onUnauthorized?.();
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (exercise.loading) return <Loading />;
  if (exercise.error) return <ErrorText>{exercise.error}</ErrorText>;

  return (
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      <View style={styles.row}>
        <Text style={styles.muted}>Dịch câu này sang tiếng Anh</Text>
        <Text style={{ fontSize: 20, fontWeight: '700', marginTop: 8 }}>
          {exercise.data?.vietnamese}
        </Text>
        {!!exercise.data?.term && (
          <Text style={[styles.muted, { marginTop: 8 }]}>gợi ý từ: {exercise.data.term}</Text>
        )}
      </View>

      <TextInput
        value={answer}
        onChangeText={setAnswer}
        editable={!result}
        placeholder="Bản dịch tiếng Anh của bạn"
        multiline
        maxLength={500}
        style={[
          styles.input,
          {
            padding: 14,
            minHeight: 100,
            textAlignVertical: 'top',
            backgroundColor: result ? '#fafafa' : '#fff',
          },
        ]}
      />

      <Pressable
        onPress={result ? next : submit}
        disabled={busy || (!result && !answer.trim())}
        style={{
          backgroundColor: '#111',
          borderRadius: 12,
          paddingVertical: 14,
          alignItems: 'center',
          marginTop: 12,
          opacity: busy || (!result && !answer.trim()) ? 0.4 : 1,
        }}>
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
            {result ? 'Câu tiếp theo' : 'Chấm bài'}
          </Text>
        )}
      </Pressable>

      {!!error && <ErrorText>{error}</ErrorText>}

      {result && (
        <View style={{ marginTop: 16 }}>
          <View style={styles.row}>
            <Text style={styles.muted}>Bản dịch chuẩn</Text>
            <Text style={{ fontSize: 17, marginTop: 6 }}>{result.corrected}</Text>
          </View>

          {result.corrections?.length ? (
            result.corrections.map((c, i) => (
              <View key={i} style={styles.row}>
                <Text style={{ textDecorationLine: 'line-through', color: '#c94f4f' }}>
                  {c.original}
                </Text>
                <Text style={{ color: '#2e7d32', fontWeight: '600', marginTop: 4 }}>
                  {c.suggestion}
                </Text>
                <Text style={[styles.muted, { marginTop: 6 }]}>{c.explanation}</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.muted, { marginTop: 8 }]}>Không có lỗi nào 🎉</Text>
          )}

          {!!result.overallFeedback && (
            <Text style={[styles.muted, { marginTop: 12, lineHeight: 20 }]}>
              {result.overallFeedback}
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}
