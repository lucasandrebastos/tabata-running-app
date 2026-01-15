import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import type { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

type Workout = {
  id: string;
  name: string;
  durationMinutes: number;
  rounds: number;
};

const MOCK_WORKOUTS: Workout[] = [
  { id: "w1", name: "Tabata Sprint", durationMinutes: 20, rounds: 8 },
  { id: "w2", name: "Hill Intervals", durationMinutes: 30, rounds: 6 },
  { id: "w3", name: "Tempo Run", durationMinutes: 25, rounds: 4 },
];

export function HomeScreen({ navigation }: Props) {
  const handleStartWorkoutPress = () => {
    // TODO: Hook up to active workout flow.
  };

  const handleCreateWorkoutPress = () => {
    navigation.navigate("CreateWorkoutStack");
  };

  const renderWorkoutCard = ({ item }: { item: Workout }) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed ? styles.cardPressed : null,
      ]}
      onPress={() => {
        // TODO: Navigate to workout details in the future.
      }}
    >
      <ThemedText style={styles.cardTitle}>{item.name}</ThemedText>
      <ThemedText style={styles.cardMeta}>
        {item.durationMinutes} min · {item.rounds} rounds
      </ThemedText>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Your Workouts</ThemedText>
        <ThemedText style={styles.subtitle}>
          Pick a workout to start or create a new one.
        </ThemedText>
      </View>

      <FlatList
        data={MOCK_WORKOUTS}
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
          ]}
          onPress={handleStartWorkoutPress}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FA",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#101016",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#5B5B6B",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111118",
  },
  cardMeta: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B6B78",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#1C66FF",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#1C66FF",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  secondaryButtonPressed: {
    opacity: 0.9,
  },
  secondaryButtonText: {
    color: "#1C66FF",
    fontSize: 16,
    fontWeight: "600",
  },
});
