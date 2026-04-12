import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'KetQua'>;
  route: RouteProp<RootStackParamList, 'KetQua'>;
};

export default function KetQuaScreen({ navigation, route }: Props) {
  const { success, message, phieuTraId } = route.params;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconCircle, {
          transform: [{ scale: scaleAnim }],
          backgroundColor: success ? '#E8F5E9' : '#FFEBEE',
        }]}>
          <View style={[styles.iconInner, { backgroundColor: success ? '#C8E6C9' : '#FFCDD2' }]}>
            <Text style={styles.icon}>{success ? '✅' : '❌'}</Text>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], alignItems: 'center' }}>
          <Text style={[styles.status, { color: success ? '#43A047' : '#E53935' }]}>
            {success ? 'Thành công!' : 'Thất bại!'}
          </Text>
          <Text style={styles.message}>{message}</Text>

          {phieuTraId && (
            <View style={styles.phieuBox}>
              <Text style={styles.phieuLabel}>Mã phiếu trả</Text>
              <Text style={styles.phieuId}>#{phieuTraId}</Text>
              <View style={styles.phieuDivider} />
              <Text style={styles.phieuNote}>Đã cập nhật vào hệ thống thành công</Text>
            </View>
          )}
        </Animated.View>
      </View>

      <Animated.View style={[styles.actions, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')} activeOpacity={0.7}>
          <Text style={styles.homeBtnText}>🏠 Về Trang Chủ</Text>
        </TouchableOpacity>
        {success && (
          <TouchableOpacity style={styles.continueBtn} onPress={() => navigation.navigate('TimKiemKH')} activeOpacity={0.7}>
            <Text style={styles.continueBtnText}>Trả tiếp →</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  iconCircle: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  iconInner: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 40 },
  status: { fontSize: 28, fontWeight: '900', marginBottom: 10 },
  message: { fontSize: 15, color: '#8892A6', textAlign: 'center', lineHeight: 22, paddingHorizontal: 16 },

  phieuBox: {
    marginTop: 28, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 22,
    alignItems: 'center', width: '100%',
    shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 14, elevation: 4,
  },
  phieuLabel: { fontSize: 11, color: '#8892A6', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  phieuId: { fontSize: 36, fontWeight: '900', color: '#5B6FE6' },
  phieuDivider: { height: 1, backgroundColor: '#F0F1F5', width: '50%', marginVertical: 12 },
  phieuNote: { fontSize: 12, color: '#8892A6', fontWeight: '500' },

  actions: { padding: 20, paddingBottom: 28, gap: 10 },
  homeBtn: {
    backgroundColor: '#FFFFFF', padding: 15, borderRadius: 14, alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E8EAF0',
  },
  homeBtnText: { color: '#1B2A4A', fontWeight: '600', fontSize: 15 },
  continueBtn: {
    backgroundColor: '#5B6FE6', padding: 15, borderRadius: 14, alignItems: 'center',
    shadowColor: '#5B6FE6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 6,
  },
  continueBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
