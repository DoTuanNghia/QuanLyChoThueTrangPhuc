import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'KetQua'>;
  route: RouteProp<RootStackParamList, 'KetQua'>;
};

export default function KetQuaScreen({ navigation, route }: Props) {
  const { success, message, phieuTraId, nhanVien } = route.params;

  const scaleAnim  = useRef(new Animated.Value(0)).current;
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const slideAnim  = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1, tension: 55, friction: 7, useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 380, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const accentColor  = success ? '#43A047' : '#E53935';
  const bgColor      = success ? '#E8F5E9' : '#FFEBEE';
  const innerBg      = success ? '#C8E6C9' : '#FFCDD2';

  return (
    <View style={styles.page}>
      <View style={styles.centerCol}>

        {/* Status icon */}
        <Animated.View style={[styles.iconCircle, { backgroundColor: bgColor, transform: [{ scale: scaleAnim }] }]}>
          <View style={[styles.iconInner, { backgroundColor: innerBg }]}>
            <Text style={styles.iconEmoji}>{success ? '✅' : '❌'}</Text>
          </View>
        </Animated.View>

        {/* Text */}
        <Animated.View style={[styles.textGroup, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={[styles.statusText, { color: accentColor }]}>
            {success ? 'Thành công!' : 'Thất bại!'}
          </Text>
          <Text style={styles.messageText}>{message}</Text>

          {/* Phiếu trả box */}
          {phieuTraId && (
            <View style={styles.phieuBox}>
              <View style={styles.phieuTop}>
                <View style={styles.phieuIconBox}>
                  <Text style={styles.phieuIcon}>🧾</Text>
                </View>
                <View>
                  <Text style={styles.phieuLabel}>Mã phiếu trả</Text>
                  <Text style={[styles.phieuId, { color: accentColor }]}>#{phieuTraId}</Text>
                </View>
              </View>
              <View style={styles.phieuDivider} />
              <View style={styles.phieuBottom}>
                <View style={[styles.statusDot, { backgroundColor: accentColor }]} />
                <Text style={styles.phieuNote}>Đã cập nhật vào hệ thống thành công</Text>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Actions */}
        <Animated.View style={[styles.actions, { opacity: fadeAnim }]}>
          {success && (
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: accentColor }]}
              onPress={() => navigation.navigate('TimKiemKH', { nhanVien })}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryBtnText}>Trả cho khách khác →</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Home', { nhanVien })}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryBtnText}>🏠 Về Trang Chủ</Text>
          </TouchableOpacity>
        </Animated.View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1, backgroundColor: '#F4F6FB',
    alignItems: 'center', justifyContent: 'center',
  },
  centerCol: {
    width: '100%', maxWidth: 520,
    alignItems: 'center', paddingHorizontal: 32,
  },

  iconCircle: {
    width: 130, height: 130, borderRadius: 65,
    alignItems: 'center', justifyContent: 'center', marginBottom: 32,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 8,
  },
  iconInner: {
    width: 86, height: 86, borderRadius: 43,
    alignItems: 'center', justifyContent: 'center',
  },
  iconEmoji: { fontSize: 42 },

  textGroup: { alignItems: 'center', width: '100%' },
  statusText: { fontSize: 32, fontWeight: '900', marginBottom: 10, letterSpacing: -0.5 },
  messageText: {
    fontSize: 15, color: '#8892A6', textAlign: 'center',
    lineHeight: 23, paddingHorizontal: 8, marginBottom: 28,
  },

  phieuBox: {
    width: '100%', backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden',
    shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07, shadowRadius: 16, elevation: 5,
    borderWidth: 1, borderColor: '#ECEEF4', marginBottom: 32,
  },
  phieuTop: {
    flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20,
  },
  phieuIconBox: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: '#F4F6FB',
    alignItems: 'center', justifyContent: 'center',
  },
  phieuIcon: { fontSize: 24 },
  phieuLabel: {
    fontSize: 11, color: '#8892A6', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4,
  },
  phieuId: { fontSize: 30, fontWeight: '900' },
  phieuDivider: { height: 1, backgroundColor: '#F0F1F5' },
  phieuBottom: {
    flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, paddingHorizontal: 20,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  phieuNote: { fontSize: 12, color: '#8892A6', fontWeight: '500' },

  actions: { width: '100%', gap: 12 },
  primaryBtn: {
    paddingVertical: 15, paddingHorizontal: 28, borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 10, elevation: 6,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  secondaryBtn: {
    backgroundColor: '#FFFFFF', paddingVertical: 15, paddingHorizontal: 28,
    borderRadius: 14, alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E8EAF0',
  },
  secondaryBtnText: { color: '#1B2A4A', fontWeight: '600', fontSize: 15 },
});
