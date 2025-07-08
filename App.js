// let todo = [];
// let req = prompt("please enter your request");


// while(true) {
//     if(req == "quit") {
//         console.log("quitting app");
//         break;
//     }
//     if(req == "list") {
//         console.log("________________");
//         for( let i = 0;i<todo.length;i++) {
//             console.log(i, todo[i]);
//         }
//         console.log("________________");
//     }else if ( req == "add"){
//         let task = prompt("please enter the task you want to add");
//         todo.push(task);
//         console.log("task added");
//     }else if (req == "delete") {
//         let idx = prompt("please enter the task index");
//         todo.splice(idx,1);
//         console.log("task deleted")
//     }else {
//         console.log("wrong request");
//     }
//     req = prompt("please enter your request");
// }


(() => {
  // —— DOM Elements ——
  const todoInput = document.getElementById('todo-input');
  const addBtn = document.getElementById('add-btn');
  const todoList = document.getElementById('todo-list');

  // —— Local‑Storage Helpers ——
  const STORAGE_KEY = 'todo-items';
  const loadTodos = () => {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    // Migrate old format (array of strings) to new format (objects)
    return raw.map((item) => {
      if (typeof item === 'string') return { text: item, done: false };
      return item;
    });
  };
  const saveTodos = (items) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

  // —— Application State ——
  let todos = loadTodos();

  // —— Helper: create element quickly ——
  const h = (tag, className = '', content = '') => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content) el.textContent = content;
    return el;
  };

  // —— Render Function ——
  const render = () => {
    todoList.innerHTML = '';

    if (!todos.length) {
      const empty = h('p', 'todo-empty', '✨ No tasks yet — add your first!');
      empty.style.opacity = '0.6';
      empty.style.textAlign = 'center';
      empty.style.fontSize = '0.95rem';
      todoList.appendChild(empty);
      return;
    }

    todos.forEach((task, idx) => {
      const item = h('div', 'todo-item fade-in');
      item.dataset.index = idx;

      // Checkbox
      const checkbox = h('input', 'todo-checkbox');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      checkbox.title = 'Mark complete';

      // Task text
      const text = h('span', 'todo-text', task.text);
      if (task.done) {
        text.style.textDecoration = 'line-through';
        text.style.opacity = '0.55';
      }

      // Delete button
      const delBtn = h('button', 'delete-btn');
      delBtn.innerHTML = '&times;';
      delBtn.title = 'Delete task';

      // —— Event listeners ——
      checkbox.addEventListener('change', () => {
        task.done = checkbox.checked;
        saveTodos(todos);
        render();
      });

      delBtn.addEventListener('click', () => {
        todos.splice(idx, 1);
        saveTodos(todos);
        render();
      });

      // —— Compose item ——
      item.appendChild(checkbox);
      item.appendChild(text);
      item.appendChild(delBtn);
      todoList.appendChild(item);
    });
  };

  // —— Add Task ——
  const addTask = () => {
    const value = todoInput.value.trim();
    if (!value) return;
    todos.push({ text: value, done: false });
    saveTodos(todos);
    todoInput.value = '';
    render();
  };

  // —— Event Listeners ——
  addBtn.addEventListener('click', addTask);
  todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
  });

  // —— Initial Render ——
  render();
})();

