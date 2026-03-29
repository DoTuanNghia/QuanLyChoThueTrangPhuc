import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Home'> };

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      <View style={styles.header}>
        <Text style={styles.title}>🎭 Quản Lý</Text>
        <Text style={styles.subtitle}>Cho Thuê Trang Phục</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#16213e' }]}
          onPress={() => navigation.navigate('DanhSachLoi')}
          activeOpacity={0.85}
        >
          <Text style={styles.cardIcon}>⚠️</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Quản Lý Lỗi Hỏng Phạt</Text>
            <Text style={styles.cardDesc}>Thêm, sửa, xóa các loại lỗi và mức phạt</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#0f3460' }]}
          onPress={() => navigation.navigate('TimKiemKH')}
          activeOpacity={0.85}
        >
          <Text style={styles.cardIcon}>👗</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Trả Trang Phục</Text>
            <Text style={styles.cardDesc}>Xử lý trả đồ, ghi nhận lỗi hỏng và tính phạt</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>v1.0.0</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: { alignItems: 'center', paddingVertical: 48, paddingTop: 60 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#e94560' },
  subtitle: { fontSize: 16, color: '#aaa', marginTop: 6 },
  menuContainer: { flex: 1, paddingHorizontal: 20, gap: 16 },
  card: {
    flexDirection: 'row', alignItems: 'center', padding: 20,
    borderRadius: 16, marginBottom: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  cardIcon: { fontSize: 32, marginRight: 16 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#fff', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#9ab' },
  arrow: { fontSize: 28, color: '#e94560', fontWeight: 'bold' },
  version: { textAlign: 'center', color: '#444', paddingBottom: 20, fontSize: 12 },
});
