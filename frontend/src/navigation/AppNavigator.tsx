import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

import HomeScreen from '../screens/HomeScreen';
import DanhSachLoiScreen from '../screens/loi/DanhSachLoiScreen';
import ThemSuaLoiScreen from '../screens/loi/ThemSuaLoiScreen';
import TimKiemKHScreen from '../screens/tratrangphuc/TimKiemKHScreen';
import DanhSachPhieuThueScreen from '../screens/tratrangphuc/DanhSachPhieuThueScreen';
import ChonTraScreen from '../screens/tratrangphuc/ChonTraScreen';
import PreviewHoaDonScreen from '../screens/tratrangphuc/PreviewHoaDonScreen';
import KetQuaScreen from '../screens/tratrangphuc/KetQuaScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Trang Chủ' }} />
        <Stack.Screen name="DanhSachLoi" component={DanhSachLoiScreen} options={{ title: 'Quản Lý Lỗi Hỏng Phạt' }} />
        <Stack.Screen name="ThemSuaLoi" component={ThemSuaLoiScreen} options={({ route }) => ({
          title: route.params?.loi ? 'Sửa Lỗi' : 'Thêm Lỗi Mới',
        })} />
        <Stack.Screen name="TimKiemKH" component={TimKiemKHScreen} options={{ title: 'Tìm Kiếm Khách Hàng' }} />
        <Stack.Screen name="DanhSachPhieuThue" component={DanhSachPhieuThueScreen} options={{ title: 'Phiếu Thuê Đang Mượn' }} />
        <Stack.Screen name="ChonTra" component={ChonTraScreen} options={{ title: 'Chọn Trang Phục Trả' }} />
        <Stack.Screen name="PreviewHoaDon" component={PreviewHoaDonScreen} options={{ title: 'Xem Trước Hóa Đơn' }} />
        <Stack.Screen name="KetQua" component={KetQuaScreen} options={{ title: 'Kết Quả', headerLeft: () => null }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
