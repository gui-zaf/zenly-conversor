import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  SafeAreaView,
  StatusBar,
  Image,
  Animated,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

type SpeedUnit = "km/h" | "mph";
type TempUnit = "°C" | "°F";

export default function App() {
  const [unit1, setUnit1] = useState<SpeedUnit>("km/h");
  const [unit2, setUnit2] = useState<SpeedUnit>("mph");
  const [tempUnit1, setTempUnit1] = useState<TempUnit>("°C");
  const [tempUnit2, setTempUnit2] = useState<TempUnit>("°F");
  const [value, setValue] = useState("");
  const [convertedValue, setConvertedValue] = useState("");
  const [isReversed, setIsReversed] = useState(false);
  const [isSpeed, setIsSpeed] = useState(true);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const convertSpeed = (
    inputValue: string,
    fromUnit: SpeedUnit,
    toUnit: SpeedUnit
  ) => {
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) return "";

    let result = 0;
    if (fromUnit === "km/h" && toUnit === "mph") {
      result = numValue * 0.621371;
    } else if (fromUnit === "mph" && toUnit === "km/h") {
      result = numValue / 0.621371;
    } else {
      result = numValue;
    }
    return Math.round(result);
  };

  const convertTemp = (
    inputValue: string,
    fromUnit: TempUnit,
    toUnit: TempUnit
  ) => {
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) return "";

    let result = 0;
    if (fromUnit === "°C" && toUnit === "°F") {
      result = (numValue * 9) / 5 + 32;
    } else if (fromUnit === "°F" && toUnit === "°C") {
      result = ((numValue - 32) * 5) / 9;
    } else {
      result = numValue;
    }
    return Math.round(result * 100) / 100;
  };

  useEffect(() => {
    if (value) {
      const result = isSpeed
        ? convertSpeed(value, unit1, unit2)
        : convertTemp(value, tempUnit1, tempUnit2);
      setConvertedValue(result.toString());
    } else {
      setConvertedValue("");
    }
  }, [value, unit1, unit2, tempUnit1, tempUnit2, isSpeed]);

  const handleConvertPress = () => {
    Animated.timing(rotateAnim, {
      toValue: isReversed ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setIsReversed(!isReversed);
    if (isSpeed) {
      setUnit1((prev) => (prev === "km/h" ? "mph" : "km/h"));
      setUnit2((prev) => (prev === "km/h" ? "mph" : "km/h"));
    } else {
      setTempUnit1((prev) => (prev === "°C" ? "°F" : "°C"));
      setTempUnit2((prev) => (prev === "°C" ? "°F" : "°C"));
    }
  };

  const handleTypeChange = (speed: boolean) => {
    if (speed !== isSpeed) {
      setValue("");
      setConvertedValue("");
      setIsSpeed(speed);
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-180deg"],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Conversor</Text>

        <View style={styles.converterBox}>
          <View style={styles.row}>
            <Text style={styles.unitText}>
              {isSpeed ? unit1 : tempUnit1 === "°C" ? "Celsius" : "Fahrenheit"}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { color: value ? "#272729" : "#D9D9D9" }]}
              keyboardType="numeric"
              placeholder={
                isSpeed
                  ? unit1 === "km/h"
                    ? "80"
                    : "50"
                  : tempUnit1 === "°C"
                  ? "25"
                  : "77"
              }
              placeholderTextColor="#D9D9D9"
              value={value}
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9.]/g, "").slice(0, 6);
                setValue(numericValue);
              }}
              maxLength={6}
            />
            <Text
              style={[
                styles.unitText,
                {
                  color: value ? "#272729" : "#D9D9D9",
                  fontSize: 36,
                  fontWeight: "bold",
                },
              ]}
            >
              {isSpeed ? unit1 : tempUnit1}
            </Text>
          </View>

          <View style={styles.center}>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.convertButton}
              onPress={handleConvertPress}
            >
              <Animated.Image
                source={require("./assets/arrow.png")}
                style={[styles.arrow, { transform: [{ rotate: spin }] }]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <Text style={styles.unitText}>
              {isSpeed ? unit2 : tempUnit2 === "°C" ? "Celsius" : "Fahrenheit"}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { color: value ? "#4ACBCB" : "#D9D9D9" }]}
              editable={false}
              value={convertedValue}
              placeholder={
                isSpeed
                  ? unit2 === "km/h"
                    ? "80"
                    : "50"
                  : tempUnit2 === "°C"
                  ? "25"
                  : "77"
              }
              placeholderTextColor="#D9D9D9"
            />
            <Text
              style={[
                styles.unitText,
                {
                  color: value ? "#4ACBCB" : "#D9D9D9",
                  fontSize: 36,
                  fontWeight: "bold",
                },
              ]}
            >
              {isSpeed ? unit2 : tempUnit2}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.typeButton, isSpeed && styles.activeButton]}
            onPress={() => handleTypeChange(true)}
          >
            <Text
              style={[styles.buttonText, isSpeed && styles.activeButtonText]}
            >
              Velocidade
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, !isSpeed && styles.activeButton]}
            onPress={() => handleTypeChange(false)}
          >
            <Text
              style={[styles.buttonText, !isSpeed && styles.activeButtonText]}
            >
              Temperatura
            </Text>
          </TouchableOpacity>
        </View>

        <ExpoStatusBar style="light" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#272729",
    marginBottom: 20,
  },
  converterBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    justifyContent: "space-between",
    height: 300,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  unitText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 60,
    backgroundColor: "transparent",
    borderRadius: 6,
    fontSize: 36,
    fontWeight: "bold",
    paddingRight: 0,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    position: "relative",
  },
  divider: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#F5F5F7",
    zIndex: 1,
  },
  convertButton: {
    backgroundColor: "#F5F5F7",
    padding: 10,
    borderRadius: 50,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  arrow: {
    width: 20,
    height: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  typeButton: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: "#EAEAEA",
    marginHorizontal: 5,
    height: 50,
  },
  activeButton: {
    backgroundColor: "#272729",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#272729",
    textAlign: "center",
  },
  activeButtonText: {
    color: "#FFFFFF",
  },
});
