<script setup>
  import { ref } from 'vue';
  import { getTasks, addTask } from './services/api.js';

  // store tasks
  const tasks = ref([]);
  const studentName = ref('');
  const errorMessage = ref('');

  // Add task dialog
  const showAddDialog = ref(false);

  // New task fields
  const title = ref('');
  const description = ref('');
  const dateFrom = ref('');
  const dateTo = ref('');

  async function loadTasks() {
    errorMessage.value = '';

    if (!studentName.value.trim()) {
        errorMessage.value = 'Please enter your name to continue.';
        return;
    }

    try {
        tasks.value = await getTasks(studentName.value);
    } catch (error) {
        errorMessage.value = 'Failed to load tasks. Please try again.';
        console.error(error);
    }
  }

  async function createTask(task) {
    try {
        await addTask(studentName.value, task);
        await loadTasks();
        return true;
    } catch (error) {
        errorMessage.value = 'Failed to add task. Please try again.';
        console.error(error);
        return false;
    }
  }

  async function saveTask() {
    const task = {
        title: title.value,
        description: description.value,
        date_from: dateFrom.value,
        date_to: dateTo.value,
        is_finished: false
    };

    await createTask(task);

    // Clear form
    title.value = '';
    description.value = '';
    dateFrom.value = '';
    dateTo.value = '';

    showAddDialog.value = false;
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
            v-model="studentName"
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
          <v-btn color="secondary" @click="showAddDialog = true">
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

    <v-dialog v-model="showAddDialog" max-width="600">
      <v-card rounded="lg">
        <v-card-title class="text-h5 font-weight-bold">
          Add new task
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="title"
            label="Title"
            placeholder="Enter task title"
          />

          <v-textarea
            v-model="description"
            label="Description"
            placeholder="Enter task description"
            rows="3"
          />

          <v-text-field
            v-model="dateFrom"
            label="Start date"
            type="datetime-local"
          />

          <v-text-field
            v-model="dateTo"
            label="End date"
            type="datetime-local"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            variant="text"
            @click="showAddDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn color="primary" @click="saveTask">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>

</template>

<style scoped></style>
