import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '@react-native-vector-icons/material-design-icons';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import EntypoIcon from '@react-native-vector-icons/entypo';
import { useFungiStore } from '../store/useFungiStore';
import { colors } from '../theme/colors';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../theme/metrics';

type IconName = React.ComponentProps<typeof Icon>['name'];
type EntypoIconName = React.ComponentProps<typeof EntypoIcon>['name'];

interface DonationLevel {
  id: string;
  amount: number;
  label: string;
  icon: IconName | EntypoIconName;
}

const DONATION_LEVELS: DonationLevel[] = [
  { id: 'spore', amount: 1, label: 'Spore', icon: 'seed' },
  { id: 'mycelium', amount: 5, label: 'Mycelium', icon: 'network' },
  { id: 'fruit body', amount: 10, label: 'Fruit Body', icon: 'mushroom' },
];

export const DonationScreen = () => {
  const { setCurrentScreen, isDarkMode } = useFungiStore();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(15);
  const [customAmount, setCustomAmount] = useState('');

  const handleCustomFocus = () => {
    setSelectedAmount(null);
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.dark : styles.light]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? colors.background : '#f0f2f0'}
      />

      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity
          style={[
            styles.backBtn,
            !isDarkMode && { backgroundColor: 'rgba(0,0,0,0.05)' },
          ]}
          onPress={() => setCurrentScreen('home')}
        >
          <MaterialIcon
            name="arrow-back"
            size={moderateScale(24)}
            color={isDarkMode ? '#fff' : '#000'}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, !isDarkMode && { color: '#0f172a' }]}>
          Support
        </Text>
        <TouchableOpacity style={styles.helpBtn}>
          <MaterialIcon
            name="help-outline"
            size={moderateScale(24)}
            color={isDarkMode ? '#fff' : '#000'}
          />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.iconCircle}>
            <MaterialIcon
              name="volunteer-activism"
              size={moderateScale(40)}
              color={colors.primary}
            />
          </View>
          <Text style={[styles.heroTitle, !isDarkMode && { color: '#0f172a' }]}>
            Grow the Network
          </Text>
          <Text style={[styles.heroDesc, !isDarkMode && { color: '#64748b' }]}>
            FungEye is an open-source initiative powered by community
            contributions. Your support covers cloud-based model training costs,
            improves the AI model, and keeps the app free for everyone.
          </Text>
        </View>

        {/* Impact Stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, !isDarkMode && styles.cardLight]}>
            <Text style={styles.statValue}>1.23 GB</Text>
            <Text style={styles.statLabel}> Mushroom Dataset</Text>
          </View>
          <View style={[styles.statCard, !isDarkMode && styles.cardLight]}>
            <Text style={styles.statValue}>2+ hrs</Text>
            <Text style={styles.statLabel}>Training Time</Text>
          </View>
          <View style={[styles.statCard, !isDarkMode && styles.cardLight]}>
            <Text style={styles.statValue}>100%</Text>
            <Text style={styles.statLabel}>Uptime Local Model</Text>
          </View>
        </View>

        {/* Donation Levels */}
        <Text
          style={[styles.sectionLabel, !isDarkMode && { color: '#0f172a' }]}
        >
          Select Contribution
        </Text>
        <View style={styles.levelsContainer}>
          {DONATION_LEVELS.map(level => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.levelCard,
                !isDarkMode && styles.cardLight,
                selectedAmount === level.amount && styles.levelCardActive,
              ]}
              onPress={() => {
                setSelectedAmount(level.amount);
                setCustomAmount('');
              }}
            >
              <View style={styles.levelIcon}>
                {level.id === 'mycelium' ? (
                  <EntypoIcon
                    // Tell TS to treat this string as a valid Entypo name
                    name={level.icon as EntypoIconName}
                    size={moderateScale(24)}
                    color={
                      selectedAmount === level.amount ? '#000' : colors.primary
                    }
                  />
                ) : (
                  <Icon
                    // Tell TS to treat this string as a valid Material name
                    name={level.icon as IconName}
                    size={moderateScale(24)}
                    color={
                      selectedAmount === level.amount ? '#000' : colors.primary
                    }
                  />
                )}
              </View>
              <Text
                style={[
                  styles.levelAmount,
                  !isDarkMode && { color: '#0f172a' },
                  selectedAmount === level.amount && styles.levelTextActive,
                ]}
              >
                ${level.amount}
              </Text>
              <Text
                style={[
                  styles.levelLabel,
                  selectedAmount === level.amount && styles.levelTextActive,
                ]}
              >
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Amount */}
        <View
          style={[
            styles.customInputContainer,
            !isDarkMode && styles.customInputContainerLight,
          ]}
        >
          <Text style={styles.customLabel}>Custom Amount ($)</Text>
          <TextInput
            style={[styles.customInput, !isDarkMode && { color: '#0f172a' }]}
            placeholder="0.00"
            placeholderTextColor="#64748b"
            keyboardType="numeric"
            value={customAmount}
            onFocus={handleCustomFocus}
            onChangeText={text => {
              setCustomAmount(text);
              if (text) setSelectedAmount(null);
            }}
          />
        </View>

        {/* Donate Button */}
        <TouchableOpacity style={styles.donateBtn} activeOpacity={0.9}>
          <LinearGradient
            colors={[colors.primary, '#22c55e']}
            style={styles.donateGradient}
          >
            <Text style={styles.donateBtnText}>
              Donate ${selectedAmount || customAmount || '0'}
            </Text>
            <MaterialIcon
              name="arrow-forward"
              size={moderateScale(24)}
              color="#000"
            />
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          Secure payment via Stripe. Tax deductible where applicable.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dark: {
    backgroundColor: colors.background,
  },
  light: {
    backgroundColor: '#f0f2f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(24),
    paddingVertical: verticalScale(16),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#fff',
  },
  backBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  helpBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: moderateScale(24),
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: verticalScale(32),
  },
  iconCircle: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.2)',
  },
  heroTitle: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: verticalScale(12),
  },
  heroDesc: {
    fontSize: moderateScale(14),
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: moderateScale(22),
  },
  statsGrid: {
    flexDirection: 'row',
    gap: horizontalScale(12),
    marginBottom: verticalScale(32),
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statValue: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: verticalScale(4),
  },
  statLabel: {
    fontSize: moderateScale(10),
    color: '#64748b',
    textAlign: 'center',
  },
  sectionLabel: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#fff',
    marginBottom: verticalScale(16),
  },
  levelsContainer: {
    flexDirection: 'row',
    gap: horizontalScale(12),
    marginBottom: verticalScale(24),
  },
  levelCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: moderateScale(16),
    borderRadius: moderateScale(20),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.1)',
    gap: verticalScale(8),
  },
  levelCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  levelIcon: {
    marginBottom: verticalScale(4),
  },
  levelAmount: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#fff',
  },
  levelLabel: {
    fontSize: moderateScale(12),
    color: '#94a3b8',
  },
  levelTextActive: {
    color: '#000',
  },
  customInputContainer: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: verticalScale(32),
  },
  customInputContainerLight: {
    backgroundColor: '#fff',
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  customLabel: {
    fontSize: moderateScale(12),
    color: '#94a3b8',
    marginBottom: verticalScale(8),
  },
  customInput: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    color: '#fff',
    padding: 0,
  },
  donateBtn: {
    height: verticalScale(64),
    borderRadius: moderateScale(20),
    marginBottom: verticalScale(24),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: verticalScale(8) },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(20),
    elevation: 8,
  },
  donateGradient: {
    flex: 1,
    borderRadius: moderateScale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: horizontalScale(12),
    backgroundColor: colors.primary, // Fallback
  },
  donateBtnText: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#000',
  },
  footerNote: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: moderateScale(12),
  },
  cardLight: {
    backgroundColor: '#fff',
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
});
