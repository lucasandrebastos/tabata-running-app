import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import type { CreateWorkoutStackParamList } from '../types/navigation';
import { CreateWorkoutScreen } from '../screens/CreateWorkoutScreen';

const Stack = createNativeStackNavigator<CreateWorkoutStackParamList>();

export function CreateWorkoutStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CreateWorkoutHome"
        component={CreateWorkoutScreen}
        options={{ title: 'Create Workout' }}
      />
    </Stack.Navigator>
  );
}

