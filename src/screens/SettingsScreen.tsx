import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '@react-native-vector-icons/material-icons';
import { useFungiStore } from '../store/useFungiStore';

export const SettingsScreen = () => {
  const { setCurrentScreen, isDarkMode, toggleTheme, flashMode, setFlashMode } =
    useFungiStore();
  const [saveScans, setSaveScans] = React.useState(true);
  const [datasetUpdates, setDatasetUpdates] = React.useState(true);

  return (
    <View style={[styles.container, isDarkMode ? styles.dark : styles.light]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#0c120e' : '#f0f2f0'}
      />

      {/* Header */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setCurrentScreen('home')}
          >
            <Icon
              name="arrow-back"
              size={24}
              color={isDarkMode ? '#fff' : '#000'}
            />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text
              style={[
                styles.headerTitle,
                isDarkMode ? styles.textWhite : styles.textDark,
              ]}
            >
              Settings
            </Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>v1.0.0</Text>
            </View>
          </View>
          <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 20 }}>
            <Icon
              name={isDarkMode ? 'light-mode' : 'dark-mode'}
              size={20}
              color={isDarkMode ? '#fff' : '#000'}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Model Intelligence Section */}
        <View
          style={[
            styles.section,
            isDarkMode ? styles.glassDark : styles.glassLight,
          ]}
        >
          <View style={styles.sectionHeader}>
            <Icon name="psychology" size={20} color="#4ade80" />
            <Text style={styles.sectionTitle}>Model Intelligence</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Text
                style={[
                  styles.rowLabel,
                  isDarkMode ? styles.textWhite : styles.textDark,
                ]}
              >
                Offline Model
              </Text>
              <Text style={styles.rowSubLabel}>
                yolo11l-cls-fungi-distilled
              </Text>
            </View>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>ACTIVE</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Text
                style={[
                  styles.rowLabel,
                  isDarkMode ? styles.textWhite : styles.textDark,
                ]}
              >
                Dataset Updates
              </Text>
              <Text style={styles.rowSubLabel}>Auto-sync new species</Text>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: '#4ade80' }}
              thumbColor="#f4f3f4"
              value={datasetUpdates}
              onValueChange={setDatasetUpdates}
            />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionRow}>
            <Text
              style={[
                styles.actionLabel,
                isDarkMode ? styles.textWhite : styles.textDark,
              ]}
            >
              Check for Updates
            </Text>
            <Icon name="chevron-right" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Scanner & Camera Section */}
        <View
          style={[
            styles.section,
            isDarkMode ? styles.glassDark : styles.glassLight,
          ]}
        >
          <View style={styles.sectionHeader}>
            <Icon name="center-focus-strong" size={20} color="#4ade80" />
            <Text style={styles.sectionTitle}>Scanner & Camera</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Text
                style={[
                  styles.rowLabel,
                  isDarkMode ? styles.textWhite : styles.textDark,
                ]}
              >
                Resolution
              </Text>
            </View>
            <View style={styles.valueBadge}>
              <Text style={styles.valueText}>High (4K)</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Text
                style={[
                  styles.rowLabel,
                  isDarkMode ? styles.textWhite : styles.textDark,
                ]}
              >
                Flash Mode
              </Text>
            </View>
            <View style={styles.valueBadge}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {(['auto', 'on', 'off'] as const).map(mode => (
                  <TouchableOpacity
                    key={mode}
                    onPress={() => setFlashMode(mode)}
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      backgroundColor:
                        flashMode === mode ? '#4ade80' : 'transparent',
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        color: flashMode === mode ? '#000' : '#9ca3af',
                        fontSize: 12,
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                      }}
                    >
                      {mode}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Text
                style={[
                  styles.rowLabel,
                  isDarkMode ? styles.textWhite : styles.textDark,
                ]}
              >
                Save Scans
              </Text>
              <Text style={styles.rowSubLabel}>Keep history locally</Text>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: '#4ade80' }}
              thumbColor="#f4f3f4"
              value={saveScans}
              onValueChange={setSaveScans}
            />
          </View>
        </View>

        {/* Support Section */}
        <TouchableOpacity
          style={styles.supportBtn}
          onPress={() => setCurrentScreen('donation')}
        >
          <LinearGradient
            colors={['rgba(74, 222, 128, 0.1)', 'rgba(74, 222, 128, 0.05)']}
            style={styles.supportGradient}
          >
            <View style={styles.supportContent}>
              <View style={styles.heartIcon}>
                <Icon name="favorite" size={20} color="#4ade80" />
              </View>
              <View>
                <Text
                  style={[
                    styles.supportTitle,
                    isDarkMode ? styles.textWhite : styles.textDark,
                  ]}
                >
                  Support FungEye
                </Text>
                <Text style={styles.supportSub}>Help us grow the database</Text>
              </View>
            </View>
            <Icon name="arrow-forward" size={20} color="#4ade80" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Links */}
        <View style={styles.linksContainer}>
          <Text style={styles.linkText}>Privacy Policy</Text>
          <Text style={styles.linkDot}>•</Text>
          <Text style={styles.linkText}>Terms of Service</Text>
        </View>

        <Text style={styles.footerText}>
          FungEye Open Source Initiative{'\n'}
          Made with mycelium & code
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
    backgroundColor: '#0c120e',
  },
  light: {
    backgroundColor: '#f0f2f0',
  },
  textWhite: {
    color: '#fff',
  },
  textDark: {
    color: '#0f172a',
  },
  headerSafeArea: {
    marginBottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  versionBadge: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.2)',
  },
  versionText: {
    fontSize: 10,
    color: '#4ade80',
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    borderRadius: 24,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
  },
  glassDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  glassLight: {
    backgroundColor: '#fff',
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: 'rgba(74, 222, 128, 0.05)',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4ade80',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  rowSubLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginLeft: 16,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.2)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ade80',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4ade80',
  },
  valueBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  valueText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  supportBtn: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
    marginBottom: 32,
  },
  supportGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  supportContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  heartIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  supportSub: {
    fontSize: 12,
    color: '#9ca3af',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  linkText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '500',
  },
  linkDot: {
    color: '#6b7280',
  },
  footerText: {
    textAlign: 'center',
    color: '#4b5563', // gray-600
    fontSize: 12,
    lineHeight: 18,
  },
});
