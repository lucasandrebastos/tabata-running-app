import React, { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useWorkout } from "../context/WorkoutContext";

const zoneColorMap = {
  "Zone 1": "#2E7D32",
  "Zone 2": "#F9A825",
  "Zone 3": "#EF6C00",
  "Zone 4": "#E53935",
  "Zone 5": "#8E24AA",
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function WorkoutScreen() {
  const { state, pause, resume, stop } = useWorkout();
  const totalRounds = useMemo(
    () => state.steps.filter((step) => step.type === "work").length,
    [state.steps]
  );
  const currentRound = useMemo(() => {
    if (!state.currentStep || state.steps.length === 0) {
      return 0;
    }
    const uptoCurrent = state.steps.slice(0, state.currentStepIndex + 1);
    return uptoCurrent.filter((step) => step.type === "work").length;
  }, [state.currentStep, state.currentStepIndex, state.steps]);
  const zoneColor = state.currentStep?.zone
    ? zoneColorMap[state.currentStep.zone]
    : "#5B5B6B";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.roundText}>
          {totalRounds > 0
            ? `Round ${currentRound} of ${totalRounds}`
            : "Round —"}
        </ThemedText>

        <ThemedText style={styles.timerText}>
          {formatTime(state.timeLeft)}
        </ThemedText>

        <ThemedText style={[styles.zoneText, { color: zoneColor }]}>
          {state.currentStep?.zone ?? "Zone —"}
        </ThemedText>

        <ThemedText style={styles.stepLabel}>
          {state.currentStep?.name ?? "Ready"}
        </ThemedText>
      </View>

      <View style={styles.controls}>
        <View style={styles.row}>
          {state.isPaused ? (
            <Pressable style={styles.resumeButton} onPress={resume}>
              <ThemedText style={styles.resumeText}>Play</ThemedText>
            </Pressable>
          ) : (
            <Pressable style={styles.pauseButton} onPress={pause}>
              <ThemedText style={styles.pauseText}>Pause</ThemedText>
            </Pressable>
          )}
          <Pressable style={styles.stopButton} onPress={stop}>
            <ThemedText style={styles.stopText}>Stop</ThemedText>
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  roundText: {
    fontSize: 18,
    color: "#5B5B6B",
  },
  timerText: {
    fontSize: 72,
    lineHeight: 84,
    fontWeight: "700",
    color: "#101016",
    letterSpacing: 2,
    paddingVertical: 4,
  },
  zoneText: {
    fontSize: 24,
    fontWeight: "700",
  },
  stepLabel: {
    fontSize: 18,
    color: "#5B5B6B",
  },
  controls: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  pauseButton: {
    flex: 1,
    backgroundColor: "#1C66FF",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  pauseText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  resumeButton: {
    flex: 1,
    backgroundColor: "#2E7D32",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  resumeText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  stopButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#E53935",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  stopText: {
    color: "#E53935",
    fontSize: 18,
    fontWeight: "700",
  },
});
