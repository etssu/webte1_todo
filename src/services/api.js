const API_URL = "https://wt1zadanie.iolab.sk/api/";


// build URL for a specific student
function getUrl(name) {
    return API_URL + encodeURIComponent(name);
}

// handle API response
async function handleResponse(response) {
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    return await response.json();
}

// GET - get all tasks
export async function getTasks(name) {
    const response = await fetch(getUrl(name));
    return await handleResponse(response);
}

// POST - add a new task
export async function addTask(name, task) {
    const response = await fetch(getUrl(name), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    return await handleResponse(response);
}

// POST - Reset tasks to initial sample data
export async function resetTasks(name) {
    const response = await fetch(`${getUrl(name)}/reset`, {
        method: "POST"
    });

    return await handleResponse(response);
}

// GET - get todo
export async function getTask(name, todo_id){
    const response = await fetch(`${getUrl(name)}/${todo_id}`);
    return await handleResponse(response);
}

// PUT - update todo
export async function updateTask(name, todo_id, task) {
    const response = await fetch(`${getUrl(name)}/${todo_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    return await handleResponse(response);
}

// DELETE - Delete a task
export async function deleteTask(name, todo_id) {
    const response = await fetch(`${getUrl(name)}/${todo_id}`, {
        method: "DELETE"
    });

    return await handleResponse(response);
}

// PATCH - mark done
export async function markDone(name, todo_id){
    const response = await fetch(`${getUrl(name)}/${todo_id}/done`, {
        method: "PATCH"
    });

    return await handleResponse(response);
}

// PATCH - mark undone
export async function markUndode(name, todo_id) {
    const response = await fetch(`${getUrl(name)}/${todo_id}/undone`, {
        method: "PATCH"
    });

    return await handleResponse(response);
}