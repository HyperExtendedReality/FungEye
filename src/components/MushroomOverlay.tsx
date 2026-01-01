import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import { useFungiStore } from '../store/useFungiStore';

interface Props {
  onCapture?: () => void;
  isModelReady?: boolean;
}

export const MushroomOverlay = ({ onCapture, isModelReady = false }: Props) => {
  const { result } = useFungiStore();

  return (
    <View style={styles.overlay}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FungEye Forager</Text>
      </View>

      <View style={styles.reticleContainer}>
        <View style={styles.reticle} />
        {result && (
          <View style={styles.resultBadge}>
            <Text style={styles.resultText}>{result.label}</Text>
            <Text style={styles.confidenceText}>
              {(result.confidence * 100).toFixed(0)}% Sure!
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        {!isModelReady ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.myceliumWhite} />
            <Text style={styles.footerText}>Initializing AI...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.footerText}>
              {result ? 'Identification Complete' : 'Point at a mushroom'}
            </Text>

            <TouchableOpacity style={styles.captureButton} onPress={onCapture}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 20,
    zIndex: 10,
  },
  header: {
    paddingTop: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.myceliumWhite,
    letterSpacing: 0.5,
    backgroundColor: colors.darkMoss,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.mossGreen,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  reticleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reticle: {
    width: 260,
    height: 260,
    borderWidth: 3,
    borderColor: colors.mossGreen,
    borderRadius: 40,
    borderStyle: 'dotted',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  resultBadge: {
    position: 'absolute',
    bottom: -70,
    backgroundColor: colors.surface,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.mossGreen,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.darkMoss,
  },
  confidenceText: {
    fontSize: 14,
    color: colors.mossGreen,
    fontWeight: '600',
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 40,
    gap: 20,
  },
  footerText: {
    color: colors.myceliumWhite,
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
  },
  captureButton: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: colors.barkBrown,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.mossGreen,
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.myceliumWhite,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
