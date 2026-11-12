
<script setup>
defineProps({
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
});

defineEmits(['change-status', 'complete', 'restore', 'edit', 'delete']);
</script>

<template>
  <v-col cols="12" md="4">
    <v-card :color="color" rounded="lg" elevation="2">
      <v-card-title class="text-h6 font-weight-bold">
        {{ title }}
      </v-card-title>

      <v-card-subtitle>
        {{ subtitle }}
      </v-card-subtitle>

      <v-card-text>
        <div class="text-h4 font-weight-bold">
          {{ tasks.length }}
        </div>
        <div class="text-caption">Tasks</div>

        <v-card
          v-for="task in tasks"
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
                      ? 'Done'
                      : (taskStatuses[task.id] || 'todo') === 'in_progress'
                        ? 'In Progress'
                        : 'To Do'
                  }}
                </v-chip>
              </template>

              <v-list density="compact">
                <template v-if="task.is_finished">
                  <v-list-item
                    title="To Do"
                    @click="$emit('restore', task.id, 'todo')"
                  />

                  <v-list-item
                    title="In Progress"
                    @click="$emit('restore', task.id, 'in_progress')"
                  />
                </template>

                <template v-else>
                  <v-list-item
                    v-if="(taskStatuses[task.id] || 'todo') !== 'todo'"
                    title="To Do"
                    @click="$emit('change-status', task.id, 'todo')"
                  />

                  <v-list-item
                    v-if="(taskStatuses[task.id] || 'todo') !== 'in_progress'"
                    title="In Progress"
                    @click="$emit('change-status', task.id, 'in_progress')"
                  />

                  <v-list-item
                    title="Done"
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
          No tasks yet
        </div>
      </v-card-text>
    </v-card>
  </v-col>
</template>
