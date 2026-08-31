import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { api } from './api';

export default function HomeScreen({ navigation, user }) {
  const [dueCount, setDueCount] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      Promise.all([
        api.flashcardsDueCount().catch(() => ({ count: 0 })),
        api.lessons().catch(() => []),
      ]).then(([due, rows]) => {
        if (!alive) return;
        setDueCount(due?.count ?? 0);
        setLessons(Array.isArray(rows) ? rows.slice(0, 3) : []);
        setLoading(false);
      });
      return () => {
        alive = false;
      };
    }, [])
  );

  if (loading) return <ActivityIndicator style={styles.center} size="large" />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.hello}>Chào {user?.name || user?.email || 'bạn'} 👋</Text>

      <Pressable style={styles.card} onPress={() => navigation.navigate('Flashcards')}>
        <Text style={styles.cardTitle}>Flashcards</Text>
        <Text style={styles.cardBody}>
          {dueCount > 0 ? `${dueCount} thẻ đến hạn ôn` : 'Không có thẻ đến hạn'}
        </Text>
      </Pressable>

      <Text style={styles.section}>Bài học gần đây</Text>
      {lessons.length === 0 && <Text style={styles.muted}>Chưa có bài học nào.</Text>}
      {lessons.map((lesson) => (
        <View key={lesson.id} style={styles.lesson}>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          {!!lesson.sub_title && <Text style={styles.muted}>{lesson.sub_title}</Text>}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center' },
  container: { padding: 20, gap: 12 },
  hello: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  card: { backgroundColor: '#111', borderRadius: 16, padding: 20 },
  cardTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  cardBody: { color: '#bbb', marginTop: 4 },
  section: { fontSize: 18, fontWeight: '600', marginTop: 20 },
  lesson: { borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 12, padding: 16 },
  lessonTitle: { fontSize: 16, fontWeight: '600' },
  muted: { color: '#777' },
});
