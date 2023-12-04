document.addEventListener("click", (event) => {
  const id = event.target.dataset.id;
  switch (event.target.dataset.type) {
    case "edit": {
      console.log(event.target.dataset.type);
      const liById = document.getElementById(id);
      const newName = prompt(
        "Введите новое название",
        liById.firstChild.textContent.trim()
      );
      if (newName && !newName !== "") {
        update(id, newName).then((response) => {
          if (response.ok) {
            liById.firstChild.textContent = newName.trim();
          }
        });
      }
      break;
    }
    case "remove": {
      remove(id).then(() => {
        event.target.closest("li").remove();
      });
      break;
    }
  }
});

async function remove(id) {
  await fetch(`/${id}`, { method: "DELETE" });
}
function update(id, newName) {
  return fetch("/", {
    method: "PUT",
    body: JSON.stringify({ id: id, newName: newName }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}
