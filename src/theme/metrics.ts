import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
// iPhone 11 Pro / X: 375 x 812
// UPDATE: Using larger base (e.g. iPhone 14 Pro Max) to ensure UI shrinks on smaller/standard phones
const guidelineBaseWidth = 430;
const guidelineBaseHeight = 932;

const horizontalScale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.25) => size + (horizontalScale(size) - size) * factor;

export { horizontalScale, verticalScale, moderateScale };
