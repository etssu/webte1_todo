<script setup>
  import { ref } from 'vue';
  import { getTasks } from './services/api.js';

  // store tasks
  const tasks = ref([]);
  const name = ref('');
  const errorMessage = ref('');

  async function loadTasks() {
    errorMessage.value = '';

    if (!name.value.trim()) {
        errorMessage.value = 'Please enter your name to continue.';
        return;
    }

    try {
        tasks.value = await getTasks(name.value);
    } catch (error) {
        errorMessage.value = 'Failed to load tasks. Please try again.';
        console.error(error);
    }
  }

  async function createTask(task) {
    try {
        await addTask(name.value, task);
        await loadTasks();
    } catch (error) {
        errorMessage.value = 'Failed to add task. Please try again.';
        console.error(error);
    }
  }
</script>

<template>
  <v-app>
    <v-app-bar color="primary" elevation="2" height="110">
      <v-app-bar-title class="text-center app-bar-title">
        Moj TODO List
      </v-app-bar-title>
    </v-app-bar>
    
    <v-main>
      <v-row justify="center" align="center" class="mt-6">
        <v-col cols="12" md="5">
          <v-text-field
            v-model="name"
            label="Student ID"
            placeholder="Enter your ID"
          />

          <p v-if="errorMessage" class="text-error text-caption mt-n4">
            {{ errorMessage }}
          </p>
        </v-col>

        <v-col cols="12" md="2" class="d-flex justify-center">
          <v-btn
            class="loader"
            color="primary"
            @click="loadTasks()"
          >
            Load tasks
          </v-btn>
        </v-col>
      </v-row>

      <v-container>
        <v-row justify="center" class="mt-2">
          <v-btn color="secondary">
            <v-icon start>mdi-plus</v-icon>
            Add task
          </v-btn>
        </v-row>

        <v-row class="mt-6" align="start">
          <!-- TODO -->
          <v-col cols="12" md="4">
            <v-card color="#F7D1CD" rounded="lg" elevation="2">
              <v-card-title class="text-h6 font-weight-bold">
                TODO
              </v-card-title>

              <v-card-subtitle>
                Tasks waiting to be started
              </v-card-subtitle>

              <v-card-text>
                <div class="text-h4 font-weight-bold">0</div>
                <div class="text-caption">Tasks</div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- IN PROGRESS -->
          <v-col cols="12" md="4">
            <v-card color="#E8C2CA" rounded="lg" elevation="2">
              <v-card-title class="text-h6 font-weight-bold">
                IN PROGRESS
              </v-card-title>

              <v-card-subtitle>
                Tasks currently in progress
              </v-card-subtitle>

              <v-card-text>
                <div class="text-h4 font-weight-bold">0</div>
                <div class="text-caption">Tasks</div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- DONE -->
          <v-col cols="12" md="4">
            <v-card color="#D1B3C4" rounded="lg" elevation="2">
              <v-card-title class="text-h6 font-weight-bold">
                DONE
              </v-card-title>

              <v-card-subtitle>
                Successfully completed tasks
              </v-card-subtitle>

              <v-card-text>
                <div class="text-h4 font-weight-bold">0</div>
                <div class="text-caption">Tasks</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>

</template>

<style scoped></style>
