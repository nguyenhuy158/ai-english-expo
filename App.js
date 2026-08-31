import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { api } from './src/api';
import LoginScreen from './src/LoginScreen';
import HomeScreen from './src/HomeScreen';
import FlashcardsScreen from './src/FlashcardsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = đang kiểm tra, null = chưa đăng nhập

  const refreshUser = useCallback(() => {
    // /api/auth/me trả {user: null} khi chưa đăng nhập, không phải 401.
    api
      .me()
      .then((res) => setUser(res?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  useEffect(refreshUser, [refreshUser]);

  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {user ? (
        <Stack.Navigator>
          <Stack.Screen name="Home" options={{ title: 'AI English' }}>
            {(props) => <HomeScreen {...props} user={user} />}
          </Stack.Screen>
          <Stack.Screen name="Flashcards" options={{ title: 'Flashcards' }}>
            {(props) => <FlashcardsScreen {...props} onUnauthorized={() => setUser(null)} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        <LoginScreen onLoggedIn={refreshUser} />
      )}
    </NavigationContainer>
  );
}
