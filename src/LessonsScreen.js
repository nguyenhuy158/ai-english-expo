import { FlatList, Pressable, Text, View } from 'react-native';
import { api } from './api';
import { useApi } from './useApi';
import { EmptyText, ErrorText, Loading, styles } from './ui';

export default function LessonsScreen({ navigation, onUnauthorized }) {
  const { data, error, loading } = useApi(() => api.lessons(), [], onUnauthorized);

  if (loading) return <Loading />;
  if (error) return <ErrorText>{error}</ErrorText>;
  if (!data?.length) return <EmptyText>Chưa có bài học nào.</EmptyText>;

  return (
    <FlatList
      contentContainerStyle={styles.screen}
      data={data}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <Pressable
          style={[styles.row, item.is_locked ? { opacity: 0.45 } : null]}
          disabled={!!item.is_locked}
          onPress={() =>
            navigation.navigate('LessonDetail', { id: item.id, title: item.title })
          }>
          <Text style={styles.rowTitle}>
            {item.is_locked ? '🔒 ' : ''}
            {item.title}
          </Text>
          {!!item.sub_title && <Text style={styles.muted}>{item.sub_title}</Text>}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 6 }}>
            {!!item.type && <Text style={styles.muted}>{item.type}</Text>}
            {item.is_done ? <Text style={styles.muted}>✓ đã học</Text> : null}
          </View>
        </Pressable>
      )}
    />
  );
}
