const formEl = document.querySelector(`form`);
const addInput = document.getElementById(`addInput`);
const todoList = document.getElementById(`todoList`);
const loader = document.getElementById(`loader`);
const key = `675771ac60a208ee1fddc9b8`;

getAllToDos();

formEl.addEventListener(`submit`, (e) => {
  e.preventDefault();
  addInput.value.trim() !== `` ? addTodos() : toastr.warning(`To-Do is empty..`)
})

async function addTodos() {
  const toDoInfo = {
    title: addInput.value,
    apiKey: key,
  }
  const option = {
    method: "POST",
    body: JSON.stringify(toDoInfo),
    headers: {
      "content-type": "application/json",
    },
  };
  loader.classList.remove(`d-none`);
  fetch('https://todos.routemisr.com/api/v1/todos', option)
    .then(respone => respone.json())
    .then(() => {
      loader.classList.add(`d-none`);
      toastr.success(`To-Do Has Been Added!!`)
      getAllToDos();
      formEl.reset()
    }).catch(error => {
      console.log(error);
    })
}

async function getAllToDos() {
  loader.classList.remove(`d-none`);
  fetch(`https://todos.routemisr.com/api/v1/todos/${key}`)
    .then(response => response.json())
    .then(api => {
      loader.classList.add(`d-none`);
      if (api.message === `success`) {
        let allTodo = api.todos;
        displayData(allTodo);
      }
    }).catch(error => {
      console.log(error);
    })
}

function displayData(todos) {
  let wrapper = ``;

  for (const todo of todos) {
    wrapper += `
      <li class="d-flex align-items-center justify-content-between p-3">
        <span onclick = "markCompleted('${todo._id}') " style=" ${todo.completed ? `text-decoration:line-through;` : ""}" class="task-name">${todo.title}</span>
        <div class="d-flex align-items-center gap-4">
          ${todo.completed ? `<span><i class="fa-regular fa-circle-check" style="color: #63E6BE;"></i></span>` : "" }
          <span onclick="deleteToDo('${todo._id}')" class="icon"><i class="fa-solid fa-trash"></i></span>
        </div>
      </li>
      `
  }
  todoList.innerHTML = wrapper;
  changeProgress(todos);
}

async function deleteToDo(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      const todoId = {
        todoId: id,
      }
      const option = {
        method: "DELETE",
        body: JSON.stringify(todoId),
        headers: {
          "content-type": "application/json",
        },
      };
      loader.classList.remove(`d-none`);
      fetch(`https://todos.routemisr.com/api/v1/todos`, option)
        .then(response => response.json())
        .then(api => {
          loader.classList.add(`d-none`);
          if (api.message === `success`) {
            toastr.error(`To-do has been deleted!`)
            getAllToDos()
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
          }
        }).catch(error => {
          console.log(error);
        })
    }
  });


}

async function markCompleted(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, complete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      const todoId = {
        todoId: id,
      }
      const option = {
        method: "PUT",
        body: JSON.stringify(todoId),
        headers: {
          "content-type": "application/json",
        },
      };
      loader.classList.remove(`d-none`);
      fetch(`https://todos.routemisr.com/api/v1/todos`, option)
        .then(response => response.json())
        .then(api => {
          loader.classList.add(`d-none`);
          if (api.message === `success`) {
            Swal.fire({
              title: "Completed 🥳!",
              icon: "success"
            });
            getAllToDos()
            toastr.success(`To-do is completed 👏`, {
              timeOut: 5000
            })
          }
        }).catch(error => {
          console.log(error);
        })
    }
  });


}


function changeProgress(tasks) {
  const completed = tasks.filter((task) => task.completed).length;
  const totalTask = tasks.length;

  document.getElementById(`progress`).style.width = `${(completed / totalTask) * 100}% `

  const statusNum = document.querySelectorAll(`.status-number span`);

  statusNum[0].innerHTML = completed;
  statusNum[1].innerHTML = totalTask;
}