import React from 'react';

import {
    Text,
    View,
} from 'react-native';

import {
    Button,
} from 'react-native-paper';

import {
    ErrorBoundary,
    FallbackProps,
} from 'react-error-boundary';

import {
    styles,
} from '../styles/components/AppErrorBoundary.styles';
import {
    AppErrorBoundaryProps,
} from '../types/components/AppErrorBoundary';

function ErrorFallback({
    error,
    resetErrorBoundary,
}: FallbackProps) {

    const errorMessage =
        error instanceof Error
            ? error.message
            : String(error);

    return (

        <View style={styles.container}>

            <Text style={styles.title}>
                Something went wrong
            </Text>

            <Text style={styles.message}>
                {errorMessage}
            </Text>

            <Button
                mode="contained"
                onPress={
                    resetErrorBoundary
                }
            >
                Retry
            </Button>

        </View>

    );

}

export default function AppErrorBoundary({
    children,
}: AppErrorBoundaryProps) {

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