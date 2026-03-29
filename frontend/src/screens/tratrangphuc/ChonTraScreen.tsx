import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Alert,
  ActivityIndicator, SafeAreaView, Modal, TextInput, ScrollView, Switch,
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

  // Modal chon loi
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItemIdx, setCurrentItemIdx] = useState<number>(-1);
  const [tempLoiSel, setTempLoiSel] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    Promise.all([loiApi.layTatCa(), tratrangphucApi.layNhanVien()])
      .then(([lois, nvList]) => {
        setDanhSachLoi(lois);
        setNhanVienList(nvList);
        if (nvList.length > 0) setNhanVienId(nvList[0].id);
        setItems(
          (phieuThue.chiTietThueList || [])
            .filter((c) => !c.daTra)
            .map((c) => ({
              chiTietThue: c,
              duocChon: true,
              soLuongTra: (c.soLuong - (c.soLuongDaTra ?? 0)).toString(),
              danhSachLoi: [],
            }))
        );
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
        phieuThueId: phieuThue.id,
        nhanVienId,
        danhSachTra: selected.map((i) => ({
          chiTietThueId: i.chiTietThue.id,
          soLuongTra: parseInt(i.soLuongTra) || 1,
          danhSachLoi: i.danhSachLoi.map(({ loiId, soLuong }) => ({ loiId, soLuong })),
        })),
      };
      const hoaDon = await tratrangphucApi.preview(request);
      navigation.navigate('PreviewHoaDon', { request, hoaDon });
    } catch (e: any) {
      Alert.alert('Lỗi', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#e94560" style={{ flex: 1 }} />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Chon nhan vien */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nhân viên xử lý</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
            {nhanVienList.map((nv) => (
              <TouchableOpacity
                key={nv.id}
                style={[styles.nvChip, nv.id === nhanVienId && styles.nvChipActive]}
                onPress={() => setNhanVienId(nv.id)}
              >
                <Text style={[styles.nvChipText, nv.id === nhanVienId && styles.nvChipTextActive]}>
                  {nv.ten}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Danh sach trang phuc */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trang phục cần trả</Text>
          {items.map((item, idx) => (
            <View key={item.chiTietThue.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Switch
                  value={item.duocChon}
                  onValueChange={(v) => {
                    const n = [...items]; n[idx].duocChon = v; setItems(n);
                  }}
                  thumbColor={item.duocChon ? '#e94560' : '#ccc'}
                  trackColor={{ false: '#ddd', true: '#fbb' }}
                />
                <Text style={styles.tenTP} numberOfLines={1}>{item.chiTietThue.trangPhuc?.ten}</Text>
              </View>

              {item.duocChon && (
                <View style={styles.itemBody}>
                  <View style={styles.soLuongRow}>
                    <Text style={styles.smallLabel}>Số lượng trả:</Text>
                    <TextInput
                      style={styles.soLuongInput}
                      value={item.soLuongTra}
                      onChangeText={(v) => {
                        const n = [...items]; n[idx].soLuongTra = v; setItems(n);
                      }}
                      keyboardType="numeric"
                    />
                    <Text style={styles.smallLabel}>
                      / {item.chiTietThue.soLuong - (item.chiTietThue.soLuongDaTra ?? 0)} còn lại
                    </Text>
                  </View>

                  {/* Danh sach loi da chon */}
                  {item.danhSachLoi.length > 0 && (
                    <View style={styles.loiList}>
                      {item.danhSachLoi.map((l, li) => (
                        <Text key={li} style={styles.loiTag}>
                          ⚠ {l.tenLoi} x{l.soLuong} = {(l.mucPhat * l.soLuong).toLocaleString('vi-VN')}đ
                        </Text>
                      ))}
                    </View>
                  )}

                  <TouchableOpacity style={styles.addLoiBtn} onPress={() => openLoiModal(idx)}>
                    <Text style={styles.addLoiBtnText}>
                      {item.danhSachLoi.length > 0 ? '✏️ Sửa lỗi' : '+ Thêm lỗi hỏng'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.previewBtn, submitting && { opacity: 0.6 }]}
        onPress={handleXemHoaDon}
        disabled={submitting}
      >
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.previewBtnText}>Xem hóa đơn →</Text>}
      </TouchableOpacity>

      {/* Modal chon loi */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Chọn lỗi hỏng</Text>
            <ScrollView style={{ maxHeight: 360 }}>
              {danhSachLoi.map((loi) => {
                const sl = tempLoiSel.get(loi.id) ?? 0;
                return (
                  <View key={loi.id} style={styles.loiRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.loiName}>{loi.tenLoi}</Text>
                      <Text style={styles.loiPhat}>{loi.mucPhat.toLocaleString('vi-VN')}đ/lỗi</Text>
                    </View>
                    <View style={styles.counterBox}>
                      <TouchableOpacity
                        style={styles.counterBtn}
                        onPress={() => {
                          const newSel = new Map(tempLoiSel);
                          newSel.set(loi.id, Math.max(0, sl - 1));
                          setTempLoiSel(newSel);
                        }}
                      >
                        <Text style={styles.counterBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.counterVal}>{sl}</Text>
                      <TouchableOpacity
                        style={styles.counterBtn}
                        onPress={() => {
                          const newSel = new Map(tempLoiSel);
                          newSel.set(loi.id, sl + 1);
                          setTempLoiSel(newSel);
                        }}
                      >
                        <Text style={styles.counterBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={applyLoi}>
                <Text style={styles.applyBtnText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  section: { margin: 16, marginBottom: 0 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  nvChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#fff', marginRight: 8, borderWidth: 1.5, borderColor: '#ddd',
  },
  nvChipActive: { backgroundColor: '#1a1a2e', borderColor: '#1a1a2e' },
  nvChipText: { color: '#555', fontSize: 14 },
  nvChipTextActive: { color: '#fff', fontWeight: '700' },
  itemCard: {
    backgroundColor: '#fff', borderRadius: 12, marginTop: 12, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 5, elevation: 2,
  },
  itemHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tenTP: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
  itemBody: { marginTop: 10 },
  soLuongRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  smallLabel: { fontSize: 13, color: '#555' },
  soLuongInput: {
    borderWidth: 1.5, borderColor: '#ddd', borderRadius: 8, width: 60,
    padding: 6, textAlign: 'center', fontSize: 15, fontWeight: '700', color: '#1a1a2e',
  },
  loiList: { marginTop: 8, gap: 4 },
  loiTag: { fontSize: 13, color: '#e94560', backgroundColor: '#fff5f6', padding: 6, borderRadius: 6 },
  addLoiBtn: {
    marginTop: 8, padding: 8, borderRadius: 8, borderWidth: 1.5,
    borderColor: '#0f3460', alignItems: 'center', borderStyle: 'dashed',
  },
  addLoiBtnText: { color: '#0f3460', fontWeight: '600', fontSize: 13 },
  previewBtn: {
    margin: 16, backgroundColor: '#e94560', padding: 16, borderRadius: 14, alignItems: 'center',
  },
  previewBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginBottom: 16 },
  loiRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  loiName: { fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
  loiPhat: { fontSize: 13, color: '#e94560', marginTop: 2 },
  counterBox: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  counterBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#1a1a2e',
    alignItems: 'center', justifyContent: 'center',
  },
  counterBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  counterVal: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', minWidth: 24, textAlign: 'center' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: '#ddd', alignItems: 'center' },
  cancelBtnText: { color: '#555', fontWeight: '600' },
  applyBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#e94560', alignItems: 'center' },
  applyBtnText: { color: '#fff', fontWeight: '700' },
});
