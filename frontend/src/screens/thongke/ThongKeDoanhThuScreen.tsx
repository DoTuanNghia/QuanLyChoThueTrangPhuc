import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar,
  ActivityIndicator, FlatList, Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, ThongKeDoanhThu } from '../../types';
import { tratrangphucApi } from '../../api/tratrangphucApi';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ThongKeDoanhThu'>;
};

type LoaiTK = 'thang' | 'quy' | 'nam';

const LOAI_OPTIONS: { key: LoaiTK; label: string; icon: string; color: string; bg: string }[] = [
  { key: 'thang', label: 'Theo Tháng', icon: '📅', color: '#5B6FE6', bg: '#EEF0FB' },
  { key: 'quy',   label: 'Theo Quý',  icon: '📊', color: '#00B187', bg: '#E0F7F3' },
  { key: 'nam',   label: 'Theo Năm',  icon: '📈', color: '#F59E0B', bg: '#FEF3C7' },
];

function formatCurrency(amount: number): string {
  return amount.toLocaleString('vi-VN') + ' ₫';
}

export default function ThongKeDoanhThuScreen({ navigation }: Props) {
  const [loai, setLoai] = useState<LoaiTK | null>(null);
  const [data, setData] = useState<ThongKeDoanhThu[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: false }),
      Animated.timing(slideAnim, { toValue: 0, duration: 450, useNativeDriver: false }),
    ]).start();
  }, []);

  const fetchData = async (selected: LoaiTK) => {
    setLoai(selected);
    setData([]);
    setError('');
    setLoading(true);
    try {
      let result: ThongKeDoanhThu[] = [];
      if (selected === 'thang') result = await tratrangphucApi.thongKeTheoThang();
      else if (selected === 'quy') result = await tratrangphucApi.thongKeTheoQuy();
      else result = await tratrangphucApi.thongKeTheoNam();
      setData(result);
    } catch (e: any) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleRowPress = (row: ThongKeDoanhThu) => {
    if (!loai) return;
    const opt = LOAI_OPTIONS.find((o) => o.key === loai);
    navigation.navigate('DanhSachHoaDon', {
      loai: loai,
      nam: row.nam,
      period: row.period,
      tenPeriod: row.tenPeriod,
      color: opt?.color,
      bg: opt?.bg
    });
  };

  const selectedOption = LOAI_OPTIONS.find((o) => o.key === loai);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <Animated.View style={[styles.headerCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.headerEmoji}>📊</Text>
        <Text style={styles.headerTitle}>Thống Kê Doanh Thu</Text>
        <Text style={styles.headerSub}>Chọn khoảng thời gian để xem báo cáo</Text>
      </Animated.View>

      {/* Selector */}
      <Animated.View style={[styles.selectorRow, { opacity: fadeAnim }]}>
        {LOAI_OPTIONS.map((opt) => {
          const active = loai === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.selectorBtn, active && { backgroundColor: opt.color, borderColor: opt.color }]}
              onPress={() => fetchData(opt.key)}
              activeOpacity={0.75}
            >
              <Text style={styles.selectorIcon}>{opt.icon}</Text>
              <Text style={[styles.selectorLabel, active && { color: '#fff', fontWeight: '700' }]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>

      {/* Content */}
      <Animated.View style={[styles.contentArea, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {!loai && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>☝️</Text>
            <Text style={styles.emptyText}>Chọn loại thống kê ở trên để bắt đầu</Text>
          </View>
        )}

        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#5B6FE6" />
            <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
          </View>
        )}

        {error !== '' && !loading && (
          <View style={styles.centered}>
            <Text style={styles.errorEmoji}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => loai && fetchData(loai)}>
              <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && error === '' && loai && data.length === 0 && (
          <View style={styles.centered}>
            <Text style={styles.emptyEmoji}>🗂️</Text>
            <Text style={styles.emptyText}>Không có dữ liệu thống kê</Text>
          </View>
        )}

        {!loading && data.length > 0 && (
          <>
            {/* Summary cards */}
            <View style={styles.summaryRow}>
              <View style={[styles.summaryCard, { borderLeftColor: selectedOption?.color ?? '#5B6FE6' }]}>
                <Text style={styles.summaryLabel}>Tổng doanh thu</Text>
                <Text style={[styles.summaryValue, { color: selectedOption?.color ?? '#5B6FE6' }]}>
                  {formatCurrency(data.reduce((s, r) => s + r.tongDoanhThu, 0))}
                </Text>
              </View>
              <View style={[styles.summaryCard, { borderLeftColor: '#F59E0B' }]}>
                <Text style={styles.summaryLabel}>Tổng hóa đơn</Text>
                <Text style={[styles.summaryValue, { color: '#F59E0B' }]}>
                  {data.reduce((s, r) => s + r.soHoaDon, 0)}
                </Text>
              </View>
            </View>

            {/* Table header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.colPeriod, styles.headerCell]}>Kỳ</Text>
              <Text style={[styles.colRevenue, styles.headerCell]}>Doanh thu</Text>
              <Text style={[styles.colCount, styles.headerCell]}>HĐ</Text>
            </View>

            <FlatList
              data={data}
              keyExtractor={(_, i) => String(i)}
              showsVerticalScrollIndicator={false}
              style={styles.tableList}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}
                  onPress={() => handleRowPress(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.colPeriod}>
                    <Text style={styles.periodText}>{item.tenPeriod}</Text>
                  </View>
                  <View style={styles.colRevenue}>
                    <Text style={[styles.revenueText, { color: selectedOption?.color ?? '#5B6FE6' }]}>
                      {formatCurrency(item.tongDoanhThu)}
                    </Text>
                  </View>
                  <View style={styles.colCount}>
                    <View style={[styles.countBadge, { backgroundColor: selectedOption?.bg ?? '#EEF0FB' }]}>
                      <Text style={[styles.countText, { color: selectedOption?.color ?? '#5B6FE6' }]}>
                        {item.soHoaDon}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },

  // Header
  headerCard: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEEF4',
  },
  headerEmoji: { fontSize: 40, marginBottom: 6 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1B2A4A', letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: '#8892A6', marginTop: 4 },

  // Selector
  selectorRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  selectorBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E0E3EE',
    backgroundColor: '#fff',
    gap: 4,
  },
  selectorIcon: { fontSize: 20 },
  selectorLabel: { fontSize: 11, fontWeight: '600', color: '#8892A6', textAlign: 'center' },

  // Content
  contentArea: { flex: 1, paddingHorizontal: 16 },

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, opacity: 0.6 },
  emptyEmoji: { fontSize: 44 },
  emptyText: { fontSize: 14, color: '#8892A6', textAlign: 'center' },
  loadingText: { color: '#8892A6', fontSize: 14 },
  errorEmoji: { fontSize: 40 },
  errorText: { fontSize: 14, color: '#E53E3E', textAlign: 'center', marginHorizontal: 20 },
  retryBtn: { backgroundColor: '#5B6FE6', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  // Summary cards
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  summaryCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 12,
    padding: 14, borderLeftWidth: 4,
  },
  summaryLabel: { fontSize: 11, color: '#8892A6', fontWeight: '600', marginBottom: 4 },
  summaryValue: { fontSize: 15, fontWeight: '800' },

  // Table
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B2A4A',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 4,
  },
  headerCell: { fontSize: 11, fontWeight: '700', color: '#A7B0C4' },
  tableList: { flex: 1 },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#F0F1F5',
  },
  tableRowAlt: { backgroundColor: '#FAFBFF' },
  colPeriod: { flex: 2 },
  colRevenue: { flex: 2.5, alignItems: 'flex-end' },
  colCount: { flex: 1, alignItems: 'center' },
  periodText: { fontSize: 14, fontWeight: '600', color: '#1B2A4A' },
  revenueText: { fontSize: 13, fontWeight: '700' },
  countBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  countText: { fontSize: 12, fontWeight: '700' },
  chevron: { fontSize: 18, color: '#C4CAD4', marginLeft: 6 },

});
