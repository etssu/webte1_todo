const API_URL = "https://wt1zadanie.iolab.sk/api/";

export async function getTasks(name) {
    try {
        const url = API_URL + encodeURIComponent(name);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch tasks");
        }

        return await response.json();

    } catch (error) {
        console.error(error);
        throw error;
    }
}