import React, { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useWorkout } from "../context/WorkoutContext";
import type { Step } from "../domain/models/workout";

const mockSteps: Step[] = [
  {
    id: "wu-1",
    name: "Warm-up",
    type: "recovery",
    durationSeconds: 60,
    zone: "Zone 1",
  },
  {
    id: "run-1",
    name: "Run",
    type: "work",
    durationSeconds: 30,
    zone: "Zone 3",
  },
  {
    id: "rest-1",
    name: "Recovery",
    type: "rest",
    durationSeconds: 30,
    zone: "Zone 1",
  },
  {
    id: "cd-1",
    name: "Cooldown",
    type: "recovery",
    durationSeconds: 60,
    zone: "Zone 1",
  },
];

export function WorkoutScreen() {
  const { state, start, pause, resume, stop } = useWorkout();
  const steps = useMemo(() => mockSteps, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <ThemedText style={styles.title}>Workout Timer</ThemedText>
        <ThemedText style={styles.label}>
          Step: {state.currentStep?.name ?? "—"}
        </ThemedText>
        <ThemedText style={styles.label}>
          Zone: {state.currentStep?.zone ?? "—"}
        </ThemedText>
        <ThemedText style={styles.label}>
          Time Left: {state.timeLeft}s
        </ThemedText>
      </View>

      <View style={styles.controls}>
        <Pressable style={styles.primaryButton} onPress={() => start(steps)}>
          <ThemedText style={styles.primaryText}>Start</ThemedText>
        </Pressable>
        <View style={styles.row}>
          <Pressable style={styles.secondaryButton} onPress={pause}>
            <ThemedText style={styles.secondaryText}>Pause</ThemedText>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={resume}>
            <ThemedText style={styles.secondaryText}>Resume</ThemedText>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={stop}>
            <ThemedText style={styles.secondaryText}>Stop</ThemedText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FA",
    padding: 20,
  },
  section: {
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  label: {
    fontSize: 16,
  },
  controls: {
    marginTop: 24,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#1C66FF",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#1C66FF",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  secondaryText: {
    color: "#1C66FF",
    fontWeight: "600",
  },
});
