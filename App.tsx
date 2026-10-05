import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLayoutEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Params = { Home: undefined; Details: undefined };

const Stack = createNativeStackNavigator<Params>();

type ButtonProps = {
  label: string;
  onPress: () => void;
  onFocusChange?: (label: string, focused: boolean) => void;
};

// A focusable Pressable that reports keyboard focus, so the focused element is visible on screen.
function Button({ label, onPress, onFocusChange }: ButtonProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onFocus={() => {
        setFocused(true);
        onFocusChange?.(label, true);
      }}
      onBlur={() => {
        setFocused(false);
        onFocusChange?.(label, false);
      }}
      style={[styles.button, focused && styles.buttonFocused]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

function HomeScreen({ navigation }: NativeStackScreenProps<Params, 'Home'>) {
  return (
    <View style={styles.screen}>
      <Text>Open Details, attach a keyboard and press Tab / Shift+Tab.</Text>
      <Button label="Open Details" onPress={() => navigation.navigate('Details')} />
    </View>
  );
}

function DetailsScreen({ navigation }: NativeStackScreenProps<Params, 'Details'>) {
  const [focused, setFocused] = useState('nothing');
  const [lastPressed, setLastPressed] = useState('nothing');

  const onFocusChange = (label: string, isFocused: boolean) => {
    setFocused((current) => (isFocused ? label : current === label ? 'nothing' : current));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          label="Header action"
          onPress={() => setLastPressed('Header action')}
          onFocusChange={onFocusChange}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.screen}>
      <Text>Keyboard focus: {focused}</Text>
      <Text>Last pressed: {lastPressed}</Text>
      <Button label="Content button 1" onPress={() => setLastPressed('Content button 1')} onFocusChange={onFocusChange} />
      <Button label="Content button 2" onPress={() => setLastPressed('Content button 2')} onFocusChange={onFocusChange} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, gap: 12 },
  button: { padding: 12, borderWidth: 2, borderColor: '#888', borderRadius: 6 },
  buttonFocused: { borderColor: '#d00', backgroundColor: '#fee' },
  buttonText: { fontSize: 16 },
});
