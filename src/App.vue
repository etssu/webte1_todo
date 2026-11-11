<script setup>
import { ref, watch, computed } from 'vue';
import { getTasks, addTask, markDone, markUndone, updateTask, deleteTask} from './services/api.js';

// store tasks
const tasks = ref([]);
const studentName = ref('');
const errorMessage = ref('');

// Add task dialog
const showAddDialog = ref(false);

// Edit task dialog
const showEditDialog = ref(false);
const editingTaskId = ref(null);
const editForm = ref(null);
const editIsFinished = ref(false);

// New task fields
const addForm = ref(null);
const title = ref('');
const description = ref('');
const dateFrom = ref('');
const dateTo = ref('');

// Delete task dialog
const showDeleteDialog = ref(false);
const deletingTaskId = ref(null);

// Indicators
const isLoading = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);


async function loadTasks() {
  isLoading.value = true;

  try {
    const response = await getTasks(studentName.value);
    tasks.value = response.todos;

    const savedStatuses = localStorage.getItem(
      getStatusKey(studentName.value.trim())
    );

    taskStatuses.value = savedStatuses
      ? JSON.parse(savedStatuses)
      : {};
  } catch (error) {
    errorMessage.value = 'Failed to load tasks.';
    console.error(error);
  } finally {
    isLoading.value = false;
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
  const { valid } = await addForm.value.validate();

  if (!valid) return;

  const task = {
    title: title.value,
    description: description.value,
    date_from: dateFrom.value,
    date_to: dateTo.value,
    is_finished: false,
  };

  isSaving.value = true;

  try {
    const success = await createTask(task);

    if (!success) return;

    title.value = '';
    description.value = '';
    dateFrom.value = '';
    dateTo.value = '';

    showAddDialog.value = false;
    addForm.value.resetValidation();
  } finally {
    isSaving.value = false;
  }
}

// Get storage key for a specific student
function getStatusKey(studentName) {
    return `taskStatuses_${studentName}`;
}

// Store additional task statuses
const taskStatuses = ref({});

// Save statuses whenever they change
watch(taskStatuses, (newStatuses) => {
    if (!studentName.value.trim()) return;

    localStorage.setItem(
        getStatusKey(studentName.value.trim()),
        JSON.stringify(newStatuses)
    );
}, { deep: true });

function changeTaskStatus(taskId, newStatus) {
  taskStatuses.value[taskId] = newStatus;
}

async function completeTask(taskId) {
    try {
        await markDone(studentName.value.trim(), taskId);
        await loadTasks();
    } catch (error) {
        errorMessage.value = 'Failed to complete task.';
        console.error(error);
    }
}

async function restoreTask(taskId, newStatus) {
  try {
    await markUndone(studentName.value.trim(), taskId);
    await loadTasks();

    taskStatuses.value[taskId] = newStatus;
  } catch (error) {
    errorMessage.value = 'Failed to restore task.';
    console.error(error);
  }
}

function openEditDialog(task) {
  editingTaskId.value = task.id;

  title.value = task.title;
  description.value = task.description || '';
  dateFrom.value = task.date_from;
  dateTo.value = task.date_to;
  editIsFinished.value = task.is_finished;

  showEditDialog.value = true;
}

async function saveEditedTask() {
  const { valid } = await editForm.value.validate();
  if (!valid) return;

  const updatedTask = {
    title: title.value,
    description: description.value,
    date_from: dateFrom.value,
    date_to: dateTo.value,
    is_finished: editIsFinished.value,
  };

  isSaving.value = true;

  try {
    await updateTask(
      studentName.value.trim(),
      editingTaskId.value,
      updatedTask
    );

    await loadTasks();
    showEditDialog.value = false;
    editingTaskId.value = null;
  } catch (error) {
    errorMessage.value = 'Failed to update task.';
    console.error(error);
  } finally {
    isSaving.value = false;
  }
}

function openDeleteDialog(task) {
  deletingTaskId.value = task.id;
  showDeleteDialog.value = true;
}

async function confirmDeleteTask() {
  isDeleting.value = true;

  try {
    await deleteTask(studentName.value.trim(), deletingTaskId.value);
    await loadTasks();

    showDeleteDialog.value = false;
    deletingTaskId.value = null;
  } catch (error) {
    errorMessage.value = 'Failed to delete task.';
    console.error(error);
  } finally {
    isDeleting.value = false;
  }
}

const titleRules = [
  (value) => !!value?.trim() || 'Title is required',
  (value) => (value?.length ?? 0) <= 200 || 'Maximum 200 characters allowed',
];

const descriptionRules = [
  (value) => (value?.length ?? 0) <= 1000 || 'Maximum 1000 characters allowed',
];

const dateFromRules = [(value) => !!value || 'Start date is required'];

const dateToRules = [
  (value) => !!value || 'End date is required',
  (value) => {
    if (!value || !dateFrom.value) return true;

    return new Date(value) > new Date(dateFrom.value) || 'End date must be after start date';
  },
];

const todoTasks = computed(() => {
  return tasks.value.filter(
    (task) => !task.is_finished && (taskStatuses.value[task.id] || 'todo') === 'todo'
  );
});

const inProgressTasks = computed(() => {
  return tasks.value.filter(
    (task) => !task.is_finished && taskStatuses.value[task.id] === 'in_progress'
  );
});

const finishedTasks = computed(() => {
  return tasks.value.filter((task) => task.is_finished);
});
</script>

<template>
  <v-app>
    <v-app-bar color="primary" elevation="2" height="110">
      <v-app-bar-title class="text-center app-bar-title"> Moj TODO List </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-row justify="center" align="center" class="mt-6">
        <v-col cols="12" md="5">
          <v-text-field v-model="studentName" label="Student ID" placeholder="Enter your ID" />

          <p v-if="errorMessage" class="text-error text-caption mt-n4">
            {{ errorMessage }}
          </p>
        </v-col>

        <v-col cols="12" md="2" class="d-flex justify-center">
          <v-btn
            class="loader"
            color="primary"
            :loading="isLoading"
            :disabled="isLoading"
            @click="loadTasks"
          >
            Load tasks
          </v-btn>
        </v-col>
      </v-row>

      <v-progress-linear
        v-if="isLoading"
        indeterminate
        color="primary"
        class="mb-4"
      />

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
              <v-card-title class="text-h6 font-weight-bold"> TODO </v-card-title>

              <v-card-subtitle> Tasks waiting to be started </v-card-subtitle>

              <v-card-text>
                <div class="text-h4 font-weight-bold">{{ todoTasks.length }}</div>
                <div class="text-caption">Tasks</div>

                <v-card
                  v-for="task in todoTasks"
                  :key="task.id"
                  class="mb-3"
                  rounded="lg"
                  color="white"
                >
                  <v-card-title class="text-subtitle-1 font-weight-bold">
                    {{ task.title }}
                  </v-card-title>

                  <v-card-text>
                    {{ task.description }}

                    <div class="text-caption mt-3">
                      <v-icon size="small" class="mr-1">mdi-calendar-clock</v-icon>
                      Deadline: {{ new Date(task.date_to).toLocaleString() }}
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-menu>
                      <template v-slot:activator="{ props }">
                        <v-chip
                          v-bind="props"
                          color="secondary"
                          variant="tonal"
                          size="small"
                          append-icon="mdi-chevron-down"
                        >
                          {{ taskStatuses[task.id] === 'in_progress' ? 'In Progress' : 'To Do' }}
                        </v-chip>
                      </template>

                      <v-list density="compact">
                        <v-list-item title="In Progress" @click="changeTaskStatus(task.id, 'in_progress')" />
                        <v-list-item title="Done" @click="completeTask(task.id)" />
                      </v-list>

                    </v-menu>

                    <v-spacer />

                    <v-btn
                      icon="mdi-pencil"
                      size="small"
                      variant="text"
                      @click="openEditDialog(task)"
                    />
                    <v-btn
                      icon="mdi-delete"
                      size="small"
                      variant="text"
                      color="error"
                      @click="openDeleteDialog(task)"
                    />
                  </v-card-actions>
                </v-card>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- IN PROGRESS -->
          <v-col cols="12" md="4">
            <v-card color="#E8C2CA" rounded="lg" elevation="2">
              <v-card-title class="text-h6 font-weight-bold"> IN PROGRESS </v-card-title>

              <v-card-subtitle> Tasks currently in progress </v-card-subtitle>

              <v-card-text>
                <div class="text-h4 font-weight-bold">{{ inProgressTasks.length }}</div>
                <div class="text-caption">Tasks</div>

                <v-card
                  v-for="task in inProgressTasks"
                  :key="task.id"
                  class="mb-3"
                  rounded="lg"
                  color="white"
                >
                  <v-card-title class="text-subtitle-1 font-weight-bold">
                    {{ task.title }}
                  </v-card-title>
                  <v-card-text>
                    {{ task.description }}

                    <div class="text-caption mt-3">
                      <v-icon size="small" class="mr-1">mdi-calendar-clock</v-icon>
                      Deadline: {{ new Date(task.date_to).toLocaleString() }}
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-menu>
                      <template v-slot:activator="{ props }">
                        <v-chip
                          v-bind="props"
                          color="secondary"
                          variant="tonal"
                          size="small"
                          append-icon="mdi-chevron-down"
                        >
                          {{ taskStatuses[task.id] === 'in_progress' ? 'In Progress' : 'To Do' }}
                        </v-chip>
                      </template>

                      <v-list density="compact">
                        <v-list-item title="To Do" @click="changeTaskStatus(task.id, 'todo')" />

                        <v-list-item title="Done" @click="completeTask(task.id)" />
                      </v-list>
                    </v-menu>

                    <v-spacer />

                    <v-btn
                      icon="mdi-pencil"
                      size="small"
                      variant="text"
                      @click="openEditDialog(task)"
                    />

                    <v-btn
                      icon="mdi-delete"
                      size="small"
                      variant="text"
                      color="error"
                      @click="openDeleteDialog(task)"
                    />
                  </v-card-actions>
                </v-card>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- DONE -->
          <v-col cols="12" md="4">
            <v-card color="#D1B3C4" rounded="lg" elevation="2">
              <v-card-title class="text-h6 font-weight-bold"> DONE </v-card-title>

              <v-card-subtitle> Successfully completed tasks </v-card-subtitle>

              <v-card-text>
                <div class="text-h4 font-weight-bold">{{ finishedTasks.length }}</div>
                <div class="text-caption">Tasks</div>

                <v-card
                  v-for="task in finishedTasks"
                  :key="task.id"
                  class="mb-3"
                  rounded="lg"
                  color="white"
                >
                  <v-card-title class="text-subtitle-1 font-weight-bold">
                    {{ task.title }}
                  </v-card-title>
                  <v-card-text>
                    {{ task.description }}

                    <div class="text-caption mt-3">
                      <v-icon size="small" class="mr-1">mdi-calendar-clock</v-icon>
                      Deadline: {{ new Date(task.date_to).toLocaleString() }}
                    </div>
                  </v-card-text>

                  <v-card-actions>
                    <v-menu>
                      <template v-slot:activator="{ props }">
                        <v-chip
                          v-bind="props"
                          color="secondary"
                          variant="tonal"
                          size="small"
                          append-icon="mdi-chevron-down"
                        >
                          Done
                        </v-chip>
                      </template>

                      <v-list density="compact">
                        <v-list-item title="To Do" @click="restoreTask(task.id, 'todo')" />
                        <v-list-item title="In Progress"  @click="restoreTask(task.id, 'in_progress')" />            
                      </v-list>
                      
                    </v-menu>

                    <v-spacer />

                    <v-btn
                      icon="mdi-pencil"
                      size="small"
                      variant="text"
                      @click="openEditDialog(task)"
                    />
                    <v-btn
                      icon="mdi-delete"
                      size="small"
                      variant="text"
                      color="error"
                      @click="openDeleteDialog(task)"
                    />
                  </v-card-actions>
                </v-card>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-dialog v-model="showAddDialog" max-width="600">
      <v-card rounded="lg">
        <v-card-title class="text-h5 font-weight-bold"> Add new task </v-card-title>

        <v-card-text>
          <v-form ref="addForm">
            <v-text-field
              v-model="title"
              label="Title"
              placeholder="Enter task title"
              :rules="titleRules"
            />

            <v-textarea
              v-model="description"
              label="Description"
              placeholder="Enter task description"
              rows="3"
              :rules="descriptionRules"
            />

            <v-text-field
              v-model="dateFrom"
              label="Start date"
              type="datetime-local"
              :rules="dateFromRules"
            />

            <v-text-field
              v-model="dateTo"
              label="End date"
              type="datetime-local"
              :rules="dateToRules"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="showAddDialog = false"> Cancel </v-btn>

          <v-btn
            color="primary"
            :loading="isSaving"
            :disabled="isSaving"
            @click="saveTask"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showEditDialog" max-width="600">
      <v-card rounded="lg">
        <v-card-title class="text-h5 font-weight-bold">
          Edit task
        </v-card-title>

        <v-card-text>
          <v-form ref="editForm">
            <v-text-field
              v-model="title"
              label="Title"
              :rules="titleRules"
            />

            <v-textarea
              v-model="description"
              label="Description"
              rows="3"
              :rules="descriptionRules"
            />

            <v-text-field
              v-model="dateFrom"
              label="Start date"
              type="datetime-local"
              :rules="dateFromRules"
            />

            <v-text-field
              v-model="dateTo"
              label="End date"
              type="datetime-local"
              :rules="dateToRules"
            />

            <v-checkbox
              v-model="editIsFinished"
              label="Task completed"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="showEditDialog = false">
            Cancel
          </v-btn>

          <v-btn
            color="primary"
            :loading="isSaving"
            :disabled="isSaving"
            @click="saveEditedTask"
          >
            Save changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title>Delete task?</v-card-title>

        <v-card-text>
          Are you sure you want to delete this task?
          This action cannot be undone.
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            variant="text"
            @click="showDeleteDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="error"
            variant="flat"
            :loading="isDeleting"
            :disabled="isDeleting"
            @click="confirmDeleteTask"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<style scoped></style>
