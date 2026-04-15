import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert,
  ActivityIndicator, ScrollView, Modal, TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Loi, LoiPhatRequest, ChiTietThue } from '../../types';
import { tratrangphucApi } from '../../api/tratrangphucApi';
import { loiApi } from '../../api/loiApi';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChonTra'>;
  route: RouteProp<RootStackParamList, 'ChonTra'>;
};

interface ItemState {
  chiTietThue: ChiTietThue & {
    tenTrangPhuc?: string;
    donGia?: number;
    ngayThue?: string;
    soNgayThue?: number;
    tienThueDenNay?: number;
  };
  duocChon: boolean;
  soLuongTra: string;
  danhSachLoi: (LoiPhatRequest & { tenLoi: string; mucPhat: number })[];
}

export default function ChonTraScreen({ navigation, route }: Props) {
  const { phieuThue, khachHang, nhanVien } = route.params;
  const [items, setItems] = useState<ItemState[]>([]);
  const [danhSachLoi, setDanhSachLoi] = useState<Loi[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItemIdx, setCurrentItemIdx] = useState<number>(-1);
  const [tempLoiSel, setTempLoiSel] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    Promise.all([loiApi.layTatCa(), tratrangphucApi.layPhieuThueChuaTra(khachHang.id)])
      .then(([lois]) => {
        setDanhSachLoi(lois);

        // Backend trả về danhSachChuaTra (đã lọc sẵn chưa trả)
        const rawList = (phieuThue as any).danhSachChuaTra || phieuThue.chiTietThueList || [];
        setItems(rawList.map((c: any) => ({
          chiTietThue: {
            id: c.id,
            soLuong: c.soLuong ?? 1,
            thanhTien: c.thanhTien ?? 0,
            trangPhuc: c.trangPhuc ?? {
              id: c.trangPhucId ?? 0,
              ten: c.tenTrangPhuc ?? 'N/A',
              donGia: c.donGia ?? 0,
              soLuong: 0,
              soLuongThue: 0,
            },
            trangPhucId: c.trangPhucId,
            tenTrangPhuc: c.tenTrangPhuc,
            donGia: c.donGia,
            ngayThue: c.ngayThue,
            soNgayThue: c.soNgayThue,
            tienThueDenNay: c.tienThueDenNay,
          } as any,
          duocChon: true,
          soLuongTra: String(c.soLuong ?? 1),
          danhSachLoi: [],
        })));
      })
      .catch((e) => Alert.alert('Lỗi', e.message))
      .finally(() => setLoading(false));
  }, []);

  const openLoiModal = (idx: number) => {
    setCurrentItemIdx(idx);
    const sel = new Map<number, number>();
    items[idx].danhSachLoi.forEach((l) => sel.set(l.loiId, l.soLuong));
    setTempLoiSel(sel);
    setModalVisible(true);
  };

  const applyLoi = () => {
    const newItems = [...items];
    newItems[currentItemIdx].danhSachLoi = Array.from(tempLoiSel.entries())
      .filter(([, sl]) => sl > 0)
      .map(([loiId, soLuong]) => {
        const loi = danhSachLoi.find((l) => l.id === loiId)!;
        return { loiId, soLuong, tenLoi: loi.tenLoi, mucPhat: loi.mucPhat };
      });
    setItems(newItems);
    setModalVisible(false);
  };

  const handleXemHoaDon = async () => {
    const selected = items.filter((i) => i.duocChon);
    if (selected.length === 0) { Alert.alert('Lỗi', 'Vui lòng chọn ít nhất 1 trang phục'); return; }
    try {
      setSubmitting(true);
      const request = {
        phieuThueId: phieuThue.id,
        nhanVienId: nhanVien.id,
        danhSachTra: selected.map((i) => ({
          trangPhucId: (i.chiTietThue as any).trangPhucId,  // Đổi từ chiTietThueId → trangPhucId
          soLuongTra: parseInt(i.soLuongTra) || 1,
          danhSachLoi: i.danhSachLoi.map(({ loiId, soLuong }) => ({ loiId, soLuong })),
        })),
      };
      const hoaDon = await tratrangphucApi.preview(request);
      navigation.navigate('PreviewHoaDon', { request, hoaDon });
    } catch (e: any) { Alert.alert('Lỗi', e.message); }
    finally { setSubmitting(false); }
  };

  const fmtVND = (v: number) => v?.toLocaleString('vi-VN') + 'đ';
  const getName = (i: ItemState) =>
    (i.chiTietThue as any).tenTrangPhuc || i.chiTietThue.trangPhuc?.ten || 'N/A';
  const getPrice = (i: ItemState) =>
    (i.chiTietThue as any).donGia ?? i.chiTietThue.trangPhuc?.donGia ?? 0;
  // daTra/soLuongDaTra đã xóa → toàn bộ soLuong trong list là số còn cần trả
  const getRemain = (i: ItemState) => i.chiTietThue.soLuong;
  const getLoiTotal = (ds: ItemState['danhSachLoi']) =>
    ds.reduce((s, l) => s + l.mucPhat * l.soLuong, 0);

  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color="#5B6FE6" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.pageWrapper}>
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <View style={styles.centerCol}>

          {/* Page title */}
          <View style={styles.pageHeader}>
            <View>
              <Text style={styles.pageTitle}>Trả trang phục</Text>
              <Text style={styles.pageSub}>Chọn trang phục và ghi nhận lỗi hỏng (nếu có)</Text>
            </View>
            <View style={styles.phieuBadge}>
              <Text style={styles.phieuBadgeLabel}>Phiếu #{phieuThue.id}</Text>
            </View>
          </View>

          {/* Info + Nhân viên */}
          <View style={styles.topRow}>
            {/* KH card */}
            <View style={[styles.card, styles.khCard]}>
              <Text style={styles.cardSectionLabel}>Khách hàng</Text>
              <View style={styles.khRow}>
                <View style={styles.khAvatar}>
                  <Text style={styles.khAvatarText}>{khachHang.ten.charAt(0).toUpperCase()}</Text>
                </View>
                <View>
                  <Text style={styles.khName}>{khachHang.ten}</Text>
                  <Text style={styles.khPhone}>📞 {khachHang.soDienThoai || '—'}</Text>
                </View>
              </View>
            </View>

            {/* Nhân viên card - hiển thị nhân viên đang đăng nhập */}
            <View style={[styles.card, styles.nvCard]}>
              <Text style={styles.cardSectionLabel}>👨‍💼 Nhân viên xử lý</Text>
              <View style={[styles.nvChip, styles.nvChipActive]}>
                <View style={styles.nvDotActive} />
                <Text style={styles.nvTextActive}>{nhanVien.username}</Text>
              </View>
            </View>
          </View>

          {/* Trang phục section */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>👗 Trang phục cần trả</Text>
              <View style={styles.selectedBadge}>
                <View style={styles.selectedDot} />
                <Text style={styles.selectedBadgeText}>
                  {items.filter(i => i.duocChon).length}/{items.length} đã chọn
                </Text>
              </View>
            </View>

            <View style={styles.itemGrid}>
              {items.map((item, idx) => (
                <View
                  key={item.chiTietThue.id}
                  style={[styles.itemCard, item.duocChon && styles.itemCardActive]}
                >
                  {/* Item header */}
                  <View style={styles.itemHeader}>
                    <TouchableOpacity
                      style={[styles.checkbox, item.duocChon && styles.checkboxActive]}
                      onPress={() => {
                        const n = [...items];
                        n[idx].duocChon = !n[idx].duocChon;
                        setItems(n);
                      }}
                    >
                      {item.duocChon && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemName} numberOfLines={1}>{getName(item)}</Text>
                      <Text style={styles.itemPrice}>{fmtVND(getPrice(item))} / ngày</Text>
                    </View>
                    {item.duocChon && (
                      <View style={styles.itemActiveBadge}>
                        <Text style={styles.itemActiveBadgeText}>Đã chọn</Text>
                      </View>
                    )}
                  </View>

                  {/* Item body khi được chọn */}
                  {item.duocChon && (
                    <View style={styles.itemBody}>
                      {/* Thông tin thuê */}
                      {(item.chiTietThue as any).soNgayThue != null && (
                        <View style={styles.infoGrid}>
                          <View style={styles.infoCell}>
                            <Text style={styles.infoLabel}>Ngày thuê</Text>
                            <Text style={styles.infoVal}>{(item.chiTietThue as any).ngayThue}</Text>
                          </View>
                          <View style={styles.infoCell}>
                            <Text style={styles.infoLabel}>Số ngày</Text>
                            <Text style={styles.infoVal}>{(item.chiTietThue as any).soNgayThue} ngày</Text>
                          </View>
                          <View style={styles.infoCell}>
                            <Text style={styles.infoLabel}>Tiền thuê</Text>
                            <Text style={[styles.infoVal, { color: '#00897B', fontWeight: '700' }]}>
                              {fmtVND((item.chiTietThue as any).tienThueDenNay ?? 0)}
                            </Text>
                          </View>
                        </View>
                      )}

                      {/* Số lượng */}
                      <View style={styles.qtyRow}>
                        <Text style={styles.qtyLabel}>Số lượng trả:</Text>
                        <View style={styles.qtyCtrl}>
                          <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => {
                              const n = [...items];
                              n[idx].soLuongTra = String(Math.max(1, parseInt(n[idx].soLuongTra) - 1));
                              setItems(n);
                            }}
                          >
                            <Text style={styles.qtyBtnText}>−</Text>
                          </TouchableOpacity>
                          <TextInput
                            style={styles.qtyInput}
                            value={item.soLuongTra}
                            onChangeText={(v) => {
                              const n = [...items]; n[idx].soLuongTra = v; setItems(n);
                            }}
                            keyboardType="numeric"
                          />
                          <TouchableOpacity
                            style={[styles.qtyBtn, styles.qtyBtnPlus]}
                            onPress={() => {
                              const n = [...items];
                              n[idx].soLuongTra = String(
                                Math.min(getRemain(item), parseInt(n[idx].soLuongTra) + 1)
                              );
                              setItems(n);
                            }}
                          >
                            <Text style={[styles.qtyBtnText, { color: '#fff' }]}>+</Text>
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.qtyRemain}>/ {getRemain(item)} cần trả</Text>
                      </View>

                      {/* Lỗi hỏng */}
                      {item.danhSachLoi.length > 0 && (
                        <View style={styles.loiBox}>
                          <Text style={styles.loiBoxTitle}>⚠️ Lỗi hỏng đã ghi nhận</Text>
                          {item.danhSachLoi.map((l, li) => (
                            <View key={li} style={styles.loiItem}>
                              <Text style={styles.loiItemName}>{l.tenLoi} × {l.soLuong}</Text>
                              <Text style={styles.loiItemAmt}>{fmtVND(l.mucPhat * l.soLuong)}</Text>
                            </View>
                          ))}
                          <View style={styles.loiTotal}>
                            <Text style={styles.loiTotalLabel}>Tổng phạt</Text>
                            <Text style={styles.loiTotalVal}>{fmtVND(getLoiTotal(item.danhSachLoi))}</Text>
                          </View>
                        </View>
                      )}

                      <TouchableOpacity style={styles.addLoiBtn} onPress={() => openLoiModal(idx)}>
                        <Text style={styles.addLoiBtnText}>
                          {item.danhSachLoi.length > 0 ? '✏️ Chỉnh sửa lỗi hỏng' : '➕ Thêm lỗi hỏng (nếu có)'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Spacer for bottom bar */}
          <View style={{ height: 90 }} />
        </View>
      </ScrollView>

      {/* Bottom action bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarInner}>
          <View style={styles.bottomInfo}>
            <Text style={styles.bottomLabel}>Đã chọn</Text>
            <Text style={styles.bottomCount}>
              {items.filter(i => i.duocChon).length} trang phục
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.previewBtn, submitting && { opacity: 0.6 }]}
            onPress={handleXemHoaDon}
            disabled={submitting}
          >
            {submitting
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.previewBtnText}>Xem hóa đơn →</Text>
            }
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal chọn lỗi */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>⚠️ Ghi nhận lỗi hỏng</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSub}>Chọn loại lỗi và số lượng phát sinh</Text>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {danhSachLoi.map((loi) => {
                const sl = tempLoiSel.get(loi.id) ?? 0;
                return (
                  <View key={loi.id} style={[styles.loiModalRow, sl > 0 && styles.loiModalRowActive]}>
                    <View style={{ flex: 1, marginRight: 16 }}>
                      <Text style={styles.loiModalName}>{loi.tenLoi}</Text>
                      <Text style={styles.loiModalPhat}>{fmtVND(loi.mucPhat)} / lỗi</Text>
                      {loi.moTa ? <Text style={styles.loiModalDesc}>{loi.moTa}</Text> : null}
                    </View>
                    <View style={styles.counterBox}>
                      <TouchableOpacity
                        style={styles.counterBtn}
                        onPress={() => {
                          const n = new Map(tempLoiSel);
                          n.set(loi.id, Math.max(0, sl - 1));
                          setTempLoiSel(n);
                        }}
                      >
                        <Text style={styles.counterBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={[styles.counterVal, sl > 0 && { color: '#E53935', fontWeight: '800' }]}>
                        {sl}
                      </Text>
                      <TouchableOpacity
                        style={[styles.counterBtn, styles.counterBtnPlus]}
                        onPress={() => {
                          const n = new Map(tempLoiSel);
                          n.set(loi.id, sl + 1);
                          setTempLoiSel(n);
                        }}
                      >
                        <Text style={[styles.counterBtnText, { color: '#fff' }]}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalApply} onPress={applyLoi}>
                <Text style={styles.modalApplyText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const ACCENT = '#5B6FE6';
const BG = '#F4F6FB';
const CARD = '#FFFFFF';
const TEXT_DARK = '#1B2A4A';
const TEXT_MID = '#5A6478';
const TEXT_LIGHT = '#8892A6';
const BORDER = '#E8EAF0';
const RED = '#E53935';
const GREEN = '#00897B';
const MAX_W = 960;

const styles = StyleSheet.create({
  pageWrapper: { flex: 1, backgroundColor: BG },
  scrollArea: { flex: 1 },
  scrollContent: { alignItems: 'center', paddingBottom: 24 },
  centerCol: { width: '100%', maxWidth: MAX_W, paddingHorizontal: 24, paddingTop: 24 },

  loadingBox: { flex: 1, backgroundColor: BG, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: TEXT_LIGHT, fontSize: 14 },

  pageHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: { fontSize: 24, fontWeight: '800', color: TEXT_DARK },
  pageSub: { fontSize: 13, color: TEXT_LIGHT, marginTop: 3 },
  phieuBadge: {
    backgroundColor: '#EEF0FB', paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 10, borderWidth: 1.5, borderColor: '#D5D9F8',
  },
  phieuBadgeLabel: { color: ACCENT, fontWeight: '700', fontSize: 14 },

  topRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  card: {
    backgroundColor: CARD, borderRadius: 16, padding: 20,
    shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
    marginBottom: 16,
  },
  khCard: { flex: 1 },
  nvCard: { flex: 2 },

  cardSectionLabel: {
    fontSize: 11, fontWeight: '700', color: TEXT_LIGHT,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12,
  },
  khRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  khAvatar: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#EEF0FB',
    alignItems: 'center', justifyContent: 'center',
  },
  khAvatarText: { fontSize: 18, fontWeight: '800', color: ACCENT },
  khName: { fontSize: 16, fontWeight: '700', color: TEXT_DARK },
  khPhone: { fontSize: 12, color: TEXT_LIGHT, marginTop: 2 },

  nvChip: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 20, backgroundColor: '#F5F6FA', marginRight: 8, borderWidth: 1.5,
    borderColor: BORDER, gap: 7,
  },
  nvChipActive: { backgroundColor: '#EEF0FB', borderColor: ACCENT },
  nvDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#D0D4DD' },
  nvDotActive: { backgroundColor: ACCENT },
  nvText: { color: TEXT_LIGHT, fontSize: 13, fontWeight: '500' },
  nvTextActive: { color: ACCENT, fontWeight: '700' },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: TEXT_DARK },
  selectedBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF0FB',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, gap: 6,
  },
  selectedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: ACCENT },
  selectedBadgeText: { fontSize: 12, fontWeight: '600', color: ACCENT },

  itemGrid: { gap: 12 },
  itemCard: {
    borderWidth: 1.5, borderColor: BORDER, borderRadius: 14,
    backgroundColor: '#FAFBFC', overflow: 'hidden',
  },
  itemCardActive: { borderColor: ACCENT, backgroundColor: CARD },

  itemHeader: {
    flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12,
  },
  checkbox: {
    width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: '#D0D4DD',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  checkboxActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  checkmark: { color: '#fff', fontWeight: '800', fontSize: 13 },
  itemName: { fontSize: 14, fontWeight: '700', color: TEXT_DARK },
  itemPrice: { fontSize: 12, color: TEXT_LIGHT, marginTop: 2 },
  itemActiveBadge: {
    backgroundColor: '#EEF0FB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  itemActiveBadgeText: { fontSize: 11, fontWeight: '600', color: ACCENT },

  itemBody: {
    paddingHorizontal: 14, paddingBottom: 14,
    borderTopWidth: 1, borderTopColor: '#F0F1F5', paddingTop: 14,
  },

  infoGrid: {
    flexDirection: 'row', backgroundColor: '#F8F9FC', borderRadius: 10,
    padding: 12, gap: 8, marginBottom: 12,
  },
  infoCell: { flex: 1, alignItems: 'center' },
  infoLabel: {
    fontSize: 10, color: TEXT_LIGHT, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4,
  },
  infoVal: { fontSize: 13, fontWeight: '700', color: TEXT_DARK, textAlign: 'center' },

  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  qtyLabel: { fontSize: 13, color: TEXT_MID, fontWeight: '500' },
  qtyCtrl: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  qtyBtn: {
    width: 32, height: 32, borderRadius: 9, backgroundColor: '#F0F1F5',
    alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnPlus: { backgroundColor: ACCENT },
  qtyBtnText: { color: TEXT_DARK, fontSize: 16, fontWeight: '700' },
  qtyInput: {
    width: 46, height: 32, textAlign: 'center', fontSize: 14, fontWeight: '700',
    color: TEXT_DARK, backgroundColor: '#F8F9FC', borderRadius: 8, marginHorizontal: 4, padding: 0,
    borderWidth: 1.5, borderColor: BORDER,
  },
  qtyRemain: { fontSize: 12, color: TEXT_LIGHT },

  loiBox: {
    backgroundColor: '#FFF3F3', borderRadius: 10, padding: 12,
    marginBottom: 10, borderWidth: 1, borderColor: '#FFE0E0',
  },
  loiBoxTitle: {
    fontSize: 11, fontWeight: '700', color: RED,
    marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.4,
  },
  loiItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 4,
  },
  loiItemName: { fontSize: 12, color: TEXT_MID, flex: 1 },
  loiItemAmt: { fontSize: 12, color: RED, fontWeight: '700' },
  loiTotal: {
    flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: '#FFE0E0', marginTop: 6, paddingTop: 6,
  },
  loiTotalLabel: { fontSize: 12, fontWeight: '600', color: TEXT_MID },
  loiTotalVal: { fontSize: 13, fontWeight: '800', color: RED },

  addLoiBtn: {
    padding: 10, borderRadius: 10, borderWidth: 1.5,
    borderColor: '#D5D9F8', borderStyle: 'dashed',
    alignItems: 'center', backgroundColor: '#F8F9FC',
  },
  addLoiBtnText: { color: ACCENT, fontWeight: '600', fontSize: 13 },

  // Bottom bar
  bottomBar: {
    borderTopWidth: 1, borderTopColor: BORDER,
    backgroundColor: CARD, paddingVertical: 16, paddingHorizontal: 24,
    alignItems: 'center',
  },
  bottomBarInner: {
    width: '100%', maxWidth: MAX_W,
    flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  bottomInfo: { flex: 1 },
  bottomLabel: { fontSize: 11, color: TEXT_LIGHT, fontWeight: '500' },
  bottomCount: { fontSize: 18, fontWeight: '800', color: TEXT_DARK, marginTop: 1 },
  previewBtn: {
    backgroundColor: ACCENT, paddingVertical: 14, paddingHorizontal: 28,
    borderRadius: 12, alignItems: 'center',
    shadowColor: ACCENT, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 10, elevation: 6,
    minWidth: 180,
  },
  previewBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(10,15,35,0.45)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  modalBox: {
    backgroundColor: CARD, borderRadius: 20,
    padding: 28, width: '100%', maxWidth: 540,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15, shadowRadius: 30, elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 6,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: TEXT_DARK },
  modalCloseBtn: {
    width: 30, height: 30, borderRadius: 8, backgroundColor: '#F0F1F5',
    alignItems: 'center', justifyContent: 'center',
  },
  modalCloseText: { color: TEXT_MID, fontSize: 14, fontWeight: '600' },
  modalSub: { fontSize: 13, color: TEXT_LIGHT, marginBottom: 16 },
  modalScroll: { maxHeight: 380 },
  loiModalRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F0F1F5',
  },
  loiModalRowActive: {
    backgroundColor: '#FFF8F8', marginHorizontal: -8,
    paddingHorizontal: 8, borderRadius: 10,
  },
  loiModalName: { fontSize: 14, fontWeight: '600', color: TEXT_DARK },
  loiModalPhat: { fontSize: 12, color: RED, marginTop: 2, fontWeight: '500' },
  loiModalDesc: { fontSize: 11, color: TEXT_LIGHT, marginTop: 3 },
  counterBox: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  counterBtn: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: '#F0F1F5',
    alignItems: 'center', justifyContent: 'center',
  },
  counterBtnPlus: { backgroundColor: ACCENT },
  counterBtnText: { color: TEXT_DARK, fontSize: 16, fontWeight: 'bold' },
  counterVal: {
    fontSize: 16, fontWeight: '700', color: TEXT_LIGHT,
    minWidth: 26, textAlign: 'center',
  },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  modalCancel: {
    flex: 1, padding: 13, borderRadius: 12,
    borderWidth: 1.5, borderColor: BORDER, alignItems: 'center',
  },
  modalCancelText: { color: TEXT_MID, fontWeight: '600', fontSize: 14 },
  modalApply: {
    flex: 1, padding: 13, borderRadius: 12,
    backgroundColor: ACCENT, alignItems: 'center',
    shadowColor: ACCENT, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 10, elevation: 6,
  },
  modalApplyText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
