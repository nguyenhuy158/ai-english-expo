import { FlatList, Text } from 'react-native';
import { api } from './api';
import { useApi } from './useApi';
import { EmptyText, ErrorText, Loading, VocabRow, styles } from './ui';

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
        <VocabRow word={item}>
          {!!item.lesson_title && (
            <Text style={[styles.muted, { marginTop: 6 }]}>từ bài: {item.lesson_title}</Text>
          )}
        </VocabRow>
      )}
    />
  );
}
