import 'react-native-gesture-handler';

import { useEffect, useState } from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ApolloProvider } from '@apollo/client/react';
import { Session } from '@supabase/supabase-js';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import BoardScreen from './src/screens/BoardScreen';
import LoginScreen from './src/screens/LoginScreen';
import { apolloClient } from './src/services/apollo';
import { supabase } from './src/services/supabase';
import {
  ActionSheetProvider,
} from '@expo/react-native-action-sheet';
import { theme } from './src/theme/theme';
import { NavigationContainer } from '@react-navigation/native';
import AppErrorBoundary
  from './src/components/AppErrorBoundary';
import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import OfflineBanner
from './src/components/OfflineBanner';
import {
  MaterialIcons,
} from '@expo/vector-icons';

import AnalyticsScreen
  from './src/screens/AnalyticsScreen';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  console.log('SESSION', session);
  const Tab =
    createBottomTabNavigator();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <AppErrorBoundary>
        <ApolloProvider client={apolloClient}>
          <PaperProvider theme={theme}>
              <ActionSheetProvider>
                <>
              <OfflineBanner />
            {session ? (
              <NavigationContainer>

                <Tab.Navigator>

                  <Tab.Screen
                    name="Board"
                    component={BoardScreen}
                    options={{
                      tabBarIcon: ({ color, size }) => (
                        <MaterialIcons
                          name="dashboard"
                          color={color}
                          size={size}
                        />
                      ),
                    }}
                  />

                  <Tab.Screen
                    name="Analytics"
                    component={AnalyticsScreen}
                    options={{
                      tabBarIcon: ({ color, size }) => (
                        <MaterialIcons
                          name="analytics"
                          color={color}
                          size={size}
                        />
                      ),
                    }}
                  />

                </Tab.Navigator>

              </NavigationContainer>
            ) : (
              <LoginScreen />
            )}
            <Toast />
            </>
            </ActionSheetProvider>
          </PaperProvider>
        </ApolloProvider>
      </AppErrorBoundary>
    </GestureHandlerRootView>
  );
}