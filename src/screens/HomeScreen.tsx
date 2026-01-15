import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useWorkout } from "../context/WorkoutContext";
import { useWorkouts } from "../context/WorkoutsContext";
import { linearizeWorkoutSteps } from "../domain/models/linearize-workout";
import type { Workout } from "../domain/models/workout";
import type { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

function getWorkoutSummary(workout: Workout) {
  const steps = linearizeWorkoutSteps(workout);
  const totalSeconds = steps.reduce(
    (acc, step) => acc + step.durationSeconds,
    0
  );
  const rounds = workout.intervals.reduce(
    (acc, interval) => acc + interval.rounds,
    0
  );
  return {
    minutes: Math.round(totalSeconds / 60),
    rounds,
  };
}

export function HomeScreen({ navigation }: Props) {
  const { start } = useWorkout();
  const { workouts } = useWorkouts();
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(
    null
  );

  const selectedWorkout = useMemo(
    () => workouts.find((workout) => workout.id === selectedWorkoutId) ?? null,
    [selectedWorkoutId, workouts]
  );

  const handleStartWorkoutPress = () => {
    if (!selectedWorkout) {
      return;
    }
    const steps = linearizeWorkoutSteps(selectedWorkout);
    start(steps);
    navigation.navigate("Workout");
  };

  const handleCreateWorkoutPress = () => {
    navigation.navigate("CreateWorkoutStack");
  };

  const renderWorkoutCard = ({ item }: { item: Workout }) => {
    const summary = getWorkoutSummary(item);
    const isSelected = item.id === selectedWorkoutId;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          isSelected ? styles.cardSelected : null,
          pressed ? styles.cardPressed : null,
        ]}
        onPress={() => setSelectedWorkoutId(item.id)}
      >
        <ThemedText style={styles.cardTitle}>{item.name}</ThemedText>
        <ThemedText style={styles.cardMeta}>
          {summary.minutes} min · {summary.rounds} rounds
        </ThemedText>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Your Workouts</ThemedText>
        <ThemedText style={styles.subtitle}>
          Pick a workout to start or create a new one.
        </ThemedText>
      </View>

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={renderWorkoutCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed ? styles.primaryButtonPressed : null,
            !selectedWorkout ? styles.primaryButtonDisabled : null,
          ]}
          onPress={handleStartWorkoutPress}
          disabled={!selectedWorkout}
        >
          <ThemedText style={styles.primaryButtonText}>
            Start Workout
          </ThemedText>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed ? styles.secondaryButtonPressed : null,
          ]}
          onPress={handleCreateWorkoutPress}
        >
          <ThemedText style={styles.secondaryButtonText}>
            Create Workout
          </ThemedText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  /* ---------- Screen ---------- */
  container: {
    flex: 1,
    backgroundColor: "#F5F7F8",
  },

  /* ---------- Header ---------- */
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#64748B",
  },

  /* ---------- List ---------- */
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },

  /* ---------- Card ---------- */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  cardSelected: {
    borderWidth: 2,
    borderColor: "#2563EB", // blue-600
  },

  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },

  cardMeta: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748B",
  },

  /* ---------- Footer ---------- */
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
    gap: 12,
  },

  /* ---------- Primary Button ---------- */
  primaryButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonPressed: {
    opacity: 0.85,
  },

  primaryButtonDisabled: {
    opacity: 0.5,
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  /* ---------- Secondary Button ---------- */
  secondaryButton: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2563EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonPressed: {
    opacity: 0.9,
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2563EB",
  },
});
