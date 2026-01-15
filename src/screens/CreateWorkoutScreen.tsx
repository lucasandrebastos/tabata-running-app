import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export function CreateWorkoutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text>Create Workout</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
