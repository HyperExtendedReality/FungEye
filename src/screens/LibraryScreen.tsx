import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '@react-native-vector-icons/material-icons';
import { useFungiStore } from '../store/useFungiStore';
import { MUSHROOM_CATALOG } from '../data/speciesData';
import { colors } from '../theme/colors';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../theme/metrics';

const FILTERS = [
  'All',
  'New Discovery',
  'Edible',
  'Toxic',
  'Psychoactive',
  'Rare',
];

// Helper to safely look up species data
const getSpeciesInfo = (name: string, scientific: string) => {
  const normName = name?.toLowerCase().trim();
  const normSci = scientific?.toLowerCase().trim();

  // Try exact name match
  if (MUSHROOM_CATALOG[normName]) return MUSHROOM_CATALOG[normName];

  // Try scientific match (iterate keys)
  const bySci = Object.values(MUSHROOM_CATALOG).find(
    s => s.scientific.toLowerCase() === normSci,
  );
  if (bySci) return bySci;

  return null;
};

export const LibraryScreen = () => {
  const {
    setCurrentScreen,
    isDarkMode,
    collection,
    loadCollection,
    deleteFromCollection,
  } = useFungiStore();
  const { bottom } = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  React.useEffect(() => {
    loadCollection();
  }, []);

  const filteredData = collection.filter((item: any) => {
    // If filter is 'All', match everything. Else match type or tag.
    const matchesFilter =
      activeFilter === 'All' ||
      item.type === activeFilter ||
      item.tag === activeFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.scientific.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <View style={[styles.container, isDarkMode ? styles.dark : styles.light]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#0c120e' : '#f0f2f0'}
      />

      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity
              onPress={() => setCurrentScreen('home')}
              style={[
                styles.iconBtn,
                !isDarkMode && { backgroundColor: 'rgba(0,0,0,0.05)' },
              ]}
            >
              <Icon
                name="arrow-back"
                size={moderateScale(24)}
                color={isDarkMode ? '#fff' : '#000'}
              />
            </TouchableOpacity>
            <Text
              style={[styles.headerTitle, !isDarkMode && { color: '#0f172a' }]}
            >
              My Collection
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[
                styles.iconBtn,
                !isDarkMode && { backgroundColor: 'rgba(0,0,0,0.05)' },
              ]}
            >
              <Icon
                name="search"
                size={moderateScale(24)}
                color={isDarkMode ? '#fff' : '#000'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.iconBtn,
                !isDarkMode && { backgroundColor: 'rgba(0,0,0,0.05)' },
              ]}
            >
              <Icon
                name="more-vert"
                size={moderateScale(24)}
                color={isDarkMode ? '#fff' : '#000'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text
              style={[styles.statValue, !isDarkMode && { color: '#0f172a' }]}
            >
              {collection.length}
            </Text>
            <Text style={styles.statLabel}>Found</Text>
          </View>
          <View
            style={[
              styles.statDivider,
              !isDarkMode && { backgroundColor: 'rgba(0,0,0,0.1)' },
            ]}
          />
          <View style={styles.statItem}>
            <Text
              style={[styles.statValue, !isDarkMode && { color: '#0f172a' }]}
            >
              {/* Calculate "Genera" or just fake it for now since we don't parse species names properly yet */}
              {new Set(collection.map(i => i.name)).size}
            </Text>
            <Text style={styles.statLabel}>Unique</Text>
          </View>
          <View
            style={[
              styles.statDivider,
              !isDarkMode && { backgroundColor: 'rgba(0,0,0,0.1)' },
            ]}
          />
          <View style={styles.statItem}>
            <Text
              style={[styles.statValue, !isDarkMode && { color: '#0f172a' }]}
            >
              {/* Count High Confidence ones? */}
              {collection.filter(i => i.match > 80).length}
            </Text>
            <Text style={styles.statLabel}>High Conf.</Text>
          </View>
        </View>

        {/* Contribute Banner */}
        <TouchableOpacity
          style={[
            styles.banner,
            !isDarkMode && {
              borderColor: 'rgba(74, 222, 128, 0.4)',
              backgroundColor: '#fff',
            },
          ]}
          onPress={() => setCurrentScreen('donation')}
        >
          <LinearGradient
            colors={
              isDarkMode
                ? ['rgba(74, 222, 128, 0.1)', 'rgba(74, 222, 128, 0.05)']
                : ['rgba(74, 222, 128, 0.1)', 'rgba(74, 222, 128, 0.05)']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bannerGradient}
          >
            <View style={styles.bannerContent}>
              <View style={styles.bannerIcon}>
                <Icon
                  name="cloud-upload"
                  size={moderateScale(20)}
                  color={colors.primary}
                />
              </View>
              <View>
                <Text
                  style={[
                    styles.bannerTitle,
                    !isDarkMode && { color: '#0f172a' },
                  ]}
                >
                  Donate Data
                </Text>
                <Text
                  style={[
                    styles.bannerSubtitle,
                    !isDarkMode && { color: '#64748b' },
                  ]}
                >
                  Help train the global model
                </Text>
              </View>
            </View>
            <Icon
              name="chevron-right"
              size={moderateScale(24)}
              color={colors.primary}
            />
          </LinearGradient>
        </TouchableOpacity>

        {/* Search & Filter */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {FILTERS.map(filter => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  !isDarkMode && styles.filterChipLight,
                  activeFilter === filter && styles.filterChipActive,
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    !isDarkMode && styles.filterTextLight,
                    activeFilter === filter &&
                      (!isDarkMode
                        ? styles.filterTextActiveLight
                        : styles.filterTextActive),
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* Grid Content */}
      <ScrollView
        contentContainerStyle={[
          styles.gridContainer,
          { paddingBottom: verticalScale(100) + bottom },
        ]}
      >
        <View style={styles.masonryGrid}>
          {filteredData.length === 0 ? (
            <View
              style={{ width: '100%', alignItems: 'center', marginTop: 50 }}
            >
              <Icon name="grass" size={48} color="rgba(255,255,255,0.2)" />
              <Text style={{ color: 'rgba(255,255,255,0.4)', marginTop: 10 }}>
                Start your collection...
              </Text>
            </View>
          ) : (
            filteredData.map((item: any, index: number) => {
              const catalogData = getSpeciesInfo(item.name, item.scientific);
              const displayName = catalogData ? catalogData.name : item.name;
              const displaySci = catalogData
                ? catalogData.scientific
                : item.scientific;
              const displayType = catalogData ? catalogData.type : item.type;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.card, !isDarkMode && styles.cardLight]}
                  onPress={() => setSelectedItem(item)}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.cardImage}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.9)']}
                    style={styles.cardOverlay}
                  >
                    <View style={styles.cardContent}>
                      <View style={styles.cardBadges}>
                        <View
                          style={[
                            styles.badge,
                            displayType === 'Toxic' || displayType === 'Deadly'
                              ? styles.badgeDanger
                              : styles.badgeSafe,
                          ]}
                        >
                          <Text style={styles.badgeText}>
                            {displayType || 'Unknown'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.cardTitle}>{displayName}</Text>
                      <Text style={styles.cardSubtitle}>{displaySci}</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation Dock */}
      <View style={styles.dockContainer}>
        <View
          style={[
            styles.dock,
            !isDarkMode && styles.dockLight,
            { paddingBottom: verticalScale(16) + bottom },
          ]}
        >
          <TouchableOpacity
            style={styles.dockItem}
            onPress={() => setCurrentScreen('library')}
          >
            <Icon
              name="menu-book"
              size={moderateScale(24)}
              color={colors.primary}
            />
            <Text style={[styles.dockLabel, styles.dockLabelActive]}>
              Journal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dockFab}
            onPress={() => setCurrentScreen('camera')}
          >
            <LinearGradient
              colors={[colors.primary, '#22c55e']}
              style={[
                styles.fabGradient,
                !isDarkMode && styles.fabGradientLight,
              ]}
            >
              <Icon
                name="filter-center-focus"
                size={moderateScale(32)}
                color="#000"
              />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dockItem}
            onPress={() => setCurrentScreen('settings')}
          >
            <Icon name="settings" size={moderateScale(24)} color="#94a3b8" />
            <Text style={styles.dockLabel}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Details Modal */}
      <Modal
        visible={!!selectedItem}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => setSelectedItem(null)}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>

          <View
            style={[
              styles.modalContent,
              isDarkMode ? styles.dark : styles.modalLight,
              { paddingBottom: bottom + 20 },
            ]}
          >
            {selectedItem &&
              (() => {
                // Derive display data merging stored item with catalog data
                const catalogData = getSpeciesInfo(
                  selectedItem.name,
                  selectedItem.scientific,
                );
                const displayName = catalogData
                  ? catalogData.name
                  : selectedItem.name;
                const displaySci = catalogData
                  ? catalogData.scientific
                  : selectedItem.scientific;
                const displayType = catalogData
                  ? catalogData.type
                  : selectedItem.type;
                const displayDesc =
                  catalogData?.description ||
                  'No detailed description available for this species yet. Keep exploring!';
                const displayDetails =
                  catalogData?.details ||
                  'Review your finding carefully. Always consult an expert before consuming purposes.';

                return (
                  <>
                    <View style={styles.modalHandle} />

                    <View style={styles.modalHeader}>
                      <Text
                        style={[
                          styles.modalTitle,
                          !isDarkMode && { color: '#0f172a' },
                        ]}
                      >
                        {displayName}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setSelectedItem(null)}
                        style={styles.closeBtn}
                      >
                        <Icon
                          name="close"
                          size={24}
                          color={isDarkMode ? '#fff' : '#000'}
                        />
                      </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.modalScroll}>
                      <Image
                        source={{ uri: selectedItem.image }}
                        style={styles.modalImage}
                      />

                      <View style={styles.modalBadges}>
                        <View
                          style={[
                            styles.badge,
                            displayType === 'Toxic' || displayType === 'Deadly'
                              ? styles.badgeDanger
                              : styles.badgeSafe,
                          ]}
                        >
                          <Text style={styles.badgeText}>{displayType}</Text>
                        </View>
                        <Text
                          style={[
                            styles.modalDate,
                            !isDarkMode && { color: '#64748b' },
                          ]}
                        >
                          Found:{' '}
                          {new Date(selectedItem.date).toLocaleDateString()}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.sectionTitle,
                          !isDarkMode && { color: '#334155' },
                        ]}
                      >
                        Scientific Name
                      </Text>
                      <Text
                        style={[
                          styles.scientificText,
                          !isDarkMode && { color: '#475569' },
                        ]}
                      >
                        {displaySci}
                      </Text>

                      <View style={styles.divider} />

                      <Text
                        style={[
                          styles.sectionTitle,
                          !isDarkMode && { color: '#334155' },
                        ]}
                      >
                        Description
                      </Text>
                      <Text
                        style={[
                          styles.descriptionText,
                          !isDarkMode && { color: '#475569' },
                        ]}
                      >
                        {displayDesc}
                      </Text>

                      <View style={[styles.divider, { marginTop: 16 }]} />

                      <Text
                        style={[
                          styles.sectionTitle,
                          !isDarkMode && { color: '#334155' },
                        ]}
                      >
                        Details
                      </Text>
                      <Text
                        style={[
                          styles.descriptionText,
                          !isDarkMode && { color: '#475569' },
                        ]}
                      >
                        {displayDetails}
                      </Text>

                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => {
                          deleteFromCollection(selectedItem.id);
                          setSelectedItem(null);
                        }}
                      >
                        <Icon name="delete-outline" size={20} color="#ef4444" />
                        <Text style={styles.deleteText}>
                          Delete from Collection
                        </Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </>
                );
              })()}
          </View>
        </View>
      </Modal>
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
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(24),
    marginBottom: verticalScale(24),
  },
  headerTitle: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    gap: horizontalScale(16),
  },
  iconBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(24),
    marginBottom: verticalScale(24),
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: moderateScale(12),
    color: '#9ca3af',
  },
  statDivider: {
    width: 1,
    height: verticalScale(32),
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  banner: {
    marginHorizontal: horizontalScale(24),
    height: verticalScale(80),
    borderRadius: moderateScale(20),
    overflow: 'hidden',
    marginBottom: verticalScale(24),
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.2)',
  },
  bannerGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(20),
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(16),
  },
  bannerIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#fff',
  },
  bannerSubtitle: {
    fontSize: moderateScale(12),
    color: 'rgba(255,255,255,0.6)',
  },
  filterContainer: {
    marginBottom: verticalScale(16),
  },
  filterScroll: {
    paddingHorizontal: horizontalScale(24),
    gap: horizontalScale(12),
  },
  filterChip: {
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  filterChipLight: {
    backgroundColor: '#fff',
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  filterChipActive: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#9ca3af',
  },
  filterTextLight: {
    color: '#64748b',
  },
  filterTextActive: {
    color: colors.primary,
  },
  filterTextActiveLight: {
    color: '#16a34a',
  },
  gridContainer: {
    paddingBottom: verticalScale(120),
  },
  masonryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: moderateScale(12),
    gap: moderateScale(12),
  },
  card: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: moderateScale(24),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    height: verticalScale(240),
  },
  cardLight: {
    backgroundColor: '#fff',
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    padding: moderateScale(16),
    justifyContent: 'flex-end',
  },
  cardContent: {
    gap: verticalScale(4),
  },
  cardBadges: {
    flexDirection: 'row',
    marginBottom: verticalScale(8),
  },
  badge: {
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  badgeDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  badgeSafe: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  badgeText: {
    fontSize: moderateScale(10),
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#fff',
  },
  cardSubtitle: {
    fontSize: moderateScale(12),
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
  },
  dockContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  dock: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(12, 18, 14, 0.95)',
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(32),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  dockLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopColor: '#e2e8f0',
  },
  dockItem: {
    alignItems: 'center',
    gap: verticalScale(4),
    flex: 1,
  },
  dockLabel: {
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: '#64748b',
  },
  dockLabelActive: {
    color: colors.primary,
  },
  dockFab: {
    marginTop: -verticalScale(48),
  },
  fabGradient: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#0c120e',
  },
  fabGradientLight: {
    borderColor: '#f0f2f0',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    height: '85%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    backgroundColor: colors.background,
  },
  modalLight: {
    backgroundColor: '#fff',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(128,128,128,0.4)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  modalScroll: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  modalImage: {
    width: '100%',
    height: 250,
    borderRadius: 24,
    marginBottom: 20,
  },
  modalBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  modalDate: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  scientificText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.8)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128,128,128,0.2)',
    marginVertical: 16,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 40,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: 12,
    backgroundColor: 'rgba(239,68,68,0.1)',
  },
  deleteText: {
    color: '#ef4444',
    fontWeight: '600',
  },
});
