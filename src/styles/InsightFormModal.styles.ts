import { StyleSheet } from 'react-native';

const InsightFormModalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent:
            'flex-end',
        backgroundColor:
            'rgba(0,0,0,0.4)',
    },

    sheet: {
        height: '90%',
        backgroundColor:
            '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },

    content: {
        padding: 20,
        paddingBottom: 60,
    },

    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 24,
    },

    input: {
        borderWidth: 1,
        borderColor:
            '#CBD5E1',
        borderRadius: 12,
        padding: 14,
        marginTop: 16,
    },

    multiline: {
        minHeight: 120,
        textAlignVertical:
            'top',
    },

    error: {
        color: '#EF4444',
        marginTop: 6,
    },

    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 32,
    },

    cancelButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        backgroundColor:
            '#E2E8F0',
        alignItems:
            'center',
    },

    submitButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        backgroundColor:
            '#3F51B5',
        alignItems:
            'center',
    },
    label: {
        marginTop: 20,
        marginBottom: 10,
        fontWeight: '700',
    },

    disabledButton: {
        opacity: 0.7,
    },

    optionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    optionChip: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: '#E2E8F0',
    },

    selectedChip: {
        backgroundColor: '#3F51B5',
    },
    hcpResults: {
        marginTop: 12,
    },

    hcpRow: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
    },

    hcpName: {
        fontWeight: '700',
        color: '#111827',
    },

    hcpMeta: {
        color: '#64748B',
        marginTop: 4,
        fontSize: 12,
    },
});

export default InsightFormModalStyles;