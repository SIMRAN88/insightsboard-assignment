import {
  StyleSheet,
} from 'react-native';
const InsightCardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  timestamp: {
    marginTop: 6,
    color: '#94A3B8',
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  hcp: {
    marginTop: 8,
    color: '#475569',
  },

  bottomRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
    flexWrap: 'wrap',
  },

  priority: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  priorityText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  category: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  categoryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },

  rightAction: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#22C55E',
    borderRadius: 16,
    marginBottom: 12,
    paddingHorizontal: 24,
  },

  leftAction: {
    justifyContent: 'center',
    backgroundColor: '#F97316',
    borderRadius: 16,
    marginBottom: 12,
    paddingHorizontal: 24,
  },

  actionText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tagsRow:{
  flexDirection:'row',
  flexWrap:'wrap',
  gap:8,
  marginTop:12,
},

tagChip:{
  backgroundColor:'#EEF2FF',
  paddingHorizontal:10,
  paddingVertical:6,
  borderRadius:999,
},

tagText:{
  fontSize:12,
  color:'#4338CA',
  fontWeight:'600',
},
});


export default InsightCardStyles;