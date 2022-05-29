const title = document.getElementById('title');
const dueDate = document.getElementById('due-date');
const addTaskBtn = document.getElementById('add-task-btn');
const status = document.getElementById('status');
const baseUrl = "http://localhost:4000/";

const addTask = async (data) => {

    const response = await fetch(`${baseUrl}tasks`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
    await response.json();
    getTasks()
}

const updateTask = async (data) => {
    const { id } = data;
    const response = await fetch(`${baseUrl}tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({
            ...data,
            completed: !data.completed
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

const getTasks = async() => {

    const df = new DocumentFragment();
    const response = await fetch(`${baseUrl}tasks`, {
        method: "GET",
    })

    const data = await response.json();

    data.forEach(task => {
        df.append(fillTaskData(task))
    })
    document.querySelector('section').append(df);
}

const removeTask = async (id) => {
    const response = await fetch(`${baseUrl}tasks/${id}`, {
        method: "DELETE",
    })
}

const fillTaskData = (data) => {
    const clone = document.querySelector('#tasks-template').content.cloneNode(true);
    const completed = clone.querySelector('.complete');
    const btnDelete = clone.querySelector('.task-btn-delete');

    data.completed && (completed.checked = true);

    clone.querySelector('.task-title').innerHTML = data.title;
    clone.querySelector('.task-date').innerHTML = data.dueDate;
    
    btnDelete.addEventListener('click', () => {
        removeTask(data.id);
    })

    completed.addEventListener('click', () => {
        updateTask(data);
    });

    return clone;
}

addTaskBtn.addEventListener('click', () => {
    addTask({
        title: title.value,
        dueDate: dueDate.value,
        completed: status.checked,
    })
})

getTasks();