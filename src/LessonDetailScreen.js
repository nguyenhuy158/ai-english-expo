import { ScrollView, Text, View } from 'react-native';
import { api } from './api';
import { useApi } from './useApi';
import { EmptyText, ErrorText, Loading, styles } from './ui';

/**
 * Worker trả hai dạng tuỳ lesson.type:
 *   grammar -> { lesson, content: [{heading, explanation, examples[]}] }
 *   còn lại -> { lesson, vocab: [{term, meaning, example}] }
 */
export default function LessonDetailScreen({ route, onUnauthorized }) {
  const { id } = route.params;
  const { data, error, loading } = useApi(() => api.lessonDetail(id), [id], onUnauthorized);

  if (loading) return <Loading />;
  if (error) return <ErrorText>{error}</ErrorText>;

  const sections = Array.isArray(data?.content) ? data.content : null;
  const vocab = Array.isArray(data?.vocab) ? data.vocab : null;

  if (!sections?.length && !vocab?.length) return <EmptyText>Bài học chưa có nội dung.</EmptyText>;

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      {!!data?.lesson?.sub_title && (
        <Text style={[styles.muted, { marginBottom: 16 }]}>{data.lesson.sub_title}</Text>
      )}

      {sections?.map((section, i) => (
        <View key={i} style={styles.row}>
          {!!section.heading && <Text style={styles.rowTitle}>{section.heading}</Text>}
          <Text style={{ marginTop: 6, lineHeight: 22 }}>{section.explanation}</Text>
          {section.examples?.map((ex, j) => (
            <Text key={j} style={{ marginTop: 6, fontStyle: 'italic', color: '#444' }}>
              • {ex}
            </Text>
          ))}
        </View>
      ))}

      {vocab?.map((word) => (
        <View key={word.id ?? word.term} style={styles.row}>
          <Text style={styles.rowTitle}>{word.term}</Text>
          <Text style={{ marginTop: 4 }}>{word.meaning}</Text>
          {!!word.example && (
            <Text style={{ marginTop: 6, fontStyle: 'italic', color: '#444' }}>"{word.example}"</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}
