import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'KetQua'>;
  route: RouteProp<RootStackParamList, 'KetQua'>;
};

export default function KetQuaScreen({ navigation, route }: Props) {
  const { success, message, phieuTraId } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>{success ? '✅' : '❌'}</Text>
        <Text style={[styles.status, { color: success ? '#27ae60' : '#c0392b' }]}>
          {success ? 'Thành công!' : 'Thất bại!'}
        </Text>
        <Text style={styles.message}>{message}</Text>
        {phieuTraId && (
          <View style={styles.phieuBox}>
            <Text style={styles.phieuLabel}>Mã phiếu trả</Text>
            <Text style={styles.phieuId}>#{phieuTraId}</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeBtnText}>🏠 Về Trang Chủ</Text>
        </TouchableOpacity>
        {success && (
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => navigation.navigate('TimKiemKH')}
          >
            <Text style={styles.continueBtnText}>Trả tiếp →</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  icon: { fontSize: 72, marginBottom: 16 },
  status: { fontSize: 28, fontWeight: '900', marginBottom: 12 },
  message: { fontSize: 16, color: '#aaa', textAlign: 'center', lineHeight: 24 },
  phieuBox: {
    marginTop: 24, backgroundColor: '#16213e', borderRadius: 16,
    padding: 20, alignItems: 'center', width: '100%',
  },
  phieuLabel: { fontSize: 13, color: '#9ab', marginBottom: 4 },
  phieuId: { fontSize: 32, fontWeight: '900', color: '#e94560' },
  actions: { padding: 20, gap: 12 },
  homeBtn: {
    backgroundColor: '#16213e', padding: 16, borderRadius: 14, alignItems: 'center',
  },
  homeBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  continueBtn: {
    backgroundColor: '#e94560', padding: 16, borderRadius: 14, alignItems: 'center',
  },
  continueBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
