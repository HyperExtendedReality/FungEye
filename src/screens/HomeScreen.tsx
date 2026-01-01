import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '@react-native-vector-icons/material-icons';
import { useFungiStore } from '../store/useFungiStore';
import { colors } from '../theme/colors';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../theme/metrics';

export const HomeScreen = () => {
  const { setCurrentScreen, isDarkMode, toggleTheme } = useFungiStore();
  const { bottom, top, left, right } = useSafeAreaInsets();

  return (
    <View style={[styles.container, isDarkMode ? styles.dark : styles.light]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <ImageBackground
          source={
            isDarkMode
              ? require('../assets/images/dark.png')
              : require('../assets/images/light.png')
          }
          style={styles.heroImage}
          resizeMode="cover"
        >
          {/* Header */}
          <View
            style={[
              styles.header,
              { marginTop: top + verticalScale(24) },
              { marginLeft: left + horizontalScale(24) },
            ]}
          >
            <View style={styles.branding}>
              <View style={styles.logoContainer}>
                <View style={styles.logoGlow} />
                <Icon
                  name="visibility"
                  size={moderateScale(30)}
                  color="#4ade80"
                />
              </View>
              <Text style={styles.title}>FungEye</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.themeToggle,
                { marginRight: right + horizontalScale(24) },
              ]}
              onPress={toggleTheme}
            >
              <Icon
                name={isDarkMode ? 'light-mode' : 'dark-mode'}
                size={moderateScale(20)}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          {/* Offline Status Pill */}
          <View style={styles.statusPillContainer}>
            <View style={styles.statusPill}>
              <View style={styles.onlineIndicator}>
                <View style={[styles.ping, { backgroundColor: '#4ade80' }]} />
                <View style={[styles.dot, { backgroundColor: '#4ade80' }]} />
              </View>
              <Text style={styles.statusText}>OFFLINE DATABASE ACTIVE</Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Bottom Sheet Content */}
      <View
        style={[
          styles.bottomSheetContentContainer,
          isDarkMode ? styles.bgDark : styles.bgLight,
          { paddingBottom: verticalScale(24) + bottom },
        ]}
      >
        {/* Decorative elements */}
        <View style={styles.handleBar} />
        <View style={styles.decorativeIcon}>
          <Icon
            name="visibility"
            size={moderateScale(220)}
            color={isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'}
          />
        </View>

        <View style={styles.contentInner}>
          <View style={styles.textBlock}>
            <Text
              style={[
                styles.heading,
                isDarkMode ? styles.textWhite : styles.textDark,
              ]}
            >
              Unlock nature's{'\n'}
              <Text style={styles.gradientText}>hidden vision.</Text>
            </Text>
            <Text
              style={[
                styles.subheading,
                isDarkMode ? styles.textGrayDark : styles.textGrayLight,
              ]}
            >
              Point your camera to instantly identify species, toxicity, and
              mystical properties.
            </Text>
          </View>

          <View style={styles.actionGrid}>
            {/* Start Scan Button */}
            <TouchableOpacity
              style={styles.scanBtn}
              onPress={() => setCurrentScreen('camera')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#4ade80', '#3ed674']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.scanBtnGradient}
              >
                <Icon
                  name="filter-center-focus"
                  size={moderateScale(28)}
                  color="#0c120e"
                />
                <Text style={styles.scanBtnText}>START SCAN</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.secondaryActions}>
              {/* History Button */}
              <TouchableOpacity
                style={[
                  styles.secondaryBtn,
                  styles.historyBtn,
                  isDarkMode ? styles.btnDark : styles.btnLight,
                ]}
                onPress={() => setCurrentScreen('library')} // Assuming History leads to Library
              >
                <Icon
                  name="history"
                  size={moderateScale(24)}
                  color={isDarkMode ? '#94a3b8' : '#475569'}
                />
              </TouchableOpacity>

              {/* Donate Button */}
              <TouchableOpacity
                style={[
                  styles.secondaryBtn,
                  styles.donateBtn,
                  isDarkMode ? styles.btnDark : styles.btnLight,
                ]}
                onPress={() => setCurrentScreen('donation')}
                activeOpacity={0.8}
              >
                <Icon
                  name="volunteer-activism"
                  size={moderateScale(24)}
                  color="#d946ef"
                />
                <Text
                  style={[
                    styles.donateText,
                    isDarkMode ? styles.textGrayDark : styles.textDark,
                  ]}
                >
                  Donate to Research
                </Text>
              </TouchableOpacity>

              {/* Settings Button */}
              <TouchableOpacity
                style={[
                  styles.secondaryBtn,
                  styles.historyBtn,
                  isDarkMode ? styles.btnDark : styles.btnLight,
                ]}
                onPress={() => setCurrentScreen('settings')}
              >
                <Icon
                  name="settings"
                  size={moderateScale(24)}
                  color={isDarkMode ? '#94a3b8' : '#475569'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dark: {
    backgroundColor: '#0c120e',
  },
  light: {
    backgroundColor: '#f0f2f0',
  },
  bgDark: {
    backgroundColor: '#0c120e',
  },
  bgLight: {
    backgroundColor: '#f0f2f0',
  },
  textWhite: {
    color: '#fff',
  },
  textDark: {
    color: '#0f172a',
  },
  textGrayDark: {
    color: '#94a3b8',
  },
  textGrayLight: {
    color: '#475569',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    padding: moderateScale(24),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(40),
  },
  greeting: {
    fontSize: moderateScale(16),
    color: colors.textSecondary,
    fontWeight: '500',
  },
  title: {
    fontSize: moderateScale(24),
    color: colors.text,
    fontWeight: 'bold',
  },
  userAvatar: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
  },
  mainCard: {
    borderRadius: moderateScale(32),
    overflow: 'hidden',
    height: verticalScale(380),
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: verticalScale(24),
  },
  cardGradient: {
    flex: 1,
    padding: moderateScale(24),
    justifyContent: 'space-between',
  },
  cardContent: {
    gap: verticalScale(8),
  },
  cardIcon: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(16),
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  cardTitle: {
    fontSize: moderateScale(32),
    color: colors.text,
    fontWeight: 'bold',
    width: '80%',
  },
  cardSubtitle: {
    fontSize: moderateScale(16),
    color: 'rgba(255,255,255,0.7)',
    lineHeight: moderateScale(24),
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(24),
    borderRadius: moderateScale(20),
    gap: horizontalScale(12),
  },
  scanButtonText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#000',
  },
  statsRow: {
    flexDirection: 'row',
    gap: horizontalScale(16),
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: moderateScale(20),
    borderRadius: moderateScale(24),
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: verticalScale(4),
  },
  statLabel: {
    fontSize: moderateScale(14),
    color: colors.textSecondary,
    marginBottom: verticalScale(16),
  },
  statLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(4),
  },
  statLinkText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.primary,
  },
  heroContainer: {
    height: '55%',
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(12),
  },
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: moderateScale(20),
    height: moderateScale(20),
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    borderRadius: moderateScale(20),
    transform: [{ scale: 2 }],
  },
  themeToggle: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  themeToggleLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  statusPillContainer: {
    position: 'absolute',
    bottom: verticalScale(32),
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: horizontalScale(8),
  },
  onlineIndicator: {
    position: 'relative',
    width: moderateScale(10),
    height: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ping: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(10),
    opacity: 0.75,
    transform: [{ scale: 1.5 }],
  },
  dot: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
  },
  statusText: {
    color: '#e2e8f0',
    fontSize: moderateScale(10),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  bottomSheetContentContainer: {
    flex: 1,
    marginTop: -verticalScale(32),
    borderTopLeftRadius: moderateScale(36),
    borderTopRightRadius: moderateScale(36),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: verticalScale(16),
    paddingHorizontal: horizontalScale(28),
    paddingBottom: verticalScale(40),
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.7,
    shadowRadius: 60,
  },
  handleBar: {
    width: horizontalScale(56),
    height: verticalScale(4),
    backgroundColor: '#cbd5e1',
    borderRadius: moderateScale(2),
    alignSelf: 'center',
    marginBottom: verticalScale(8),
    opacity: 0.5,
  },
  decorativeIcon: {
    position: 'absolute',
    top: -verticalScale(24),
    right: -horizontalScale(48),
    transform: [{ rotate: '12deg' }],
    pointerEvents: 'none',
  },
  contentInner: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: verticalScale(8),
  },
  textBlock: {
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  heading: {
    fontSize: moderateScale(26),
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: moderateScale(32),
    marginBottom: verticalScale(16),
  },
  gradientText: {
    color: '#4ade80',
    textShadowColor: 'rgba(74, 222, 128, 0.5)',
    textShadowRadius: 10,
  },
  subheading: {
    fontSize: moderateScale(13),
    textAlign: 'center',
    lineHeight: moderateScale(20),
    maxWidth: horizontalScale(280),
    fontWeight: '500',
  },
  actionGrid: {
    gap: verticalScale(16),
  },
  scanBtn: {
    height: verticalScale(54),
    borderRadius: moderateScale(16),
    shadowColor: '#4ade80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(20),
    elevation: 8,
  },
  scanBtnGradient: {
    flex: 1,
    borderRadius: moderateScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: horizontalScale(12),
  },
  scanBtnText: {
    color: '#0c120e',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: horizontalScale(12),
    height: verticalScale(52),
  },
  secondaryBtn: {
    borderRadius: moderateScale(16),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDark: {
    backgroundColor: '#151f18',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  btnLight: {
    backgroundColor: '#e2e8f0',
    borderColor: '#cbd5e1',
  },
  historyBtn: {
    width: horizontalScale(60),
  },
  donateBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: horizontalScale(8),
  },
  donateText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
});
