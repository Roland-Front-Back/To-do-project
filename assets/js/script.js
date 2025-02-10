const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const addTaskFormButton = document.getElementById("add-task");
const closeTaskFormButton = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelButton = document.getElementById("cancel-btn");
const discardButton = document.getElementById("discard-btn");
const taskContainer = document.getElementById("task-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const noteInput = document.getElementById("note-input");

const taskData = JSON.parse(localStorage.getItem("data")) || []; // set taskData to retreive the data from localStorage or an empty array
let currentTask = {};

// Remove special characters to prevent unecessary title chars using regular expression (regex)
const removeSpecialChars = (val) => {
    return val.replace(/[^A-Za-z0-9\-\s]/g, '');
};

// Enhancing code readability and maintability 
const addOrUpdateTask = () => {

    // Add an alert when user input a whitespaces as a title in the input title and prevents it to add the task
    if (!titleInput.value.trim()) {
        alert("Please enter a title");
        return;
    }

// Determine if the task being added is alraeady exist or not in the taskData array
// If not it will be added and if its alreadu exist it will be update
const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);

const taskObj = {
    id: `${removeSpecialChars(titleInput.value).toLowerCase().split(" ").join("-")}-${Date.now()}`, //Making the input more unique inside of the array for more user - friendly and avoid duplication
    title: removeSpecialChars(titleInput.value),
    date: removeSpecialChars(dateInput.value),
    note: removeSpecialChars(noteInput.value),
};

// Add the taskObj input values to the taskData array and add each value  input as beginning of the array 
// If the value alraedy exist it will set it up for editing
    if (dataArrIndex === -1) {
        taskData.unshift(taskObj);
    } else {
        taskData[dataArrIndex] = taskObj; // else the edited function will executed and save the edited task to taskObj 
    }

    // Save the task in the localStorage when the user adds, updates, or remove a task
    // Using setItem()
    // And convert the taskData into a string using the JSON.stringify()
    localStorage.setItem("data", JSON.stringify(taskData));

    updateTaskContainer();
    reset();
};

// Enancong code readability and maintability
const updateTaskContainer = () => {

    // Clears the taskContainer innerTML to avoid duplicating the task
    taskContainer.innerHTML = "";


    // Display the saved task in the taskData array using forEach loop
    taskData.forEach(({id,title,date}) => {
        taskContainer.innerHTML += `
        <div class="task" id="${id}">
        <p><strong>Title: </strong>${title}</p>
        <p><strong>Date: </strong>${date}</p>
        <button type="button" class="task-btn" onclick="editTask(this)"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg></button>
        <button type="button" class="task-btn" onclick="deleteTask(this)"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#d00000"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg></button>
        </div>
        `;
    });
};

// Delete task function
const deleteTask = (_buttonEl) => {

    // Finds the index of the task to delete
    const dataArrIndex = taskData.findIndex((item) => item.id === _buttonEl.parentElement.id);

    // removing task from DOM using remove() and from the taskData array using splice
    _buttonEl.parentElement.remove();
    taskData.splice(dataArrIndex, 1);

    // Save taskData to localStorage again since we use the splice() to remove deleted task from the taskData
    localStorage.setItem("data", JSON.stringify(taskData));
};

// Edit task function 
const editTask = (_buttonEl) => {

    // Finds the index of the task to edit
    const dataArrIndex = taskData.findIndex((item) => item.id === _buttonEl.parentElement.id);

    // using square bracket notation to retrieve the task to be edited from the taskData arr
    currentTask = taskData[dataArrIndex];

    // Staging the task from the currentTask and its value for editing
    titleInput.value = currentTask.title;
    dateInput.value = currentTask.date;
    noteInput.value = currentTask.note;

    // Setting the innerText of the addOrUpdateTaskBtn to update task when user finish editing
    addOrUpdateTaskBtn.innerText = "Update Task";

    // Display the form modal with the values of the edited input fields 
    taskForm.classList.toggle("hidden"); 
};

// Clears the input fields after user add a task also to avoid saving the previous task in the input fields
function reset() {

    // Assign the innerText to "Add Task" insted of the "Update Task" when user edit a task in the task form
    addOrUpdateTaskBtn.innerText = "Add Task";

    titleInput.value = "";
    dateInput.value = "";
    noteInput.value = "";
    taskForm.classList.toggle("hidden");
    currentTask = {};
}

// Checks if the array length of the taskData is greater than 0 and runs the updateTaskContainer() to display the retrueve items in the Ui
if (taskData.length) {
    updateTaskContainer();
}

// Toggling the task form to display when clicked
addTaskFormButton.addEventListener("click", () => {
    taskForm.classList.toggle("hidden");
});

// Calling the cancel and discard message when close(x) btn is clicke in the task form
closeTaskFormButton.addEventListener("click", () => {
    // Display the Cancel and Discard button to the user if there is some text present in the input fields
    const formInputsContainValues = titleInput.value || dateInput.value || noteInput.value;

    // When user try to close the editing and doesn't make any changes the dialog message should not display modal (cancel or discard)
    const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || noteInput.value !== currentTask.note;

    // check if formInputsContainValues is true and then execute the showModal, and else no changes call to reset() to clear the input fields 
    if (formInputsContainValues && formInputValuesUpdated) { // Adds the formInputValuesUpdated as the second condition suing AND to not display the modal when the user doesn't make any changes
    confirmCloseDialog.showModal();
    } else {
        reset();
    }

});

// close the dialog message when cancel btn is clicked
cancelButton.addEventListener("click", () => {
    confirmCloseDialog.close();
});

// removing both the dialog message and the task form when discard btn is clicked
discardButton.addEventListener("click", () => {
    confirmCloseDialog.close();
    reset();
});

// saving input from the form and preventing browser to refresh when user input a form
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Close the form when the user click the add task btn
    addOrUpdateTask();    
});

