import { ref, watch, computed } from 'vue';

import {
    getTasks,
    addTask,
    markDone,
    markUndone,
    updateTask,
    deleteTask,
    resetTasks
} from '../services/api.js';

// STATE

// Tasks
const tasks = ref([]);
const studentName = ref('');
const errorMessage = ref('');

// Task statuses
const taskStatuses = ref({});

// Form fields
const title = ref('');
const description = ref('');
const dateFrom = ref('');
const dateTo = ref('');
const editIsFinished = ref(false);

// Form references
const addForm = ref(null);
const editForm = ref(null);

// Dialogs
const showAddDialog = ref(false);
const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const showResetDialog = ref(false);

// Selected tasks
const editingTaskId = ref(null);
const deletingTaskId = ref(null);

// Loading indicators
const isLoading = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const isResetting = ref(false);

// Notifications
const showSuccess = ref(false);
const successMessage = ref('');


// LOCAL STORAGE
function getStatusKey(name) {
    return `taskStatuses_${name}`;
}

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


// TASK LOADING
// local storage
function loadSavedStatuses() {
    const savedStatuses = localStorage.getItem(
        getStatusKey(studentName.value.trim())
    );

    try {
        return savedStatuses ? JSON.parse(savedStatuses) : {};
    } catch (error) {
        console.error('Failed to parse saved task statuses:', error);
        return {};
    }
}

// task loading
async function loadTasks() {
    if (!studentName.value.trim()) {
        errorMessage.value = 'Student ID is required.';
        return;
    }

    errorMessage.value = '';
    isLoading.value = true;

    try {
        const response = await getTasks(studentName.value.trim());

        tasks.value = response.todos;
        taskStatuses.value = loadSavedStatuses();

    } catch (error) {
        errorMessage.value = 'Failed to load tasks.';
        console.error('Failed to load tasks:', error);
        throw error;

    } finally {
        isLoading.value = false;
    }
}


// TASK CREATION
async function createTask(task) {
    try {
        await addTask(studentName.value.trim(), task);

    } catch (error) {
        errorMessage.value = 'Failed to add task.';
        console.error('Failed to add task:', error);
        return false;
    }

    try {
        await loadTasks();
    } catch (error) {
        console.error(
            'Task was created, but the list could not be refreshed:',
            error
        );
    }

    return true;
}

async function saveTask() {
    const { valid } = await addForm.value.validate();

    if (!valid) return;

    isSaving.value = true;
    errorMessage.value = '';

    const task = {
        title: title.value.trim(),
        description: description.value.trim(),
        date_from: dateFrom.value,
        date_to: dateTo.value,
        is_finished: false
    };

    try {
        const success = await createTask(task);

        if (!success) return;

        notifySuccess('Task added successfully!');

        title.value = '';
        description.value = '';
        dateFrom.value = '';
        dateTo.value = '';

        showAddDialog.value = false;

    } finally {
        isSaving.value = false;
    }
}


// TASK COMPLETION
async function completeTask(taskId) {
    errorMessage.value = '';

    try {
        await markDone(studentName.value.trim(), taskId);

        notifySuccess('Task completed successfully!');

    } catch (error) {
        errorMessage.value = 'Failed to complete task.';
        console.error('Failed to complete task:', error);
        return;
    }

    try {
        await loadTasks();
    } catch (error) {
        console.error(
            'Task completed, but failed to refresh the list:',
            error
        );
    }
}

async function restoreTask(taskId, newStatus) {
    errorMessage.value = '';

    try {
        await markUndone(studentName.value.trim(), taskId);

        await loadTasks();

        taskStatuses.value[taskId] = newStatus;

        notifySuccess('Task restored successfully!');

    } catch (error) {
        errorMessage.value = 'Failed to restore task.';
        console.error('Failed to restore task:', error);
    }
}


// TASK EDITING
function formatDateForInput(date) {
    if (!date) return '';

    return date.replace(' ', 'T').slice(0, 16);
}

function openEditDialog(task) {
    editingTaskId.value = task.id;

    title.value = task.title;
    description.value = task.description || '';
    dateFrom.value = formatDateForInput(task.date_from);
    dateTo.value = formatDateForInput(task.date_to);
    editIsFinished.value = task.is_finished;

    showEditDialog.value = true;
}

async function saveEditedTask() {
    const { valid } = await editForm.value.validate();

    if (!valid) return;

    isSaving.value = true;
    errorMessage.value = '';

    const updatedTask = {
        title: title.value.trim(),
        description: description.value.trim(),
        date_from: dateFrom.value,
        date_to: dateTo.value,
        is_finished: editIsFinished.value
    };

    try {
        await updateTask(
            studentName.value.trim(),
            editingTaskId.value,
            updatedTask
        );

        showEditDialog.value = false;
        notifySuccess('Task updated successfully!');

        try {
            await loadTasks();
        } catch (error) {
            console.error(
                'Task updated, but failed to refresh the list:',
                error
            );
        }

    } catch (error) {
        errorMessage.value = 'Failed to update task.';
        console.error('Failed to update task:', error);

    } finally {
        isSaving.value = false;
    }
}

// TASK DELETION 
function openDeleteDialog(task) {
    deletingTaskId.value = task.id;
    showDeleteDialog.value = true;
}

async function confirmDeleteTask() {
    isDeleting.value = true;
    errorMessage.value = '';

    try {
        await deleteTask(
            studentName.value.trim(),
            deletingTaskId.value
        );

        showDeleteDialog.value = false;
        notifySuccess('Task deleted successfully!');

        try {
            await loadTasks();
        } catch (error) {
            console.error(
                'Task deleted, but failed to refresh the list:',
                error
            );
        }

    } catch (error) {
        errorMessage.value = 'Failed to delete task.';
        console.error('Failed to delete task:', error);

    } finally {
        isDeleting.value = false;
    }
}


// TASK RESET 
async function confirmResetTasks() {
    isResetting.value = true;
    errorMessage.value = '';

    try {
        await resetTasks(studentName.value.trim());

    } catch (error) {
        errorMessage.value = 'Failed to reset tasks.';
        console.error('Failed to reset tasks:', error);
        isResetting.value = false;
        return;
    }

    localStorage.removeItem(
        getStatusKey(studentName.value.trim())
    );

    taskStatuses.value = {};

    showResetDialog.value = false;
    notifySuccess('Tasks reset successfully!');

    try {
        await loadTasks();
    } catch (error) {
        console.error(
            'Tasks reset, but failed to refresh the list:',
            error
        );
    } finally {
        isResetting.value = false;
    }
}


// NOTIFICATIONS
function notifySuccess(message) {
    successMessage.value = message;
    showSuccess.value = true;
}


//VALIDATION
const titleRules = [
    (value) => !!value?.trim() || 'Title is required',
    (value) => (value?.length ?? 0) <= 200
        || 'Maximum 200 characters allowed'
];

const descriptionRules = [
    (value) => (value?.length ?? 0) <= 1000
        || 'Maximum 1000 characters allowed'
];

const dateFromRules = [
    (value) => !!value || 'Start date is required'
];

const dateToRules = [
    (value) => !!value || 'End date is required',
    (value) => {
        if (!value || !dateFrom.value) return true;

        return new Date(value) > new Date(dateFrom.value)
            || 'End date must be after start date';
    }
];


// COMPUTED TASK LISTS
const todoTasks = computed(() => {
    return tasks.value.filter(
        (task) =>
            !task.is_finished &&
            (taskStatuses.value[task.id] || 'todo') === 'todo'
    );
});

const inProgressTasks = computed(() => {
    return tasks.value.filter(
        (task) =>
            !task.is_finished &&
            taskStatuses.value[task.id] === 'in_progress'
    );
});

const finishedTasks = computed(() => {
    return tasks.value.filter((task) => task.is_finished);
});


// RETURN 
export function useTasks() {
    return {
        // State
        tasks,
        studentName,
        errorMessage,
        taskStatuses,

        // Form fields
        title,
        description,
        dateFrom,
        dateTo,
        editIsFinished,
        addForm,
        editForm,

        // Dialogs
        showAddDialog,
        showEditDialog,
        showDeleteDialog,
        showResetDialog,

        // Selected tasks
        editingTaskId,
        deletingTaskId,

        // Loading
        isLoading,
        isSaving,
        isDeleting,
        isResetting,

        // Notifications
        showSuccess,
        successMessage,

        // Validation
        titleRules,
        descriptionRules,
        dateFromRules,
        dateToRules,

        // Computed
        todoTasks,
        inProgressTasks,
        finishedTasks,

        // Functions
        loadTasks,
        createTask,
        saveTask,
        changeTaskStatus,
        completeTask,
        restoreTask,
        openEditDialog,
        saveEditedTask,
        openDeleteDialog,
        confirmDeleteTask,
        confirmResetTasks,
        notifySuccess
    };
}
