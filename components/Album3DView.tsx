import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withDelay,
  cancelAnimation,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const ALBUM_SIZE = width * 0.8; // Make album slightly smaller
const ROTATION_LIMIT = 20; // Limit rotation to prevent extreme angles

export default function Album3DView({ imageUrl }: { imageUrl: string }) {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const isUserInteracting = useSharedValue(false);

  useEffect(() => {
    startAutoRotation();
    return () => {
      // Cleanup animations on unmount
      cancelAnimation(rotateX);
      cancelAnimation(rotateY);
    };
  }, []);

  const startAutoRotation = () => {
    // Only start auto-rotation if user isn't interacting
    if (!isUserInteracting.value) {
      rotateY.value = withRepeat(
        withSequence(
          withDelay(500, withSpring(-10, { damping: 15 })),
          withDelay(500, withSpring(10, { damping: 15 }))
        ),
        -1, // Infinite repetitions
        true // Reverse animation
      );

      rotateX.value = withRepeat(
        withSequence(
          withDelay(750, withSpring(-5, { damping: 15 })),
          withDelay(750, withSpring(5, { damping: 15 }))
        ),
        -1,
        true
      );
    }
  };

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isUserInteracting.value = true;
      // Cancel auto-rotation animations
      cancelAnimation(rotateX);
      cancelAnimation(rotateY);
    })
    .onUpdate((event) => {
      // Limit rotation to ROTATION_LIMIT degrees
      rotateX.value = Math.min(Math.max(event.translationY / 5, -ROTATION_LIMIT), ROTATION_LIMIT);
      rotateY.value = Math.min(Math.max(event.translationX / 5, -ROTATION_LIMIT), ROTATION_LIMIT);
    })
    .onEnd(() => {
      rotateX.value = withSpring(0, { damping: 15 });
      rotateY.value = withSpring(0, { damping: 15 });
      // Restart auto-rotation after a delay
      setTimeout(() => {
        isUserInteracting.value = false;
        startAutoRotation();
      }, 1000);
    });

  const albumStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { scale: 0.9 }, // Slightly scale down to prevent cutoff
        { rotateX: `${rotateX.value}deg` },
        { rotateY: `${rotateY.value}deg` },
      ],
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={styles.safeArea}>
          <Animated.View style={[styles.albumContainer, albumStyle]}>
            <Animated.Image
              source={{ uri: imageUrl }}
              style={styles.albumCover}
              resizeMode="cover"
            />
            <Animated.View style={styles.albumSpine} />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: ALBUM_SIZE + 100, // Add extra space for rotation
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    width: ALBUM_SIZE,
    height: ALBUM_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumContainer: {
    width: ALBUM_SIZE * 0.9, // Slightly smaller than container
    height: ALBUM_SIZE * 0.9,
    backgroundColor: '#000',
    borderRadius: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  albumCover: {
    width: '100%',
    height: '100%',
  },
  albumSpine: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 20,
    backgroundColor: '#333',
    transform: [
      { perspective: 1000 },
      { rotateY: '90deg' },
      { translateX: 10 },
    ],
  },
});
