import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { api } from './api';

const TILES = [
  ['Lessons', 'Bài học', '📚'],
  ['Saved', 'Từ đã lưu', '🔖'],
  ['Lookup', 'Tra từ', '🔍'],
  ['Translate', 'Dịch câu', '✍️'],
  ['Rankings', 'Xếp hạng', '🏆'],
  ['Stats', 'Thống kê', '📈'],
];

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

      <View style={styles.tiles}>
        {TILES.map(([route, label, icon]) => (
          <Pressable key={route} style={styles.tile} onPress={() => navigation.navigate(route)}>
            <Text style={{ fontSize: 26 }}>{icon}</Text>
            <Text style={styles.tileLabel}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.section}>Bài học gần đây</Text>
      {lessons.length === 0 && <Text style={styles.muted}>Chưa có bài học nào.</Text>}
      {lessons.map((lesson) => (
        <Pressable
          key={lesson.id}
          style={styles.lesson}
          onPress={() =>
            navigation.navigate('LessonDetail', { id: lesson.id, title: lesson.title })
          }>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          {!!lesson.sub_title && <Text style={styles.muted}>{lesson.sub_title}</Text>}
        </Pressable>
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
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
  tile: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: '#f3f3f3',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tileLabel: { fontSize: 13, fontWeight: '600', color: '#333' },
  section: { fontSize: 18, fontWeight: '600', marginTop: 20 },
  lesson: { borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 12, padding: 16 },
  lessonTitle: { fontSize: 16, fontWeight: '600' },
  muted: { color: '#777' },
});
