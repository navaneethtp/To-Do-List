
document.addEventListener('DOMContentLoaded', () => {
  const taskinput = document.getElementById ('task-input');
  const addTaskBtn = document.getElementById ('add-task-btn');
  const taskList = document.getElementById ('task-list');
  const emptyImage = document.querySelector ('.empty-image');
  const todosContainer = document.querySelector('.todos-container');
  const progressBar = document.getElementById('progress');
  const progressNumber = document.getElementById('numbers'); 

  const toggleEmptyState = () => {
    emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
    todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
  };
  

const updateProgress = (checkCompletion = true) => { const totalTasks = taskList.children.length;
    const completedTasks = taskList.querySelectorAll('.completed').length;

    progressBar.style.width = totalTasks > 0 ? `${(completedTasks / totalTasks) * 100}%` : '0%';
    progressNumber.textContent = `${completedTasks} / ${totalTasks}`;

    if (checkCompletion && totalTasks > 0 && completedTasks === totalTasks){
        Confetti();
    }
};

const saveTasksToLocalStorage = () => {
    const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
        text: li.querySelector('span').textContent,
        completed: li.querySelector('.checkbox').checked
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const loadTasksFromLocalStorage = () => {
    const saveTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    saveTasks.forEach( ({text, completed }) => addTask(text, completed, false));
    toggleEmptyState();
    updateProgress();
};

const addTask = (text,completed = false, checkCompletion = true) => {
    const taskText = text || taskinput.value.trim();
    if(!taskText) {
        return;
    }

    const li = document.createElement('li'); 
    li.innerHTML = `
     <input type="checkbox" class="checkbox"
     ${completed ? 'checked' : ''}/>
     <span>${taskText}</span>
     <div class="task-buttons">
     <button class="edit-btn"><i
    class="fa-solid fa-pen"></i></button>
    <button class="delete-btn"><i
    class="fa-solid fa-trash"></i></button>
     </div>
     
    `;

    const checkbox = li.querySelector('.checkbox');
    const editBtn = li.querySelector('.edit-btn');

    if (completed) {
        li.classList.add('completed');
        editBtn.disabled = true;
        editBtn.style.opacity = '0.5';
        editBtn.style.pointerEvents = 'none';
    }

    checkbox.addEventListener('change', () => {
        const ischecked = checkbox.checked;
        li.classList.toggle('completed', ischecked); 
        editBtn.disabled = ischecked;
        editBtn.style.opacity = ischecked ? '0.5' : '1';
        editBtn.style.pointerEvents = ischecked ? 'none' : 'auto';
        updateProgress();
        saveTasksToLocalStorage(); 

    });
    editBtn.addEventListener('click', () => {
        if (!checkbox.checked) {
            taskinput.value = li.querySelector('span').textContent;
            li.remove();
            toggleEmptyState();
            updateProgress(false);
            saveTasksToLocalStorage();
        }
    });


   li.querySelector('.delete-btn').addEventListener('click', () => {
        li.remove();
        toggleEmptyState();
        updateProgress();
        saveTasksToLocalStorage();
    });
    
    taskList.appendChild(li);
    taskinput.value = '';
    toggleEmptyState();
    updateProgress(checkCompletion);
    saveTasksToLocalStorage();
};
 
   addTaskBtn.addEventListener('click',(e) => {e.preventDefault();
    addTask();
   });
    taskinput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    loadTasksFromLocalStorage();
});

const Confetti = () => {
confetti({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
});
};   