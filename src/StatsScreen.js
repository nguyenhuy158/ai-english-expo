import { ScrollView, Text, View } from 'react-native';
import { api } from './api';
import { useApi } from './useApi';
import { ErrorText, Loading, styles } from './ui';

const FIELDS = [
  ['days', 'Ngày hoạt động'],
  ['daysLearned', 'Ngày đã học'],
  ['savedWords', 'Từ đã lưu'],
  ['dueWords', 'Thẻ đến hạn'],
];

export default function StatsScreen({ onUnauthorized }) {
  const { data, error, loading } = useApi(() => api.learningStats(), [], onUnauthorized);

  if (loading) return <Loading />;
  if (error) return <ErrorText>{error}</ErrorText>;

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      {FIELDS.map(([key, label]) => (
        <View key={key} style={[styles.row, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <Text style={styles.rowTitle}>{label}</Text>
          <Text style={{ fontSize: 20, fontWeight: '800' }}>{data?.[key] ?? 0}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
