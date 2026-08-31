import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { api } from './src/api';
import LoginScreen from './src/LoginScreen';
import HomeScreen from './src/HomeScreen';
import FlashcardsScreen from './src/FlashcardsScreen';
import LessonsScreen from './src/LessonsScreen';
import LessonDetailScreen from './src/LessonDetailScreen';
import SavedScreen from './src/SavedScreen';
import RankingsScreen from './src/RankingsScreen';
import StatsScreen from './src/StatsScreen';
import LookupScreen from './src/LookupScreen';
import TranslateScreen from './src/TranslateScreen';

const Stack = createNativeStackNavigator();

// Mọi màn hình sau login đều nhận onUnauthorized để đá về LoginScreen khi cookie hết hạn.
const SCREENS = [
  ['Flashcards', 'Flashcards', FlashcardsScreen],
  ['Lessons', 'Bài học', LessonsScreen],
  ['LessonDetail', null, LessonDetailScreen],
  ['Saved', 'Từ đã lưu', SavedScreen],
  ['Rankings', 'Xếp hạng', RankingsScreen],
  ['Stats', 'Thống kê', StatsScreen],
  ['Lookup', 'Tra từ', LookupScreen],
  ['Translate', 'Dịch câu', TranslateScreen],
];

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

  const logout = () => setUser(null);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {user ? (
        <Stack.Navigator>
          <Stack.Screen name="Home" options={{ title: 'AI English' }}>
            {(props) => <HomeScreen {...props} user={user} />}
          </Stack.Screen>
          {SCREENS.map(([name, title, Screen]) => (
            <Stack.Screen
              key={name}
              name={name}
              options={({ route }) => ({ title: title ?? route.params?.title ?? '' })}>
              {(props) => <Screen {...props} onUnauthorized={logout} />}
            </Stack.Screen>
          ))}
        </Stack.Navigator>
      ) : (
        <LoginScreen onLoggedIn={refreshUser} />
      )}
    </NavigationContainer>
  );
}
