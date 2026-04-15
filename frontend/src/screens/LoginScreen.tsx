import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Animated, ActivityIndicator, Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { dangNhap } from '../api/authApi';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Login'> };

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(32)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 550, useNativeDriver: true }),
      ]),
      Animated.timing(cardAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      const res = await dangNhap({ username: username.trim(), password: password.trim() });
      // Chuyển sang Home kèm thông tin nhân viên
      navigation.replace('Home', { nhanVien: res.nhanVien });
    } catch (err: any) {
      Alert.alert('Đăng nhập thất bại', err.message || 'Sai tên đăng nhập hoặc mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F6FA" />

      {/* Header / Logo */}
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🎭</Text>
        </View>
        <Text style={styles.appName}>Quản Lý</Text>
        <Text style={styles.appSub}>Cho Thuê Trang Phục</Text>
      </Animated.View>

      {/* Card đăng nhập */}
      <Animated.View style={[styles.card, { opacity: cardAnim }]}>
        <Text style={styles.cardTitle}>Đăng Nhập</Text>
        <Text style={styles.cardDesc}>Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.</Text>

        {/* Tên đăng nhập */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tên đăng nhập</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>👤</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên đăng nhập..."
              placeholderTextColor="#B0BAC9"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>
        </View>

        {/* Mật khẩu */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mật khẩu</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Nhập mật khẩu..."
              placeholderTextColor="#B0BAC9"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn}>
              <Text style={styles.inputIcon}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Nút đăng nhập */}
        <TouchableOpacity
          style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
          onPress={handleLogin}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={styles.loginBtnText}>Đăng Nhập →</Text>
          }
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.version}>v1.0.0 • Costume Rental Management</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#1B2A4A', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 5,
    marginBottom: 16,
  },
  logoEmoji: { fontSize: 40 },
  appName: { fontSize: 30, fontWeight: '900', color: '#1B2A4A' },
  appSub: { fontSize: 14, color: '#8892A6', marginTop: 4, fontWeight: '500' },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#1B2A4A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 22, fontWeight: '800', color: '#1B2A4A', marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13, color: '#8892A6', marginBottom: 24, lineHeight: 19,
  },

  inputGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '700', color: '#4B5A70', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F5F6FA', borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E8EAF0',
    paddingHorizontal: 14,
  },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: {
    flex: 1, height: 50, fontSize: 15,
    color: '#1B2A4A', fontWeight: '500',
  },
  eyeBtn: { padding: 4 },

  loginBtn: {
    marginTop: 8,
    backgroundColor: '#5B6FE6',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5B6FE6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5 },

  version: {
    textAlign: 'center', color: '#C4CAD4',
    paddingTop: 28, fontSize: 12, fontWeight: '500',
  },
});
