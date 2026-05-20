import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import {
  ErrorBoundary,
  FallbackProps,
} from 'react-error-boundary';

function ErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: '700',
          marginBottom: 12,
        }}
      >
        Something went wrong
      </Text>

      <Text
        style={{
          color: '#64748B',
          textAlign: 'center',
          marginBottom: 24,
        }}
      >
        {errorMessage}
      </Text>

      <Button
        mode="contained"
        onPress={resetErrorBoundary}
      >
        Retry
      </Button>
      
    </View>
  );
}

export default function
AppErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <ErrorBoundary
      FallbackComponent={
        ErrorFallback
      }
      onError={error => {

        console.error(
          'GLOBAL ERROR',
          error
        );

      }}
    >
      {children}
    </ErrorBoundary>
  );
}