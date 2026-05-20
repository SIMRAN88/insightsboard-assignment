import { useEffect, useState } from 'react';

import NetInfo from
'@react-native-community/netinfo';

import {
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

export default function
OfflineBanner() {

  const [
    isOffline,
    setIsOffline,
  ] = useState(false);

  useEffect(() => {

    const unsubscribe =
      NetInfo.addEventListener(
        state => {

          setIsOffline(
            !state.isConnected
          );

        }
      );

    return unsubscribe;

  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={{
        backgroundColor: '#DC2626',
      }}
    >

      <View
        style={{
          paddingVertical: 12,
          paddingHorizontal: 16,

          alignItems: 'center',
        }}
      >

        <Text
          style={{
            color: '#FFFFFF',

            fontWeight: '700',

            textAlign: 'center',
          }}
        >
          You're offline.
          Changes will sync
          when reconnected.
        </Text>

      </View>

    </SafeAreaView>
  );
}