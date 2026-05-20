import { StyleSheet } from "react-native";

const InsightDetailModalStyles  = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor:
      'rgba(0,0,0,0.4)',
  },

  backdrop: {
    flex: 1,
  },

  sheet: {
    height: '85%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  handle: {
    width: 48,
    height: 5,
    backgroundColor: '#CBD5E1',
    borderRadius: 999,
    alignSelf: 'center',
    marginTop: 12,
  },

  content: {
    padding: 20,
    paddingBottom: 60,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },

  description: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    color: '#475569',
  },

  section: {
    marginTop: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },

  button: {
    flex: 1,
    backgroundColor: '#3F51B5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  label:{
  marginTop:20,
  marginBottom:10,
  fontWeight:'700',
},

optionRow:{
  flexDirection:'row',
  flexWrap:'wrap',
  gap:8,
},

optionChip:{
  paddingHorizontal:14,
  paddingVertical:10,
  borderRadius:999,
  backgroundColor:'#E2E8F0',
},

selectedChip:{
  backgroundColor:'#3F51B5',
},
activityRow: {
  flexDirection: 'row',

  marginTop: 16,

  paddingBottom: 16,

  borderBottomWidth: 1,

  borderBottomColor:
    '#E5E7EB',
},

timelineDot: {
  width: 10,

  height: 10,

  borderRadius: 999,

  backgroundColor:
    '#4F46E5',

  marginTop: 6,

  marginRight: 12,
},

activityContent: {
  flex: 1,
},

activityField: {
  fontSize: 14,

  fontWeight: '700',

  color: '#111827',

  marginBottom: 4,
},

activityChange: {
  fontSize: 14,

  color: '#475569',

  lineHeight: 22,
},

activityArrow: {
  color: '#4F46E5',

  fontWeight: '700',
},

activityTime: {
  marginTop: 8,

  fontSize: 12,

  color: '#9CA3AF',
},
});

export default InsightDetailModalStyles;