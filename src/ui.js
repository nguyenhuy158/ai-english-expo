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

/** Một từ vựng: term, nghĩa, câu ví dụ; children thêm dòng phụ bên dưới. */
export function VocabRow({ word, children }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowTitle}>{word.term}</Text>
      <Text style={{ marginTop: 4 }}>{word.meaning}</Text>
      {!!word.example && <Text style={[styles.example, { marginTop: 6 }]}>"{word.example}"</Text>}
      {children}
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
  example: { fontStyle: 'italic', color: '#444' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, fontSize: 16 },
  screen: { padding: 20 },
});
