import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

/** Ba trạng thái mọi màn hình dữ liệu đều cần: đang tải / lỗi / rỗng. */
export function Loading() {
  return <ActivityIndicator style={styles.fill} size="large" />;
}

export function ErrorText({ children }) {
  return (
    <View style={styles.fill}>
      <Text style={styles.error}>{children}</Text>
    </View>
  );
}

export function EmptyText({ children }) {
  return (
    <View style={styles.fill}>
      <Text style={styles.muted}>{children}</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  error: { color: '#c94f4f', textAlign: 'center' },
  muted: { color: '#777', textAlign: 'center' },
  row: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  rowTitle: { fontSize: 16, fontWeight: '600' },
  screen: { padding: 20 },
});
