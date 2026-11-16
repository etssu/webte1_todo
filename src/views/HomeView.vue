<script setup>
import { useTasks } from '../composables/useTasks.js';
import TaskColumn from '../components/TaskColumn.vue';
import TodoCalendar from '../components/TodoCalendar.vue';

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
  editIsFinished,

  addForm,
  editForm,

  // Filters
  searchQuery,
  sortBy,
  taskFilter,

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
  unfinishedTasks,

  loadTasks,
  saveTask,
  changeTaskStatus,
  completeTask,
  restoreTask,
  openEditDialog,
  saveEditedTask,
  openDeleteDialog,
  openDeleteDialogFromEdit,
  confirmDeleteTask,
  confirmResetTasks,
  openAddDialogFromCalendar,
} = useTasks();

</script>

<template>
      <v-row justify="center" align="center" class="mt-6 id-row">
        <v-col cols="12" md="5">
          <v-text-field v-model="studentName" label="ID študenta" placeholder="Zadajte svoje ID" />
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
            Načítať úlohy
          </v-btn>
        </v-col>
      </v-row>

      <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4" />

      <v-container id="tasks">
        <v-row justify="center" class="mt-2 action-row">
          <v-btn color="secondary" @click="showAddDialog = true">
            <v-icon start>mdi-plus</v-icon>
            Pridať úlohu
          </v-btn>

          <v-btn color="error" variant="outlined" @click="showResetDialog = true">
            <v-icon start>mdi-refresh</v-icon>
            Obnoviť úlohy
          </v-btn>
        </v-row>

        <v-row justify="center" align="center" class="mt-6 filters-row">
          <v-col cols="12" md="5">
            <v-text-field
              v-model="searchQuery"
              label="Hľadať úlohy"
              placeholder="Zadajte názov úlohy"
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              v-model="sortBy"
              label="Zoradiť podľa"
              :items="[
                { title: 'Dátum začiatku', value: 'date_from' },
                { title: 'Dátum ukončenia', value: 'date_to' },
              ]"
              hide-details
            />
          </v-col>
        </v-row>

        <v-row justify="center" align="center" class="mt-6 status-row">
          <v-btn-toggle
            v-model="taskFilter"
            color="secondary"
            mandatory
            rounded="lg"
            class="task-filter-toggle"
          >
            <v-btn value="all">Všetky</v-btn>
            <v-btn value="todo">Nedokončené</v-btn>
            <v-btn value="done">Dokončené</v-btn>
          </v-btn-toggle>
        </v-row>

        <v-row class="mt-6" align="start">
          <template v-if="taskFilter === 'all'">
            <!-- TODO -->
            <TaskColumn
              :sort-by="sortBy"
              title="Na spracovanie"
              subtitle="Úlohy čakajúce na začatie"
              :tasks="todoTasks"
              :task-statuses="taskStatuses"
              color="#F7D1CD"
              @change-status="changeTaskStatus"
              @complete="completeTask"
              @restore="restoreTask"
              @edit="openEditDialog"
              @delete="openDeleteDialog"
            />

            <!-- IN PROGRESS -->
            <TaskColumn
              :sort-by="sortBy"
              title="Rozpracované"
              subtitle="Úlohy, na ktorých sa práve pracuje"
              :tasks="inProgressTasks"
              :task-statuses="taskStatuses"
              color="#E8C2CA"
              @change-status="changeTaskStatus"
              @complete="completeTask"
              @restore="restoreTask"
              @edit="openEditDialog"
              @delete="openDeleteDialog"
            />

            <!-- DONE -->
            <TaskColumn
              :sort-by="sortBy"
              title="Dokončené"
              subtitle="Dokončené úlohy"
              :tasks="finishedTasks"
              :task-statuses="taskStatuses"
              color="#D1B3C4"
              @change-status="changeTaskStatus"
              @complete="completeTask"
              @restore="restoreTask"
              @edit="openEditDialog"
              @delete="openDeleteDialog"
            />
          </template>

          <!-- TODO -->
          <template v-else-if="taskFilter === 'todo'">
            <TaskColumn
              full-width
              :sort-by="sortBy"
              title="Na spracovanie"
              subtitle="Všetky nedokončené úlohy"
              :tasks="unfinishedTasks"
              :task-statuses="taskStatuses"
              color="#F7D1CD"
              @change-status="changeTaskStatus"
              @complete="completeTask"
              @restore="restoreTask"
              @edit="openEditDialog"
              @delete="openDeleteDialog"
            />
          </template>

          <!-- DONE -->
          <template v-else>
            <TaskColumn
              full-width
              :sort-by="sortBy"
              title="Dokončené"
              subtitle="Všetky dokončené úlohy"
              :tasks="finishedTasks"
              :task-statuses="taskStatuses"
              color="#D1B3C4"
              @change-status="changeTaskStatus"
              @complete="completeTask"
              @restore="restoreTask"
              @edit="openEditDialog"
              @delete="openDeleteDialog"
            />
          </template>
        </v-row>
      </v-container>

      <v-container id="calendar">
        <TodoCalendar
          :tasks="tasks"
          @create-task="openAddDialogFromCalendar"
          @edit-task="openEditDialog"
        />
      </v-container>


    <v-dialog v-model="showAddDialog" max-width="600">
      <v-card rounded="lg">
        <v-card-title class="text-h5 font-weight-bold"> Pridať novú úlohu </v-card-title>

        <v-card-text>
          <v-form ref="addForm">
            <v-text-field
              v-model="title"
              label="Názov"
              placeholder="Zadajte názov úlohy"
              :rules="titleRules"
            />

            <v-textarea
              v-model="description"
              label="Popis"
              placeholder="Zadajte popis úlohy"
              rows="3"
              :rules="descriptionRules"
            />

            <v-text-field
              v-model="dateFrom"
              label="Dátum začiatku"
              type="datetime-local"
              :rules="dateFromRules"
            />

            <v-text-field
              v-model="dateTo"
              label="Dátum ukončenia"
              type="datetime-local"
              :rules="dateToRules"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="showAddDialog = false"> Zrušiť </v-btn>

          <v-btn color="primary" :loading="isSaving" :disabled="isSaving" @click="saveTask">
            Uložiť
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showEditDialog" max-width="600">
      <v-card rounded="lg">
        <v-card-title class="text-h5 font-weight-bold"> Upraviť úlohu </v-card-title>

        <v-card-text>
          <v-form ref="editForm">
            <v-text-field v-model="title" label="Názov" :rules="titleRules" />

            <v-textarea v-model="description" label="Popis" rows="3" :rules="descriptionRules" />

            <v-text-field
              v-model="dateFrom"
              label="Dátum začiatku"
              type="datetime-local"
              :rules="dateFromRules"
            />

            <v-text-field
              v-model="dateTo"
              label="Dátum ukončenia"
              type="datetime-local"
              :rules="dateToRules"
            />

            <v-select
              v-model="editIsFinished"
              label="	Stav"
              :items="[
                { title: 'Na spracovanie', value: 'todo' },
                { title: 'Rozpracované', value: 'in_progress' },
                { title: 'Dokončené', value: 'done' },
              ]"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="error"
            variant="outlined"
            :disabled="isSaving"
            @click="openDeleteDialogFromEdit"
          >
            <v-icon start>mdi-delete</v-icon>
            Odstrániť
          </v-btn>

          <v-spacer />

          <v-btn variant="text" @click="showEditDialog = false"> Zrušiť </v-btn>

          <v-btn color="primary" :loading="isSaving" :disabled="isSaving" @click="saveEditedTask">
            Uložiť zmeny
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title>Odstrániť úlohu?</v-card-title>

        <v-card-text>
          Naozaj chcete odstrániť túto úlohu?

          <span class="text-error"> Túto akciu nie je možné vrátiť späť. </span>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="showDeleteDialog = false"> Zrušiť </v-btn>

          <v-btn
            color="error"
            variant="flat"
            :loading="isDeleting"
            :disabled="isDeleting"
            @click="confirmDeleteTask"
          >
            Odstrániť
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showResetDialog" max-width="450">
      <v-card rounded="lg">
        <v-card-title class="text-h5 font-weight-bold"> Obnoviť úlohy? </v-card-title>

        <v-card-text>
          Naozaj chcete obnoviť úlohy na pôvodné ukážkové údaje?
          <span class="text-error font-weight-bold"> Všetky aktuálne úlohy budú odstránené. </span>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="showResetDialog = false"> Zrušiť </v-btn>

          <v-btn
            color="error"
            variant="flat"
            :loading="isResetting"
            :disabled="isResetting"
            @click="confirmResetTasks"
          >
            Obnoviť
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="showSuccess" :timeout="3000" color="success" location="top">
      {{ successMessage }}

      <template #actions>
        <v-btn variant="text" @click="showSuccess = false"> Zavrieť </v-btn>
      </template>
    </v-snackbar>
</template>

<style scoped></style>
