import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar,
  ActivityIndicator, FlatList, Modal, Animated, ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, ThongKeDoanhThu, HoaDonThongKe } from '../../types';
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

  // Chi tiết modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ThongKeDoanhThu | null>(null);
  const [chiTiet, setChiTiet] = useState<HoaDonThongKe[]>([]);
  const [chiTietLoading, setChiTietLoading] = useState(false);

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

  const handleRowPress = async (row: ThongKeDoanhThu) => {
    setSelectedRow(row);
    setModalVisible(true);
    setChiTiet([]);
    setChiTietLoading(true);
    try {
      let result: HoaDonThongKe[] = [];
      if (loai === 'thang') result = await tratrangphucApi.chiTietTheoThang(row.nam, row.period);
      else if (loai === 'quy') result = await tratrangphucApi.chiTietTheoQuy(row.nam, row.period);
      else result = await tratrangphucApi.chiTietTheoNam(row.nam);
      setChiTiet(result);
    } catch {
      setChiTiet([]);
    } finally {
      setChiTietLoading(false);
    }
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

      {/* Chi tiết Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: selectedOption?.color ?? '#5B6FE6' }]}>
              <View>
                <Text style={styles.modalTitle}>Chi Tiết Hóa Đơn</Text>
                <Text style={[styles.modalSubtitle, { color: selectedOption?.color ?? '#5B6FE6' }]}>
                  {selectedRow?.tenPeriod}
                </Text>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {chiTietLoading && (
              <View style={styles.modalCentered}>
                <ActivityIndicator size="large" color={selectedOption?.color ?? '#5B6FE6'} />
                <Text style={styles.loadingText}>Đang tải...</Text>
              </View>
            )}

            {!chiTietLoading && chiTiet.length === 0 && (
              <View style={styles.modalCentered}>
                <Text style={styles.emptyEmoji}>🗂️</Text>
                <Text style={styles.emptyText}>Không có hóa đơn nào</Text>
              </View>
            )}

            {!chiTietLoading && chiTiet.length > 0 && (
              <>
                {/* Summary in modal */}
                <View style={[styles.modalSummaryRow, { backgroundColor: selectedOption?.bg ?? '#EEF0FB' }]}>
                  <Text style={styles.modalSummaryItem}>
                    <Text style={styles.modalSummaryLabel}>Tổng HĐ: </Text>
                    <Text style={[styles.modalSummaryVal, { color: selectedOption?.color }]}>{chiTiet.length}</Text>
                  </Text>
                  <Text style={styles.modalSummaryItem}>
                    <Text style={styles.modalSummaryLabel}>Tổng DT: </Text>
                    <Text style={[styles.modalSummaryVal, { color: selectedOption?.color }]}>
                      {formatCurrency(chiTiet.reduce((s, h) => s + h.tongTienHoaDon, 0))}
                    </Text>
                  </Text>
                </View>

                {/* Column header */}
                <View style={styles.chiTietHeader}>
                  <Text style={[styles.cID, styles.chiTietHeaderCell]}>ID</Text>
                  <Text style={[styles.cKH, styles.chiTietHeaderCell]}>Khách hàng</Text>
                  <Text style={[styles.cDate, styles.chiTietHeaderCell]}>Ng.Mượn</Text>
                  <Text style={[styles.cQty, styles.chiTietHeaderCell]}>SL</Text>
                  <Text style={[styles.cMoney, styles.chiTietHeaderCell]}>Tiền</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={styles.modalList}>
                  {chiTiet.map((hd, idx) => (
                    <TouchableOpacity
                      key={hd.phieuTraId}
                      style={[styles.chiTietRow, idx % 2 === 1 && styles.chiTietRowAlt]}
                      activeOpacity={0.7}
                      onPress={async () => {
                        try {
                          const hoadon = await tratrangphucApi.layChiTietHoaDon(hd.phieuTraId);
                          // Ẩn modal hiện tại, sau đó chuyến đến màn hình chi tiết mới
                          setModalVisible(false);
                          setTimeout(() => {
                            navigation.navigate('ChiTietHoaDon', { 
                              hoaDon: hoadon, 
                            });
                          }, 300);
                        } catch (e: any) {
                          alert('Lỗi: ' + e.message);
                        }
                      }}
                    >
                      <View style={styles.cID}>
                        <View style={[styles.idBadge, { backgroundColor: selectedOption?.bg ?? '#EEF0FB' }]}>
                          <Text style={[styles.idText, { color: selectedOption?.color ?? '#5B6FE6' }]}>
                            #{hd.phieuTraId}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.cKH, styles.chiTietCell]} numberOfLines={2}>{hd.tenKhachHang}</Text>
                      <Text style={[styles.cDate, styles.chiTietCell]}>{hd.ngayMuon}</Text>
                      <Text style={[styles.cQty, styles.chiTietCell]}>{hd.tongSoTrangPhuc}</Text>
                      <Text style={[styles.cMoney, styles.moneyCell, { color: selectedOption?.color ?? '#5B6FE6' }]}>
                        {formatCurrency(hd.tongTienHoaDon)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
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

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(10,15,30,0.45)', justifyContent: 'flex-end' },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1B2A4A' },
  modalSubtitle: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F0F1F5', alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { fontSize: 14, color: '#8892A6', fontWeight: '700' },

  modalCentered: { alignItems: 'center', justifyContent: 'center', padding: 40, gap: 10 },

  modalSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 10,
    marginTop: 12,
    marginBottom: 8,
  },
  modalSummaryItem: {},
  modalSummaryLabel: { fontSize: 12, color: '#8892A6', fontWeight: '600' },
  modalSummaryVal: { fontSize: 14, fontWeight: '800' },

  // Chi tiết table
  chiTietHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B2A4A',
    marginHorizontal: 16,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 4,
  },
  chiTietHeaderCell: { fontSize: 10, fontWeight: '700', color: '#A7B0C4' },
  modalList: { paddingHorizontal: 16 },
  chiTietRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: '#F0F1F5',
  },
  chiTietRowAlt: { backgroundColor: '#FAFBFF' },
  chiTietCell: { fontSize: 12, color: '#4A5568' },
  cID: { width: 48 },
  cKH: { flex: 2.5 },
  cDate: { flex: 1.8 },
  cQty: { width: 30, textAlign: 'center' },
  cMoney: { flex: 2, textAlign: 'right' },
  moneyCell: { fontSize: 12, fontWeight: '700', textAlign: 'right' },
  idBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  idText: { fontSize: 10, fontWeight: '700' },
});
