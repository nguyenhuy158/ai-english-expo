import { FlatList, Text, View } from 'react-native';
import { api } from './api';
import { useApi } from './useApi';
import { EmptyText, ErrorText, Loading, styles } from './ui';

export default function SavedScreen({ onUnauthorized }) {
  const { data, error, loading } = useApi(() => api.savedVocab(), [], onUnauthorized);

  if (loading) return <Loading />;
  if (error) return <ErrorText>{error}</ErrorText>;
  if (!data?.length) return <EmptyText>Chưa lưu từ nào.</EmptyText>;

  return (
    <FlatList
      contentContainerStyle={styles.screen}
      data={data}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.rowTitle}>{item.term}</Text>
          <Text style={{ marginTop: 4 }}>{item.meaning}</Text>
          {!!item.example && (
            <Text style={{ marginTop: 6, fontStyle: 'italic', color: '#444' }}>"{item.example}"</Text>
          )}
          {!!item.lesson_title && (
            <Text style={[styles.muted, { marginTop: 6 }]}>từ bài: {item.lesson_title}</Text>
          )}
        </View>
      )}
    />
  );
}
