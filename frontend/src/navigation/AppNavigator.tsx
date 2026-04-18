import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { TouchableOpacity, Text } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import DanhSachLoiScreen from '../screens/loi/DanhSachLoiScreen';
import ThemSuaLoiScreen from '../screens/loi/ThemSuaLoiScreen';
import TimKiemKHScreen from '../screens/tratrangphuc/TimKiemKHScreen';
import DanhSachPhieuThueScreen from '../screens/tratrangphuc/DanhSachPhieuThueScreen';
import ChonTraScreen from '../screens/tratrangphuc/ChonTraScreen';
import PreviewHoaDonScreen from '../screens/tratrangphuc/PreviewHoaDonScreen';
import KetQuaScreen from '../screens/tratrangphuc/KetQuaScreen';
import ThongKeDoanhThuScreen from '../screens/thongke/ThongKeDoanhThuScreen';
import ChiTietHoaDonScreen from '../screens/thongke/ChiTietHoaDonScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#1B2A4A',
          headerTitleStyle: { fontWeight: '700', fontSize: 17, color: '#1B2A4A' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#F5F6FA' },
          headerLeft: ({ canGoBack }) => 
            canGoBack ? (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#F0F1F5',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                  marginLeft: 4,
                  marginRight: 10,
                }}
                onPress={() => navigation.goBack()}
              >
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#5B6FE6', marginRight: 4 }}>‹</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1B2A4A' }}>Quay lại</Text>
              </TouchableOpacity>
            ) : null,
        })}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} initialParams={{ nhanVien: { id: 1, username: 'Admin (Dev)' } }} />
        <Stack.Screen name="DanhSachLoi" component={DanhSachLoiScreen} options={{ title: 'Quản Lý Lỗi' }} />
        <Stack.Screen name="ThemSuaLoi" component={ThemSuaLoiScreen} options={({ route }) => ({
          title: route.params?.loi ? 'Sửa Lỗi' : 'Thêm Lỗi Mới',
        })} />
        <Stack.Screen name="TimKiemKH" component={TimKiemKHScreen} options={{ title: 'Tìm Kiếm Khách Hàng' }} />
        <Stack.Screen name="DanhSachPhieuThue" component={DanhSachPhieuThueScreen} options={{ title: 'Phiếu Thuê' }} />
        <Stack.Screen name="ChonTra" component={ChonTraScreen} options={{ title: 'Chọn Trang Phục Trả' }} />
        <Stack.Screen name="PreviewHoaDon" component={PreviewHoaDonScreen} options={{ title: 'Hóa Đơn' }} />
        <Stack.Screen name="KetQua" component={KetQuaScreen} options={{ title: 'Kết Quả', headerLeft: () => null }} />
        <Stack.Screen name="ThongKeDoanhThu" component={ThongKeDoanhThuScreen} options={{ title: 'Thống Kê Doanh Thu' }} />
        <Stack.Screen name="ChiTietHoaDon" component={ChiTietHoaDonScreen} options={{ title: 'Chi Tiết Hóa Đơn Trả' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
