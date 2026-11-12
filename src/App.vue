<script setup>
import { useTasks } from './composables/useTasks.js';

const {
  // store tasks
    tasks,
    studentName,
    errorMessage,
    taskStatuses,

    // New task fields
    title,
    description,
    dateFrom,
    dateTo,

    addForm,
    editForm,

    // dialogs
    showAddDialog,
    showEditDialog,
    showDeleteDialog,
    showResetDialog,

    isLoading,
    isSaving,
    isDeleting,
    isResetting,

    showSuccess,
    successMessage,

    titleRules,
    descriptionRules,
    dateFromRules,
    dateToRules,

    todoTasks,
    inProgressTasks,
    finishedTasks,

    loadTasks,
    saveTask,
    changeTaskStatus,
    completeTask,
    restoreTask,
    openEditDialog,
    saveEditedTask,
    openDeleteDialog,
    confirmDeleteTask,
    confirmResetTasks
} = useTasks();

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

          <v-btn
            color="error"
            variant="outlined"
            @click="showResetDialog = true"
          >
            <v-icon start>mdi-refresh</v-icon>
            Reset tasks
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

                    <div
                      class="text-caption mt-3">
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

    <v-dialog v-model="showResetDialog" max-width="450">
    <v-card rounded="lg">
      <v-card-title class="text-h5 font-weight-bold">
        Reset tasks?
      </v-card-title>

      <v-card-text>
        Are you sure you want to reset your tasks to the initial sample data?
        <span class="text-error font-weight-bold">
          All your current tasks will be deleted.
        </span>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          variant="text"
          @click="showResetDialog = false"
        >
          Cancel
        </v-btn>

        <v-btn
          color="error"
          variant="flat"
          :loading="isResetting"
          :disabled="isResetting"
          @click="confirmResetTasks"
        >
          Reset
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

      <v-snackbar
        v-model="showSuccess"
        :timeout="3000"
        color="success"
        location="top"
      >
        {{ successMessage }}

        <template #actions>
          <v-btn variant="text" @click="showSuccess = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
  </v-app>
</template>

<style scoped></style>
