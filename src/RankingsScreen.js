import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { api } from './api';
import { useApi } from './useApi';
import { EmptyText, ErrorText, Loading, styles } from './ui';

export default function RankingsScreen({ onUnauthorized }) {
  const [weekly, setWeekly] = useState(false);
  const { data, error, loading } = useApi(
    () => (weekly ? api.weeklyRankings() : api.rankings()),
    [weekly],
    onUnauthorized
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', gap: 8, padding: 16 }}>
        {[
          ['Tổng', false],
          ['Tuần này', true],
        ].map(([label, value]) => (
          <Pressable
            key={label}
            onPress={() => setWeekly(value)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: weekly === value ? '#111' : '#eee',
            }}>
            <Text style={{ color: weekly === value ? '#fff' : '#333', fontWeight: '600' }}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorText>{error}</ErrorText>
      ) : !data?.top?.length ? (
        <EmptyText>Chưa có bảng xếp hạng.</EmptyText>
      ) : (
        <>
          {data.myRank != null && (
            <Text style={[styles.muted, { textAlign: 'center', marginBottom: 8 }]}>
              Hạng của bạn: #{data.myRank}
            </Text>
          )}
          <FlatList
            contentContainerStyle={styles.screen}
            data={data.top}
            keyExtractor={(item, i) => String(item.id ?? i)}
            renderItem={({ item, index }) => (
              <View style={[styles.row, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
                <Text style={{ width: 32, fontWeight: '700' }}>#{index + 1}</Text>
                <Text style={[styles.rowTitle, { flex: 1 }]}>{item.name || 'Ẩn danh'}</Text>
                <Text style={styles.muted}>
                  {item.xp ?? 0} XP{item.streak ? ` · 🔥${item.streak}` : ''}
                </Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}
