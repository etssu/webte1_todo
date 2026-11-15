<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  tasks: {
    type: Array,
    required: true,
  },
  taskStatuses: {
    type: Object,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },

  fullWidth: {
    type: Boolean,
    default: false
  },
  sortBy: {
    type: String,
    required: true,
  },
});

defineEmits(['change-status', 'complete', 'restore', 'edit', 'delete']);

const sortedTasks = computed(() => {
  return [...props.tasks].sort((a, b) =>
    new Date(a[props.sortBy]) - new Date(b[props.sortBy])
  );
});

function isOverdue(task) {
    return !task.is_finished && new Date(task.date_to) < new Date();
}

const formatDate = (date) => {
    if (!date) return '';

    return new Date(date).toLocaleString('sk-SK', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
</script>

<template>
  <v-col cols="12" :md="fullWidth ? 12 : 4">
    <v-card :color="color" rounded="lg" elevation="2">
      <v-card-title class="text-h6 font-weight-bold">
        {{ title }}
      </v-card-title>

      <v-card-subtitle>
        {{ subtitle }}
      </v-card-subtitle>

      <v-card-text>
        <div class="text-h4 font-weight-bold">
          {{ tasks.length }} úloh
        </div>

        <v-card
          v-for="task in sortedTasks"
          :key="task.id"
          class="mb-3"
          rounded="lg"
          color="white"
        >
          <v-card-title class="text-subtitle-1 font-weight-bold">
            {{ task.title }}
          </v-card-title>

          <v-card-text>
              <p class="mb-3 text-medium-emphasis">{{ task.description }}</p>

              <div class="mb-1 text-medium-emphasis">
                  <v-icon size="small" class="mr-1">mdi-calendar-start</v-icon>
                  Začiatok: {{ formatDate(task.date_from) }}
              </div>

              <div :class="{ 'text-error': isOverdue(task) }">
                  <v-icon size="small" class="mr-1">mdi-calendar-clock</v-icon>
                  Deadline: {{ formatDate(task.date_to) }}
              </div>
          </v-card-text>

          <v-card-actions>
            <v-menu>
              <template #activator="{ props }">
                <v-chip
                  v-bind="props"
                  color="secondary"
                  variant="tonal"
                  size="small"
                  append-icon="mdi-chevron-down"
                >
                  {{
                    task.is_finished
                      ? 'Dokončené'
                      : (taskStatuses[task.id] || 'todo') === 'in_progress'
                        ? 'Rozpracované'
                        : 'Na spracovanie'
                  }}
                </v-chip>
              </template>

              <v-list density="compact">
                <template v-if="task.is_finished">
                  <v-list-item
                    title="Na spracovanie"
                    @click="$emit('restore', task.id, 'todo')"
                  />

                  <v-list-item
                    title="Rozpracované"
                    @click="$emit('restore', task.id, 'in_progress')"
                  />
                </template>

                <template v-else>
                  <v-list-item
                    v-if="(taskStatuses[task.id] || 'todo') !== 'todo'"
                    title="Na spracovanie"
                    @click="$emit('change-status', task.id, 'todo')"
                  />

                  <v-list-item
                    v-if="(taskStatuses[task.id] || 'todo') !== 'in_progress'"
                    title="Rozpracované"
                    @click="$emit('change-status', task.id, 'in_progress')"
                  />

                  <v-list-item
                    title="Dokončené"
                    @click="$emit('complete', task.id)"
                  />
                </template>
              </v-list>
            </v-menu>

            <v-spacer />

            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              @click="$emit('edit', task)"
            />

            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="$emit('delete', task)"
            />
          </v-card-actions>
        </v-card>

        <div
            v-if="tasks.length === 0"
            class="text-center text-medium-emphasis py-4"
        >
            Zatiaľ žiadne úlohy
        </div>
      </v-card-text>
    </v-card>
  </v-col>
</template>
