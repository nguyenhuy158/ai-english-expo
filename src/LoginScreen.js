import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { BASE_URL, GOOGLE_LOGIN_URL } from './api';

/**
 * Google OAuth runs inside a WebView so the httpOnly auth cookie lands in the
 * shared cookie store. When the worker redirects back to the site root, the
 * login is done.
 */
export default function LoginScreen({ onLoggedIn }) {
  const [webviewOpen, setWebviewOpen] = useState(false);

  if (webviewOpen) {
    return (
      <WebView
        source={{ uri: GOOGLE_LOGIN_URL }}
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        startInLoadingState
        renderLoading={() => <ActivityIndicator style={styles.center} size="large" />}
        onNavigationStateChange={(nav) => {
          const done = nav.url === `${BASE_URL}/` || nav.url.startsWith(`${BASE_URL}/?`);
          if (done && !nav.loading) {
            setWebviewOpen(false);
            onLoggedIn();
          }
        }}
      />
    );
  }

  return (
    <View style={styles.center}>
      <Text style={styles.title}>AI English</Text>
      <Text style={styles.subtitle}>Học tiếng Anh mỗi ngày</Text>
      <Pressable style={styles.button} onPress={() => setWebviewOpen(true)}>
        <Text style={styles.buttonText}>Đăng nhập với Google</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 34, fontWeight: '700' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8, marginBottom: 32 },
  button: { backgroundColor: '#111', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
