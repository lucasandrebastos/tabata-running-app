import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Button, SafeAreaView, StyleSheet, View } from "react-native";

import type { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const handleCreateWorkoutPress = () => {
    navigation.navigate("CreateWorkoutStack");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Button title="Create Workout" onPress={handleCreateWorkoutPress} />
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
    justifyContent: "center",
    paddingHorizontal: 16,
  },
});
