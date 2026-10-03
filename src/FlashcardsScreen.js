import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { api, isUnauthorized } from './api';
import { EmptyText, Loading } from './ui';

// Same grading scale the web app uses: swipe right = 4 (nhớ), left = 2 (quên).
const GRADE_KNOWN = 4;
const GRADE_FORGOT = 2;

export default function FlashcardsScreen({ onUnauthorized }) {
  const [cards, setCards] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .vocab()
      .then((rows) => setCards(Array.isArray(rows) ? rows : []))
      .catch((err) => {
        if (isUnauthorized(err)) return onUnauthorized();
        setError(err.message);
        setCards([]);
      });
  }, [onUnauthorized]);

  const current = cards?.[0];

  async function grade(quality) {
    if (!current || grading) return;
    const gradedId = current.id;
    setGrading(true);
    try {
      await api.reviewVocab(gradedId, quality);
    } catch (err) {
      if (isUnauthorized(err)) return onUnauthorized();
      // Best-effort: thẻ vẫn rời khỏi bộ dù ghi thất bại, giống bản web.
    } finally {
      setGrading(false);
      setFlipped(false);
      setCards((prev) => (prev ? prev.filter((c) => c.id !== gradedId) : prev));
    }
  }

  if (cards === null) return <Loading />;
  if (error) return <EmptyText>{error}</EmptyText>;
  if (!current) return <EmptyText>Hết thẻ rồi 🎉</EmptyText>;

  return (
    <View style={styles.container}>
      <Pressable style={styles.card} onPress={() => setFlipped((f) => !f)}>
        {flipped ? (
          <>
            <Text style={styles.meaning}>{current.meaning}</Text>
            {!!current.example && <Text style={styles.example}>"{current.example}"</Text>}
          </>
        ) : (
          <Text style={styles.term}>{current.term}</Text>
        )}
        <Text style={styles.hint}>{flipped ? 'Chạm để lật lại' : 'Chạm để xem nghĩa'}</Text>
      </Pressable>

      {flipped && (
        <View style={styles.actions}>
          <Pressable
            style={[styles.action, styles.forgot]}
            disabled={grading}
            onPress={() => grade(GRADE_FORGOT)}>
            <Text style={styles.actionText}>Quên</Text>
          </Pressable>
          <Pressable
            style={[styles.action, styles.known]}
            disabled={grading}
            onPress={() => grade(GRADE_KNOWN)}>
            <Text style={styles.actionText}>Nhớ</Text>
          </Pressable>
        </View>
      )}

      <Text style={styles.muted}>Còn {cards.length} thẻ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 16, justifyContent: 'center' },
  card: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 32,
    minHeight: 240,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  term: { color: '#fff', fontSize: 32, fontWeight: '800' },
  meaning: { color: '#ffd479', fontSize: 24, fontWeight: '700', textAlign: 'center' },
  example: { color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', textAlign: 'center' },
  hint: { color: '#777', fontSize: 12, marginTop: 12 },
  actions: { flexDirection: 'row', gap: 12 },
  action: { flex: 1, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  forgot: { backgroundColor: '#c94f4f' },
  known: { backgroundColor: '#2e9e5b' },
  actionText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  muted: { color: '#777', textAlign: 'center' },
});
