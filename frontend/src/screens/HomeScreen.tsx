import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
  route: RouteProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation, route }: Props) {
  const { nhanVien } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.logoEmoji}>🎭</Text>
        <Text style={styles.title}>Quản Lý</Text>
        <Text style={styles.subtitle}>Cho Thuê Trang Phục</Text>
        <View style={styles.welcomeBadge}>
          <Text style={styles.welcomeText}>👋 Xin chào, <Text style={styles.welcomeName}>{nhanVien.username}</Text></Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.menuContainer, {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }]}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('DanhSachLoi')}
          activeOpacity={0.7}
        >
          <View style={[styles.cardIconBox, { backgroundColor: '#FFF3E0' }]}>
            <Text style={styles.cardIcon}>⚠️</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Quản Lý Lỗi Hỏng Phạt</Text>
            <Text style={styles.cardDesc}>Thêm, sửa, xóa các loại lỗi và mức phạt</Text>
          </View>
          <View style={styles.arrowBox}>
            <Text style={styles.arrow}>→</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('TimKiemKH', { nhanVien })}
          activeOpacity={0.7}
        >
          <View style={[styles.cardIconBox, { backgroundColor: '#EDE7F6' }]}>
            <Text style={styles.cardIcon}>👗</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Trả Trang Phục & Thanh Toán</Text>
            <Text style={styles.cardDesc}>Xử lý trả đồ, ghi nhận lỗi hỏng và tính phạt</Text>
          </View>
          <View style={styles.arrowBox}>
            <Text style={styles.arrow}>→</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.version}>v1.0.0 • Costume Rental Management</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: { alignItems: 'center', paddingVertical: 36, paddingTop: 60 },
  logoEmoji: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 32, fontWeight: '900', color: '#1B2A4A' },
  subtitle: { fontSize: 15, color: '#8892A6', marginTop: 4, fontWeight: '500' },
  welcomeBadge: {
    marginTop: 14, backgroundColor: '#EEF0FB',
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
  },
  welcomeText: { fontSize: 13, color: '#5B6FE6', fontWeight: '500' },
  welcomeName: { fontWeight: '800' },

  menuContainer: { flex: 1, paddingHorizontal: 20, gap: 14 },
  card: {
    flexDirection: 'row', alignItems: 'center', padding: 18,
    borderRadius: 16, backgroundColor: '#FFFFFF',
    shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  cardIconBox: {
    width: 50, height: 50, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  cardIcon: { fontSize: 24 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1B2A4A', marginBottom: 3 },
  cardDesc: { fontSize: 13, color: '#8892A6', lineHeight: 18 },
  arrowBox: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: '#F0F1F5', alignItems: 'center', justifyContent: 'center', marginLeft: 8,
  },
  arrow: { fontSize: 16, color: '#5B6FE6', fontWeight: 'bold' },
  version: { textAlign: 'center', color: '#C4CAD4', paddingBottom: 24, fontSize: 12, fontWeight: '500' },
});
