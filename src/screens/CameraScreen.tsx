import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Linking,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
  useCameraFormat,
} from 'react-native-vision-camera';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import {
  Worklets,
  useSharedValue as useWorkletSharedValue,
} from 'react-native-worklets-core';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  useSharedValue as useReanimatedSharedValue,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '@react-native-vector-icons/material-icons';

import { colors } from '../theme/colors';
import { useFungiStore } from '../store/useFungiStore';
import { getMushroomLabel } from '../utils/labels';
import { useModel } from '../context/ModelContext';

/**
 * YOLO11-CLS CONSTANTS
 */
const INPUT_SIZE = 512;
const CONF_THRESHOLD = 0.1;

export function CameraScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const { model, state: modelState } = useModel();
  const {
    result,
    setResult,
    setCurrentScreen,
    isDarkMode,
    flashMode,
    setCapturedImage,
  } = useFungiStore();

  const [torch, setTorch] = useState<'off' | 'on'>('off');
  const camera = React.useRef<Camera>(null);

  const format = useCameraFormat(device, [
    { photoResolution: 'max' },
    { videoResolution: { width: 1280, height: 720 } },
    { fps: 30 },
  ]);

  const shouldProcess = useWorkletSharedValue(false);

  const scanLinePos = useReanimatedSharedValue(0);

  useEffect(() => {
    scanLinePos.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [scanLinePos]);

  const animatedScanLineStyle = useAnimatedStyle(() => ({
    top: `${scanLinePos.value * 100}%`,
    opacity: 0.5,
  }));

  const { resize } = useResizePlugin();

  const handleClassificationResult = Worklets.createRunOnJS(
    (data: { idx: number; confidence: number }) => {
      setResult({
        label: getMushroomLabel(data.idx),
        confidence: data.confidence,
      });
    },
  );

  const [debugInfo, setDebugInfo] = useState<string>('Ready to Capture');

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      if (!shouldProcess.value) return;
      if (!model) return;

      // 1. Resize
      const resized = resize(frame, {
        crop: {
          x: frame.width * 0.15,
          y: frame.height * 0.15,
          width: frame.width * 0.7,
          height: frame.height * 0.7,
        },
        scale: { width: INPUT_SIZE, height: INPUT_SIZE },
        pixelFormat: 'rgb',
        dataType: 'float32',
      });

      // 2. Run Model
      const outputs = model.runSync([resized]);
      if (!outputs || !outputs[0]) return;

      const probs = outputs[0] as unknown as Float32Array;

      let bestIdx = 0;
      let bestScore = probs[0];

      for (let i = 1; i < probs.length; i++) {
        if (probs[i] > bestScore) {
          bestScore = probs[i];
          bestIdx = i;
        }
      }

      if (bestScore >= CONF_THRESHOLD) {
        shouldProcess.value = false;
        handleClassificationResult({ idx: bestIdx, confidence: bestScore });
      } else {
        shouldProcess.value = false;
        handleClassificationResult({ idx: bestIdx, confidence: bestScore });
      }
    },
    [model, resize, shouldProcess],
  );

  // Request permission on mount
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const handleCapture = async () => {
    if (!camera.current) return;

    setDebugInfo('Capturing...');
    const needsLight = flashMode === 'on' || flashMode === 'auto';

    if (needsLight) {
      setTorch('on');
      await new Promise(r => setTimeout(r, 250));
    }

    shouldProcess.value = true;

    await new Promise(r => setTimeout(r, 100));
    try {
      const photo = await camera.current.takePhoto({
        flash: 'off',
        enableShutterSound: true,
      });

      setCapturedImage(photo.path);
    } catch (e) {
      console.error('Failed to take photo', e);
    } finally {
      // 4. Cleanup
      if (needsLight) {
        setTorch('off');
      }

      // Navigate
      setCurrentScreen('results');
    }
  };

  // ---------------- RENDER LOGIC ----------------

  // Loading State
  if (modelState === 'loading' || !model) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Text style={{ color: '#4ade80', fontSize: 18, marginBottom: 20 }}>
          Initializing Neural Network...
        </Text>
        <View
          style={{
            width: '60%',
            height: 4,
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 2,
          }}
        >
          <View
            style={{
              width: '40%',
              height: '100%',
              backgroundColor: '#4ade80',
              borderRadius: 2,
            }}
          />
        </View>
      </View>
    );
  }

  if (!hasPermission) {
    const handlePermissionRequest = async () => {
      const granted = await requestPermission();
      if (!granted) {
        Linking.openSettings();
      }
    };

    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center', gap: 20 },
        ]}
      >
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Text style={{ color: '#fff', fontSize: 16 }}>
          Camera Permission Required
        </Text>
        <TouchableOpacity
          onPress={handlePermissionRequest}
          style={{ padding: 12, backgroundColor: '#4ade80', borderRadius: 8 }}
        >
          <Text style={{ fontWeight: 'bold' }}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openSettings()}
          style={{
            padding: 12,
            borderWidth: 1,
            borderColor: '#4ade80',
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#4ade80', fontWeight: 'bold' }}>
            Open Settings
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Text style={{ color: '#ef4444', fontSize: 16 }}>
          No Camera Device Found
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor="transparent"
      />
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        format={format}
        pixelFormat="yuv"
        torch={torch}
        photo={true}
      />

      {/* Grid Overlay */}
      <View
        style={[StyleSheet.absoluteFill, styles.gridContainer]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={[colors.gradientStart, 'transparent']}
          style={styles.topGradient}
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="visibility" size={28} color={colors.primary} />
          <Text style={styles.headerTitle}>FungEye</Text>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.offlineText}>OFFLINE DATABASE ACTIVE</Text>
        </View>
        <TouchableOpacity
          style={styles.donatePill}
          onPress={() => setCurrentScreen('donation')}
        >
          <Icon name="volunteer-activism" size={14} color={colors.primary} />
          <Text style={styles.donateText}>DONATE</Text>
        </TouchableOpacity>
      </View>

      {/* Main HUD */}
      <View style={styles.hudContainer}>
        <View style={styles.reticle}>
          {/* Eye Shape Borders */}
          <View style={[styles.reticleCorner, styles.topLeft]} />
          <View style={[styles.reticleCorner, styles.bottomRight]} />

          {/* Inner pulsating border */}
          <View style={styles.innerReticle} />

          {/* Scanning Line */}
          <View style={styles.scanArea}>
            <Animated.View style={[styles.scanLine, animatedScanLineStyle]} />
          </View>

          {/* HUD Info */}
          <View style={styles.hudInfo}>
            <Text style={styles.hudText}>{debugInfo}</Text>
          </View>

          {/* Center Icon */}
          <View style={styles.centerIcon}>
            <Icon
              name="filter-center-focus"
              size={32}
              color={colors.primary}
              style={{ opacity: 0.8 }}
            />
          </View>
        </View>

        <View style={styles.instructionContainer}>
          <Text style={styles.instructionTitle}>Center Subject</Text>
          <View style={styles.instructionPill}>
            <Text style={styles.instructionText}>Tap shutter to identify</Text>
          </View>
        </View>
      </View>

      {/* Footer Controls */}
      <LinearGradient
        colors={['transparent', colors.background]}
        style={styles.footer}
      >
        {/* Mode Switcher */}
        <View style={styles.modeToggleContainer}>
          <View style={styles.modeToggle}>
            <TouchableOpacity style={styles.modeOptionActive}>
              <Text style={styles.modeTextActive}>Photo ID</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Actions */}
        <View style={styles.controlsRow}>
          {/* History/Library Button */}
          <TouchableOpacity
            style={styles.thumbnailBtn}
            onPress={() => setCurrentScreen('library')}
          >
            {/* Using an icon instead of image for history/library representation per design concept, or just the library icon */}
            <View style={styles.historyIconContainer}>
              <Icon name="history" size={24} color="rgba(255,255,255,0.8)" />
            </View>
          </TouchableOpacity>

          {/* Shutter Button */}
          <TouchableOpacity style={styles.shutterOuter} onPress={handleCapture}>
            <View style={styles.shutterInner} />
          </TouchableOpacity>

          {/* Settings Button */}
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => setCurrentScreen('settings')}
          >
            <Icon name="settings" size={24} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gridContainer: {
    zIndex: 1,
  },
  topGradient: {
    height: 120,
    width: '100%',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerCenter: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.2)',
  },
  offlineText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  donatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  donateText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  hudContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  reticle: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reticleCorner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderColor: colors.primary,
    borderWidth: 3,
    borderRadius: 140,
    opacity: 0.6,
  },
  topLeft: {
    transform: [{ rotate: '-45deg' }],
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 10,
  },
  bottomRight: {
    transform: [{ rotate: '-45deg' }],
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 10,
  },
  innerReticle: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderWidth: 1,
    borderColor: 'rgba(17, 212, 50, 0.3)',
    borderRadius: 130,
    transform: [{ rotate: '-45deg' }],
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  scanArea: {
    position: 'absolute',
    width: 200,
    height: 200,
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    left: -50,
    right: -50,
    height: 2,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  hudInfo: {
    position: 'absolute',
    top: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  hudText: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: 'monospace',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  centerIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionContainer: {
    marginTop: 40,
    alignItems: 'center',
    gap: 8,
  },
  instructionTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  instructionPill: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  instructionText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 40,
    paddingBottom: 40,
    zIndex: 20,
  },
  modeToggleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 46, 29, 0.8)',
    borderRadius: 30,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modeOptionActive: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 24,
  },
  modeOption: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  modeTextActive: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  modeText: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 'bold',
    fontSize: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  thumbnailBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  historyIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  shutterOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF',
  },
  flashBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(26, 46, 29, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  settingsBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});
