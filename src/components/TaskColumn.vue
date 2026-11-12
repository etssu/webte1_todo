<script setup>
import TaskCard from './TaskCard.vue';

defineProps({
    title: {
        type: String,
        required: true
    },
    tasks: {
        type: Array,
        required: true
    }
});

defineEmits([
    'edit',
    'delete',
    'complete',
    'restore',
    'change-status'
]);
</script>

<template>
    <v-card class="task-column" elevation="2">
        <v-card-title class="d-flex align-center justify-space-between">
            <span>{{ title }}</span>
            <v-chip size="small">
                {{ tasks.length }}
            </v-chip>
        </v-card-title>

        <v-divider />

        <v-card-text>
            <div v-if="tasks.length === 0" class="text-center text-medium-emphasis py-6">
                No tasks yet
            </div>

            <div v-else class="d-flex flex-column ga-3">
                <TaskCard
                    v-for="task in tasks"
                    :key="task.id"
                    :task="task"
                    @edit="$emit('edit', task)"
                    @delete="$emit('delete', task)"
                    @complete="$emit('complete', task.id)"
                    @restore="$emit('restore', task.id, $event)"
                    @change-status="$emit('change-status', task.id, $event)"
                />
            </div>
        </v-card-text>
    </v-card>
</template>
