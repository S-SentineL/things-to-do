let listnum = 1;

function add() {
    listnum++;
    
    const tasks = document.getElementsByClassName('tasks')[0];

    const newGap = document.createElement('div');
    newGap.id = 'gap';
    newGap.style.display = 'block';

    const newTaskItem = document.createElement('div');
    newTaskItem.className = 'task-item';

    const originalTask = document.getElementById('task-1');
    const originalCheckbox = document.getElementById('check-1');

    const newCheckbox = originalCheckbox.cloneNode(true);
    newCheckbox.id = `check-${listnum}`;
    newCheckbox.checked = false;

    const newTaskInput = originalTask.cloneNode(true);
    newTaskInput.id = `task-${listnum}`;
    newTaskInput.value = "";
    newTaskInput.classList.remove('strike-through');

    newCheckbox.addEventListener('click', function() {
        if (newCheckbox.checked) {
            newTaskInput.classList.add('strike-through');
        } else {
            newTaskInput.classList.remove('strike-through');
        }
    });

    newTaskItem.appendChild(newCheckbox);
    newTaskItem.appendChild(newTaskInput);

    if (tasks) {
        tasks.appendChild(newGap);
        tasks.appendChild(newTaskItem);
    }
    newTaskInput.focus();
}

function sub() {
    const gaps = document.querySelectorAll('#gap');
    if (gaps.length > 0) {
        gaps[gaps.length - 1].remove();
    }

    if (listnum > 1) {
        const lastTask = document.getElementById(`task-${listnum}`);
        if (lastTask) {
            lastTask.parentElement.remove();
            listnum--;
        }
    } else if (listnum === 1) {
        const firstTaskInput = document.getElementById('task-1');
        const firstCheckbox = document.getElementById('check-1');
        
        if (firstTaskInput) {
            firstTaskInput.value = ''; 
            firstTaskInput.classList.remove('strike-through');
        }
        if (firstCheckbox) {
            firstCheckbox.checked = false;
        }
    }
}

function save(event) {
    event.preventDefault();

    const tasks = document.querySelectorAll('.new-task');
    const taskArray = [];

    tasks.forEach((task, index) => {
        const checkbox = document.getElementById(`check-${index + 1}`);

        if (task && checkbox) {
            taskArray.push({
                id: `task-${index + 1}`,          
                task: task.value,                 
                checked: checkbox.checked        
            });
        }
    });

    const jsonData = {
        username: document.getElementById('username-placeholder').textContent,
        tasks: taskArray,
    };

    const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'to-do-list.json';
    a.click();
}

function upload() {
    const fileInput = document.getElementById('upload-file');
    fileInput.click();
}

function handleFile(event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
        const reader = new FileReader();

        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);

                const listing = document.querySelector('.tasks');
                listing.innerHTML = '';

                document.getElementById('username-placeholder').textContent = data.username;

                data.tasks.forEach((task, index) => {
                    if (index === 0) {
                        const firstTaskInput = document.getElementById('task-1');
                        const firstCheckbox = document.getElementById('check-1');
                        if (firstTaskInput && firstCheckbox) {
                            firstTaskInput.value = task.task;
                            firstCheckbox.checked = task.checked;
                        }
                    } else {
                        add();
                        const taskInput = document.getElementById(`task-${index + 1}`);
                        const checkbox = document.getElementById(`check-${index + 1}`);
                        if (taskInput && checkbox) {
                            taskInput.value = task.task;
                            checkbox.checked = task.checked;
                        } else {
                            console.error(`Task element with id 'task-${index + 1}' or checkbox with id 'check-${index + 1}' not found.`);
                        }
                    }
                });
            } catch (err) {
                console.error('Error parsing JSON:', err);
            }
        };

        reader.readAsText(file);
    } else {
        console.error('Invalid file type. Please upload a JSON file.');
    }
}

document.getElementById('save-btn').addEventListener('click', save);

document.getElementById('add-img').addEventListener('click', add);

document.addEventListener('keydown', event => {
    const key = event.key;

    if (key === 'Enter') { 
        add();
    } else if (key === '`') {
        sub();
    }
});

document.getElementById('check-1').addEventListener('click', function() {
    const firstTaskInput = document.getElementById('task-1');
    if (this.checked) {
        firstTaskInput.classList.add('strike-through');
    } else {
        firstTaskInput.classList.remove('strike-through');
    }
});

document.getElementById('upload-btn').addEventListener('click', upload);

document.getElementById('upload-file').addEventListener('change', handleFile);

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('task-1').focus();
});
