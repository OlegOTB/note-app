let test;
let testOld;
let changes;
const ulHome = `<ul class="list-group">`;
const ulEnd = `</ul>`;
const liEnd = `</li>`;

const idTest = document.querySelector("idtest").innerText;

function liHtml(num, title, chsk) {
  return `
<input
  type="text"
  disabled
  value="${num}"
  style="${
    num != -1 ? "" : "display: none;"
  } border: none; background-color: white; color: black;  width: 3%; min-width: 25px"
/>
<input
  type="text"
  value=""
  style="display: none"
/>
  <input
    type="text"
    disabled
    value="${title}${chsk != undefined ? "" : num != -1 ? " ?" : ""}"
    style="border: none; background-color: white; color: black; width: 70%"
  />
  <input
    type="text"
    value=""
    style="display: none"
  />
<div class="visibleEdit">
  <div style="display: none">
    <input class="form-check-input" type="checkbox" data-type="checkbox" ${
      chsk === 1 ? "checked" : ""
    } style="${chsk != undefined ? "" : "display: none;"} margin-right: 20px"/>
    <input type="text" value="" style="display: none"/>
    <button
      class="btn btn-primary"
      data-type="save"
    >
      Сохранить
    </button>
    <button
      class="btn btn-danger"
      data-type="cancel"
    >
      Отменить
    </button>
  </div>
  <div style="display: block">
  <p class="fs-4" style="display: inline-block; width: 20px; margin: 0; padding: 0;">${
    chsk === 1 ? "&radic;" : ""
  }</p>
    <button
      class="btn btn-primary"
      data-type="edit"
    >
      Обновить
    </button>
    <button
      class="btn btn-danger"
      data-type="remove"
    >
      &times;
    </button>
  </div>
</div>`;
}

function liHome(idQuastion, idAnswer, testAnsQuast) {
  return `<li class="list-group-item" data-idquastion="${idQuastion}" data-idanswer="${idAnswer}" data-testansquast="${testAnsQuast}">`;
}

function addButton(idQuastion, idAnswer, testAnsQuast) {
  const strTestAnsQuast = testAnsQuast === "quastion" ? "вопрос" : "ответ";
  const strHeadTestAnsQuast =
    testAnsQuast === "quastion" ? "Вопросы:" : "Ответы:";
  return `<p class="text-center fs-5 mb-3">${strHeadTestAnsQuast}</p> <button class="btn btn-primary" data-type="${
    "add" + testAnsQuast
  }" data-idquastion="${idQuastion}" data-idanswer="${idAnswer}" data-testansquast="${testAnsQuast}" style="margin: auto" >${
    "Добавить " + strTestAnsQuast
  }</button>`;
}

window.onload = async function () {
  let response = await fetch(`/test/edit/${idTest}`);
  if (response.ok) {
    test = await response.json();
    test.quastionsList.forEach((el) => {
      el.answer.sort((a, b) => a.num - b.num);
    });
    test.quastionsList.sort((a, b) => a.num - b.num);
    testOld = await JSON.parse(JSON.stringify(test));
    // console.log(test);
    // console.log(testOld);
    viewQuastionAnswer();
  }
};

function viewQuastionAnswer() {
  document.querySelector("#vertest").textContent = "Тест ver." + test.version;
  document.querySelector("#headtest").innerHTML =
    ulHome +
    liHome(0, 0, "test") +
    liHtml(-1, test.title) +
    addButton(0, 0, "quastion") +
    liEnd +
    ulEnd;
  const quastionsDiv = document.querySelector("#quastionsdiv");

  let buff = ulHome;
  test.quastionsList.forEach((el) => {
    const idQuastion = el._id;
    buff =
      buff +
      liHome(idQuastion, 0, "quastion") +
      liHtml(el.num, el.title) +
      addButton(idQuastion, 0, "answer");
    buff = buff + ulHome;
    el.answer.forEach((el) => {
      buff =
        buff +
        liHome(idQuastion, el._id, "answer") +
        liHtml(el.num, el.title, el.chesk) +
        liEnd;
    });
    buff = buff + ulEnd + liEnd;
  });
  buff = buff + ulEnd;
  quastionsDiv.innerHTML = buff;
}

document.addEventListener("click", (event) => {
  const type = event.target.dataset.type;
  if (!type) return;
  const liParent = event.target.parentNode.parentNode.parentNode;
  const testAnsQuast = liParent.dataset.testansquast;
  const idTest = test._id;
  const idQuastion = liParent.dataset.idquastion;
  const idAnswer = liParent.dataset.idanswer;

  function toggleEdit() {
    liParent.children[0].style.border =
      liParent.children[0].style.border === "none" ? "solid" : "none";
    liParent.children[2].style.border =
      liParent.children[2].style.border === "none" ? "solid" : "none";

    liParent.children[4].children[0].style.display =
      liParent.children[4].children[0].style.display === "none"
        ? "block"
        : "none";
    liParent.children[4].children[1].style.display =
      liParent.children[4].children[1].style.display === "block"
        ? "none"
        : "block";
  }

  switch (type) {
    case "edit": {
      liParent.children[1].value = liParent.children[0].value;
      liParent.children[0].disabled = false;
      liParent.children[3].value = liParent.children[2].value;
      liParent.children[2].disabled = false;
      liParent.children[4].children[0].children[1].value = Number(
        liParent.children[4].children[0].children[0].checked
      );

      toggleEdit();
      break;
    }
    case "save": {
      const newName = liParent.children[0].value.trim();
      if (newName && !newName !== "") {
        update(id, newName)
          .then((response) => {
            if (response.ok) {
              liParent.children[0].value = newName.trim();
            }
          })
          .catch(
            () => (liParent.children[0].value = liParent.children[1].value)
          );
      }
      toggleEdit();
      break;
    }
    case "cancel": {
      liParent.children[0].value = liParent.children[1].value;
      liParent.children[0].disabled = true;
      liParent.children[2].value = liParent.children[3].value;
      liParent.children[2].disabled = true;
      liParent.children[4].children[0].children[0].checked =
        liParent.children[4].children[0].children[1].value == 1 ? true : false;

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

function remove() {
  return fetch("test/edit", {
    method: "DELETE",
    body: JSON.stringify(changes),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}

function update() {
  return fetch("test/edit", {
    method: "PUT",
    body: JSON.stringify(changes),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}
