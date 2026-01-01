import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@react-native-vector-icons/material-icons';
import LinearGradient from 'react-native-linear-gradient';
import { useFungiStore } from '../store/useFungiStore';
import { colors } from '../theme/colors';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../theme/metrics';

const { width } = Dimensions.get('window');

export const ResultsScreen = () => {
  const { result, capturedImage, setCurrentScreen, addToCollection } =
    useFungiStore();

  const handleShare = async () => {
    try {
      if (capturedImage) {
        await Share.share({
          url: capturedImage,
          message: `I found a ${result?.label} with FungEye!`,
        });
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleSave = () => {
    if (!result || !capturedImage) return;

    const newItem = {
      id: Date.now().toString(),
      name: result.label,
      scientific: 'Unknown Scientific Name', // Would come from DB in real app
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      image: 'file://' + capturedImage,
      match: Math.round(result.confidence * 100),
      type: 'Unknown', // Would come from DB
      icon: 'help-outline',
      iconColor: '#9ca3af',
      tag: 'New Discovery',
      tagColor: '#4ade80',
    };

    addToCollection(newItem);
    Alert.alert('Saved', 'Mushroom added to your collection!', [
      { text: 'OK', onPress: () => setCurrentScreen('library') },
    ]);
  };

  const isHighConfidence = (result?.confidence || 0) > 0.7;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Background Gradient */}
      <LinearGradient
        colors={['#1a1a1a', '#0c120e']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.contentContainer}>
        {/* Header / Back */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen('camera')}
          >
            <Icon name="close" size={moderateScale(24)} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Identification Result</Text>
          <View style={{ width: moderateScale(40) }} />
          {/* Spacer */}
        </View>

        <View style={styles.mainContent}>
          {/* Polaroid Card */}
          <View style={styles.polaroidCard}>
            <View style={styles.polaroidImageContainer}>
              {capturedImage ? (
                <Image
                  source={{ uri: 'file://' + capturedImage }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <Icon name="image-not-supported" size={40} color="#ccc" />
                </View>
              )}
            </View>

            <View style={styles.polaroidFooter}>
              <Text style={styles.polaroidTitle}>
                {result?.label || 'Unknown'}
              </Text>
              <View style={styles.confidenceRow}>
                <Icon
                  name="verified"
                  size={16}
                  color={isHighConfidence ? colors.primary : '#fbbf24'}
                />
                <Text
                  style={[
                    styles.confidenceText,
                    { color: isHighConfidence ? colors.primary : '#fbbf24' },
                  ]}
                >
                  {Math.round((result?.confidence || 0) * 100)}% Confidence
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionBtnSecondary}
            onPress={handleShare}
          >
            <Icon name="share" size={moderateScale(24)} color="#FFF" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtnPrimary}
            onPress={handleSave}
          >
            <Icon name="bookmark-add" size={moderateScale(24)} color="#000" />
            <Text style={styles.actionTextPrimary}>Save to Collection</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: horizontalScale(24),
    paddingBottom: verticalScale(24),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(16),
  },
  headerTitle: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: '600',
  },
  backButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  polaroidCard: {
    backgroundColor: '#fff',
    padding: moderateScale(16),
    paddingBottom: moderateScale(24),
    borderRadius: moderateScale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    transform: [{ rotate: '-2deg' }],
    width: '90%',
    alignItems: 'center',
  },
  polaroidImageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: verticalScale(16),
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  polaroidFooter: {
    alignItems: 'center',
    gap: verticalScale(4),
  },
  polaroidTitle: {
    color: '#1a1a1a',
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    fontFamily: 'serif', // Or a handwritten font if available
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(4),
  },
  confidenceText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: horizontalScale(16),
    marginTop: verticalScale(24),
  },
  actionBtnSecondary: {
    flex: 1,
    height: verticalScale(56),
    borderRadius: moderateScale(16),
    backgroundColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: horizontalScale(8),
  },
  actionText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: moderateScale(16),
  },
  actionBtnPrimary: {
    flex: 2,
    height: verticalScale(56),
    borderRadius: moderateScale(16),
    backgroundColor: '#4ade80',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: horizontalScale(8),
  },
  actionTextPrimary: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
});
