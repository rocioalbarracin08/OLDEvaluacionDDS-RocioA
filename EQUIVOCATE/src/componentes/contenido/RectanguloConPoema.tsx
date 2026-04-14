import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { POEMA_TEXTO } from '../../datos/poema';

type Props = {
  fragmentoVisible?: string | null;
  opacidadPoema: number; // 0..1
  segundosRestantes?: number;
};

export default function RectanguloConPoema({ fragmentoVisible, opacidadPoema }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: opacidadPoema,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [opacidadPoema, opacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.rect, { opacity }]}>
        <Text style={styles.poemaText}>
          {fragmentoVisible ?? POEMA_TEXTO}
        </Text>
      </Animated.View>
    </View>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
  },
  rect: {
    width: Math.min(360, width - 40),
    minHeight: 220,
    backgroundColor: '#0d0d0d',
    padding: 18,
    borderRadius: 12,
    zIndex: 50,
    elevation: 50,
  },
  poemaText: { color: '#fff', fontSize: 16, lineHeight: 22 },
});