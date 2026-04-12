import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert,
  ActivityIndicator, SafeAreaView, Modal, TextInput, ScrollView,
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
  chiTietThue: ChiTietThue;
  duocChon: boolean;
  soLuongTra: string;
  danhSachLoi: (LoiPhatRequest & { tenLoi: string; mucPhat: number })[];
}

export default function ChonTraScreen({ navigation, route }: Props) {
  const { phieuThue, khachHang } = route.params;
  const [items, setItems] = useState<ItemState[]>([]);
  const [danhSachLoi, setDanhSachLoi] = useState<Loi[]>([]);
  const [nhanVienList, setNhanVienList] = useState<any[]>([]);
  const [nhanVienId, setNhanVienId] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItemIdx, setCurrentItemIdx] = useState<number>(-1);
  const [tempLoiSel, setTempLoiSel] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    Promise.all([loiApi.layTatCa(), tratrangphucApi.layNhanVien()])
      .then(([lois, nvList]) => {
        setDanhSachLoi(lois);
        setNhanVienList(nvList);
        if (nvList.length > 0) setNhanVienId(nvList[0].id);
        const rawList = (phieuThue as any).danhSachChuaTra || phieuThue.chiTietThueList || [];
        setItems(rawList.filter((c: any) => !c.daTra).map((c: any) => ({
          chiTietThue: {
            id: c.id, soLuong: c.soLuong ?? 1, thanhTien: c.thanhTien ?? 0,
            trangPhuc: c.trangPhuc ?? { id: 0, ten: c.tenTrangPhuc ?? 'N/A', donGia: c.donGia ?? 0, soLuong: 0, soLuongThue: 0 },
            daTra: c.daTra ?? false, soLuongDaTra: c.soLuongDaTra ?? 0,
            tenTrangPhuc: c.tenTrangPhuc, donGia: c.donGia, ngayThue: c.ngayThue,
            soNgayThue: c.soNgayThue, tienThueDenNay: c.tienThueDenNay,
          } as any,
          duocChon: true, soLuongTra: String(c.soLuong ?? 1), danhSachLoi: [],
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
    if (nhanVienId === 0) { Alert.alert('Lỗi', 'Vui lòng chọn nhân viên'); return; }
    try {
      setSubmitting(true);
      const request = {
        phieuThueId: phieuThue.id, nhanVienId,
        danhSachTra: selected.map((i) => ({
          chiTietThueId: i.chiTietThue.id, soLuongTra: parseInt(i.soLuongTra) || 1,
          danhSachLoi: i.danhSachLoi.map(({ loiId, soLuong }) => ({ loiId, soLuong })),
        })),
      };
      const hoaDon = await tratrangphucApi.preview(request);
      navigation.navigate('PreviewHoaDon', { request, hoaDon });
    } catch (e: any) { Alert.alert('Lỗi', e.message); }
    finally { setSubmitting(false); }
  };

  const fmtVND = (v: number) => v?.toLocaleString('vi-VN') + 'đ';
  const getName = (i: ItemState) => (i.chiTietThue as any).tenTrangPhuc || i.chiTietThue.trangPhuc?.ten || 'N/A';
  const getPrice = (i: ItemState) => (i.chiTietThue as any).donGia ?? i.chiTietThue.trangPhuc?.donGia ?? 0;
  const getRemain = (i: ItemState) => i.chiTietThue.soLuong - (i.chiTietThue.soLuongDaTra ?? 0);
  const getLoiTotal = (ds: ItemState['danhSachLoi']) => ds.reduce((s, l) => s + l.mucPhat * l.soLuong, 0);

  if (loading) return <View style={styles.loadingBox}><ActivityIndicator size="large" color="#5B6FE6" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Info banner */}
        <View style={styles.banner}>
          <View><Text style={styles.bannerLabel}>Khách hàng</Text><Text style={styles.bannerVal}>{khachHang.ten}</Text></View>
          <View style={{ alignItems: 'flex-end' }}><Text style={styles.bannerLabel}>Phiếu thuê</Text><Text style={[styles.bannerVal, { color: '#5B6FE6' }]}>#{phieuThue.id}</Text></View>
        </View>

        {/* Nhân viên */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍💼 Nhân viên xử lý</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {nhanVienList.map((nv) => (
              <TouchableOpacity key={nv.id} style={[styles.nvChip, nv.id === nhanVienId && styles.nvChipActive]} onPress={() => setNhanVienId(nv.id)}>
                <View style={[styles.nvDot, nv.id === nhanVienId && styles.nvDotActive]} />
                <Text style={[styles.nvText, nv.id === nhanVienId && styles.nvTextActive]}>{nv.ten}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trang phục */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>👗 Trang phục cần trả</Text>
            <Text style={styles.sectionCount}>{items.filter(i => i.duocChon).length}/{items.length} đã chọn</Text>
          </View>
          {items.map((item, idx) => (
            <View key={item.chiTietThue.id} style={[styles.itemCard, item.duocChon && styles.itemCardActive]}>
              <View style={styles.itemHeader}>
                <TouchableOpacity style={[styles.checkbox, item.duocChon && styles.checkboxActive]}
                  onPress={() => { const n = [...items]; n[idx].duocChon = !n[idx].duocChon; setItems(n); }}>
                  {item.duocChon && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName} numberOfLines={1}>{getName(item)}</Text>
                  <Text style={styles.itemPrice}>{fmtVND(getPrice(item))}/ngày</Text>
                </View>
              </View>
              {item.duocChon && (
                <View style={styles.itemBody}>
                  {(item.chiTietThue as any).soNgayThue != null && (
                    <View style={styles.miniRow}>
                      <View style={styles.miniCell}><Text style={styles.miniLabel}>Ngày thuê</Text><Text style={styles.miniVal}>{(item.chiTietThue as any).ngayThue}</Text></View>
                      <View style={styles.miniCell}><Text style={styles.miniLabel}>Số ngày</Text><Text style={styles.miniVal}>{(item.chiTietThue as any).soNgayThue} ngày</Text></View>
                      <View style={styles.miniCell}><Text style={styles.miniLabel}>Tiền thuê</Text><Text style={[styles.miniVal, { color: '#00897B' }]}>{fmtVND((item.chiTietThue as any).tienThueDenNay ?? 0)}</Text></View>
                    </View>
                  )}
                  <View style={styles.qtyRow}>
                    <Text style={styles.qtyLabel}>Số lượng trả:</Text>
                    <View style={styles.qtyCtrl}>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => { const n=[...items]; n[idx].soLuongTra = String(Math.max(1, parseInt(n[idx].soLuongTra)-1)); setItems(n); }}>
                        <Text style={styles.qtyBtnText}>−</Text></TouchableOpacity>
                      <TextInput style={styles.qtyInput} value={item.soLuongTra}
                        onChangeText={(v) => { const n=[...items]; n[idx].soLuongTra=v; setItems(n); }} keyboardType="numeric" />
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => { const n=[...items]; n[idx].soLuongTra = String(Math.min(getRemain(item), parseInt(n[idx].soLuongTra)+1)); setItems(n); }}>
                        <Text style={styles.qtyBtnText}>+</Text></TouchableOpacity>
                    </View>
                    <Text style={styles.qtyRemain}>/ {getRemain(item)} còn lại</Text>
                  </View>

                  {item.danhSachLoi.length > 0 && (
                    <View style={styles.loiBox}>
                      <Text style={styles.loiBoxTitle}>Lỗi hỏng đã ghi nhận:</Text>
                      {item.danhSachLoi.map((l, li) => (
                        <View key={li} style={styles.loiItem}>
                          <Text style={styles.loiItemName}>⚠️ {l.tenLoi} x{l.soLuong}</Text>
                          <Text style={styles.loiItemAmt}>{fmtVND(l.mucPhat * l.soLuong)}</Text>
                        </View>
                      ))}
                      <View style={styles.loiTotal}><Text style={styles.loiTotalLabel}>Tổng phạt</Text><Text style={styles.loiTotalVal}>{fmtVND(getLoiTotal(item.danhSachLoi))}</Text></View>
                    </View>
                  )}

                  <TouchableOpacity style={styles.addLoiBtn} onPress={() => openLoiModal(idx)}>
                    <Text style={styles.addLoiBtnText}>{item.danhSachLoi.length > 0 ? '✏️ Sửa lỗi hỏng' : '➕ Thêm lỗi hỏng (nếu có)'}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <View><Text style={styles.bottomLabel}>Đã chọn</Text><Text style={styles.bottomCount}>{items.filter(i=>i.duocChon).length} trang phục</Text></View>
        <TouchableOpacity style={[styles.previewBtn, submitting && {opacity:0.6}]} onPress={handleXemHoaDon} disabled={submitting}>
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.previewBtnText}>Xem hóa đơn →</Text>}
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>⚠️ Chọn lỗi hỏng</Text>
            <Text style={styles.modalSub}>Danh sách lỗi từ hệ thống Quản lý lỗi</Text>
            <ScrollView style={{ maxHeight: 360 }}>
              {danhSachLoi.map((loi) => {
                const sl = tempLoiSel.get(loi.id) ?? 0;
                return (
                  <View key={loi.id} style={[styles.loiModalRow, sl > 0 && styles.loiModalRowActive]}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text style={styles.loiModalName}>{loi.tenLoi}</Text>
                      <Text style={styles.loiModalPhat}>{fmtVND(loi.mucPhat)} / lỗi</Text>
                      {loi.moTa ? <Text style={styles.loiModalDesc}>{loi.moTa}</Text> : null}
                    </View>
                    <View style={styles.counterBox}>
                      <TouchableOpacity style={styles.counterBtn} onPress={() => { const n = new Map(tempLoiSel); n.set(loi.id, Math.max(0, sl-1)); setTempLoiSel(n); }}>
                        <Text style={styles.counterBtnText}>−</Text></TouchableOpacity>
                      <Text style={[styles.counterVal, sl > 0 && { color: '#E53935', fontWeight: '800' }]}>{sl}</Text>
                      <TouchableOpacity style={[styles.counterBtn, styles.counterBtnPlus]} onPress={() => { const n = new Map(tempLoiSel); n.set(loi.id, sl+1); setTempLoiSel(n); }}>
                        <Text style={[styles.counterBtnText, { color: '#fff' }]}>+</Text></TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}><Text style={styles.modalCancelText}>Hủy</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalApply} onPress={applyLoi}><Text style={styles.modalApplyText}>Xác nhận</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  scrollContent: { paddingBottom: 100 },
  loadingBox: { flex: 1, backgroundColor: '#F5F6FA', justifyContent: 'center', alignItems: 'center' },

  banner: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFFFFF', marginHorizontal: 16, marginTop: 12, borderRadius: 14, padding: 16, shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  bannerLabel: { fontSize: 11, color: '#8892A6', fontWeight: '500', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.4 },
  bannerVal: { fontSize: 15, fontWeight: '700', color: '#1B2A4A' },

  section: { marginHorizontal: 16, marginTop: 18 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1B2A4A', marginBottom: 10 },
  sectionCount: { fontSize: 13, color: '#5B6FE6', fontWeight: '600', marginBottom: 10 },

  nvChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, backgroundColor: '#FFFFFF', marginRight: 8, borderWidth: 1.5, borderColor: '#E8EAF0', gap: 6 },
  nvChipActive: { backgroundColor: '#EEF0FB', borderColor: '#5B6FE6' },
  nvDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#D0D4DD' },
  nvDotActive: { backgroundColor: '#5B6FE6' },
  nvText: { color: '#8892A6', fontSize: 13, fontWeight: '500' },
  nvTextActive: { color: '#5B6FE6', fontWeight: '700' },

  itemCard: { backgroundColor: '#FFFFFF', borderRadius: 14, marginBottom: 10, borderWidth: 1.5, borderColor: '#E8EAF0', overflow: 'hidden' },
  itemCardActive: { borderColor: '#5B6FE6' },
  itemHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  checkbox: { width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: '#D0D4DD', alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: '#5B6FE6', borderColor: '#5B6FE6' },
  checkmark: { color: '#fff', fontWeight: '800', fontSize: 13 },
  itemName: { fontSize: 14, fontWeight: '700', color: '#1B2A4A' },
  itemPrice: { fontSize: 12, color: '#8892A6', marginTop: 1 },
  itemBody: { paddingHorizontal: 14, paddingBottom: 14, borderTopWidth: 1, borderTopColor: '#F0F1F5', paddingTop: 12 },

  miniRow: { flexDirection: 'row', backgroundColor: '#F8F9FC', borderRadius: 10, padding: 10, marginBottom: 10, gap: 6 },
  miniCell: { flex: 1, alignItems: 'center' },
  miniLabel: { fontSize: 10, color: '#8892A6', fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 3 },
  miniVal: { fontSize: 12, fontWeight: '700', color: '#1B2A4A' },

  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  qtyLabel: { fontSize: 13, color: '#5A6478', fontWeight: '500' },
  qtyCtrl: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#F0F1F5', alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { color: '#1B2A4A', fontSize: 16, fontWeight: '700' },
  qtyInput: { width: 44, height: 30, textAlign: 'center', fontSize: 14, fontWeight: '700', color: '#1B2A4A', backgroundColor: '#F8F9FC', borderRadius: 6, marginHorizontal: 4, padding: 0 },
  qtyRemain: { fontSize: 11, color: '#8892A6' },

  loiBox: { backgroundColor: '#FFF3F3', borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#FFE0E0' },
  loiBoxTitle: { fontSize: 11, fontWeight: '700', color: '#E53935', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 },
  loiItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  loiItemName: { fontSize: 12, color: '#5A6478', flex: 1 },
  loiItemAmt: { fontSize: 12, color: '#E53935', fontWeight: '700' },
  loiTotal: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#FFE0E0', marginTop: 6, paddingTop: 6 },
  loiTotalLabel: { fontSize: 12, fontWeight: '600', color: '#5A6478' },
  loiTotalVal: { fontSize: 13, fontWeight: '800', color: '#E53935' },

  addLoiBtn: { padding: 9, borderRadius: 8, borderWidth: 1.5, borderColor: '#D0D4FA', borderStyle: 'dashed', alignItems: 'center', backgroundColor: '#F8F9FC' },
  addLoiBtnText: { color: '#5B6FE6', fontWeight: '600', fontSize: 12 },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F0F1F5', padding: 14, paddingBottom: 18, gap: 14 },
  bottomLabel: { fontSize: 11, color: '#8892A6', fontWeight: '500' },
  bottomCount: { fontSize: 15, fontWeight: '700', color: '#1B2A4A', marginTop: 1 },
  previewBtn: { flex: 1, backgroundColor: '#5B6FE6', paddingVertical: 13, borderRadius: 12, alignItems: 'center', shadowColor: '#5B6FE6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 6 },
  previewBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, maxHeight: '80%' },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0', alignSelf: 'center', marginBottom: 18 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1B2A4A', marginBottom: 4 },
  modalSub: { fontSize: 13, color: '#8892A6', marginBottom: 16 },
  loiModalRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F1F5' },
  loiModalRowActive: { backgroundColor: '#FFF8F8', marginHorizontal: -6, paddingHorizontal: 6, borderRadius: 10 },
  loiModalName: { fontSize: 14, fontWeight: '600', color: '#1B2A4A' },
  loiModalPhat: { fontSize: 12, color: '#E53935', marginTop: 2, fontWeight: '500' },
  loiModalDesc: { fontSize: 11, color: '#8892A6', marginTop: 2 },
  counterBox: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  counterBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#F0F1F5', alignItems: 'center', justifyContent: 'center' },
  counterBtnPlus: { backgroundColor: '#5B6FE6' },
  counterBtnText: { color: '#1B2A4A', fontSize: 16, fontWeight: 'bold' },
  counterVal: { fontSize: 16, fontWeight: '700', color: '#8892A6', minWidth: 24, textAlign: 'center' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 18 },
  modalCancel: { flex: 1, padding: 13, borderRadius: 12, borderWidth: 1.5, borderColor: '#E8EAF0', alignItems: 'center' },
  modalCancelText: { color: '#5A6478', fontWeight: '600', fontSize: 14 },
  modalApply: { flex: 1, padding: 13, borderRadius: 12, backgroundColor: '#5B6FE6', alignItems: 'center', shadowColor: '#5B6FE6', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  modalApplyText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
