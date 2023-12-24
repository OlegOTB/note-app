document.addEventListener("click", (event) => {
  const id = event.target.dataset.id;
  const liById = document.getElementById(id);
  function toggleEdit() {
    liById.children[0].style.border =
      liById.children[0].style.border === "none" ? "solid" : "none";
    liById.children[3].style.display =
      liById.children[3].style.display === "none" ? "block" : "none";
    liById.children[2].style.display =
      liById.children[2].style.display === "block" ? "none" : "block";
  }

  switch (event.target.dataset.type) {
    case "edit": {
      liById.children[1].value = liById.children[0].value;
      liById.children[0].disabled = false;
      toggleEdit();
      break;
    }
    case "save": {
      const newName = liById.children[0].value.trim();
      if (newName && !newName !== "") {
        update(id, newName)
          .then((response) => {
            if (response.ok) {
              liById.children[0].value = newName.trim();
            }
          })
          .catch(() => (liById.children[0].value = liById.children[1].value));
      }
      toggleEdit();
      break;
    }
    case "cancel": {
      liById.children[0].value = liById.children[1].value;
      toggleEdit();
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
