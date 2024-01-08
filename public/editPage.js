let test;
let testOld;
const ulHome = `<ul class="list-group">`;
const ulEnd = `</ul>`;
const liEnd = `</li>`;

const idTest = document.querySelector("idtest").innerText;

function liHtml(num, title, chsk) {
  return `
<input
  type="number"
  onwheel="this.blur()"
  disabled
  value="${num}"
  style="${
    num != -1 ? "" : "display: none;"
  } border: none; background-color: white; color: black;  width: 3%; min-width: 40px"
/>
<input
  type="number"
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
    chsk == 1 ? "&radic;" : ""
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
    testOld = await JSON.parse(JSON.stringify(test));
    // console.log(test);
    // console.log(testOld);
    viewQuastionAnswer();
  }
};

function viewQuastionAnswer() {
  test.quastionsList.forEach((el) => {
    el.answer.sort((a, b) => a.num - b.num);
  });
  test.quastionsList.sort((a, b) => a.num - b.num);
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

function objectId() {
  return (
    hex(Date.now() / 1000) +
    " ".repeat(16).replace(/./g, () => hex(Math.random() * 16))
  );
}

function hex(value) {
  return Math.floor(value).toString(16);
}

document.addEventListener("click", async (event) => {
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

    liParent.children[0].disabled = !liParent.children[0].disabled;
    liParent.children[2].disabled = !liParent.children[2].disabled;
  }

  switch (type) {
    case "edit": {
      liParent.children[1].value = liParent.children[0].value;
      // liParent.children[0].disabled = false;
      liParent.children[3].value = liParent.children[2].value;
      // liParent.children[2].disabled = false;
      liParent.children[4].children[0].children[1].value = Number(
        liParent.children[4].children[0].children[0].checked
      );

      toggleEdit();
      break;
    }
    case "save": {
      const newNum =
        liParent.children[0].value.trim() === ""
          ? liParent.children[1].value.trim()
          : liParent.children[0].value.trim();
      const newTitle =
        liParent.children[2].value.trim() === ""
          ? liParent.children[3].value.trim()
          : liParent.children[2].value.trim();
      const newChesk = Number(
        liParent.children[4].children[0].children[0].checked
      );

      switch (testAnsQuast) {
        case "test": {
          test.title = newTitle;
          break;
        }
        case "quastion": {
          const indexQuastion = test.quastionsList.findIndex(
            (el) => el._id === idQuastion
          );
          test.quastionsList[indexQuastion].num = newNum;
          test.quastionsList[indexQuastion].title = newTitle;
          break;
        }
        case "answer": {
          const indexQuastion = test.quastionsList.findIndex(
            (el) => el._id === idQuastion
          );
          const indexAnswer = test.quastionsList[
            indexQuastion
          ].answer.findIndex((el) => el._id === idAnswer);
          // console.log(indexAnswer);
          test.quastionsList[indexQuastion].answer[indexAnswer].num = newNum;
          test.quastionsList[indexQuastion].answer[indexAnswer].title =
            newTitle;
          test.quastionsList[indexQuastion].answer[indexAnswer].chesk =
            newChesk;
          liParent.children[4].children[1].children[0].innerHTML =
            newChesk == 1 ? "&radic;" : "";
          break;
        }
      }
      toggleEdit();
      break;
    }
    case "cancel": {
      liParent.children[0].value = liParent.children[1].value;
      // liParent.children[0].disabled = true;
      liParent.children[2].value = liParent.children[3].value;
      // liParent.children[2].disabled = true;
      liParent.children[4].children[0].children[0].checked =
        liParent.children[4].children[0].children[1].value == 1 ? true : false;

      toggleEdit();
      break;
    }
    case "remove": {
      switch (testAnsQuast) {
        case "test": {
          document.querySelector("#vertest").textContent =
            "Тест ver." + test.version + " удален";
          document.querySelector("#headtest").innerHTML = "";
          document.querySelector("#quastionsdiv").innerHTML = "";
          test = {};
          break;
        }
        case "quastion": {
          if (test.quastionsList.length === 1) {
            test.quastionsList[0].num = 1;
            test.quastionsList[0].title = "Один единственный вопрос....";
            test.quastionsList[0].answer = [test.quastionsList[0].answer[0]];
            test.quastionsList[0].answer[0].chesk = 1;
            test.quastionsList[0].answer[0].num = 1;
            test.quastionsList[0].answer[0].title =
              "Один единственный ответ....";
            viewQuastionAnswer();
            return;
          }
          const indexQuastion = test.quastionsList.findIndex(
            (el) => el._id === idQuastion
          );
          test.quastionsList.splice(indexQuastion, 1);
          event.target.closest("li").remove();
          break;
        }
        case "answer": {
          const indexQuastion = test.quastionsList.findIndex(
            (el) => el._id === idQuastion
          );
          if (test.quastionsList[indexQuastion].answer.length === 1) {
            test.quastionsList[indexQuastion].answer[0].num = 1;
            test.quastionsList[indexQuastion].answer[0].title =
              "Один единственный ответ....";
            test.quastionsList[indexQuastion].answer[0].chesk = 1;
            // liParent.children[0].value =
            //   test.quastionsList[indexQuastion].answer[0].num;
            // liParent.children[2].value =
            //   test.quastionsList[indexQuastion].answer[0].title;
            // liParent.children[4].children[0].children[0].checked =
            //   test.quastionsList[indexQuastion].answer[0].chesk;
            viewQuastionAnswer();
            return;
          }
          const indexAnswer = test.quastionsList[
            indexQuastion
          ].answer.findIndex((el) => el._id === idAnswer);
          test.quastionsList[indexQuastion].answer.splice(indexAnswer, 1);
          event.target.closest("li").remove();
          break;
        }
      }
      break;
    }
    case "addquastion": {
      const newQuastion = {
        num: "0",
        title: "Абсолютно новый вопрос....",
        answer: [
          {
            num: "1",
            title: "Абсолютно новый ответ....",
            chesk: 1,
            _id: objectId(),
          },
        ],
        _id: objectId(),
      };
      test.quastionsList.push(newQuastion);
      viewQuastionAnswer();
      break;
    }
    case "addanswer": {
      const newAnswer = {
        num: "0",
        title: "Абсолютно новый ответ....",
        chesk: 0,
        _id: objectId(),
      };
      const tmpIdQuastion = event.target.parentNode.dataset.idquastion;
      const indexQuastion = test.quastionsList.findIndex(
        (el) => el._id === tmpIdQuastion
      );
      test.quastionsList[indexQuastion].answer.push(newAnswer);
      viewQuastionAnswer();
      break;
    }
    case "cancelchangetest": {
      test = await JSON.parse(JSON.stringify(testOld));
      viewQuastionAnswer();
      break;
    }
    case "savechangetest": {
      const addTest = [];
      const updateTest = [];
      const delTest = [];
      const typeRecord = ["test", "quastion", "answer"];
      if (Object.keys(test).length === 0) {
        delTest.push({
          idArr: [testOld._id],
          typeRecord: typeRecord[0],
        });
        await remove(delTest);
        await fetch(`/test/edit/update`);
      } else {
        updateTest.push({
          title: { num: Date.now(), title: test.title, chesk: 0 },
          idArr: [idTest],
          typeRecord: typeRecord[0],
        });
        test.quastionsList.forEach((el) => {
          const num = el.num;
          const title = el.title;
          const idQuastion = el._id;
          const indexQuastionOld = testOld.quastionsList.findIndex(
            (elem) => idQuastion === elem._id
          );
          if (indexQuastionOld != -1) {
            if (
              num != testOld.quastionsList[indexQuastionOld].num ||
              title != testOld.quastionsList[indexQuastionOld].title
            ) {
              updateTest.push({
                title: { num: num, title: title },
                idArr: [idTest, idQuastion],
                typeRecord: typeRecord[1],
              });
            }
            el.answer.forEach((arr) => {
              const idAnswer = arr._id;
              const num = arr.num;
              const title = arr.title;
              const chesk = arr.chesk;
              const indexAnswerOld = testOld.quastionsList[
                indexQuastionOld
              ].answer.findIndex(
                (elem) =>
                  idAnswer === elem._id &&
                  (num != elem.num ||
                    title != elem.title ||
                    chesk != elem.chesk)
              );

              if (indexAnswerOld != -1) {
                updateTest.push({
                  title: { num: num, title: title, chesk: chesk },
                  idArr: [idTest, idQuastion, idAnswer],
                  typeRecord: typeRecord[2],
                });
              }
            });
          }
        });

        test.quastionsList.forEach((el) => {
          const idQuastion = el._id;
          const indexQuastionOld = testOld.quastionsList.findIndex(
            (elem) => idQuastion === elem._id
          );
          if (indexQuastionOld === -1) {
            addTest.push({
              title: JSON.parse(JSON.stringify(el)),
              idArr: [idTest, idQuastion],
              typeRecord: typeRecord[1],
            });
          } else {
            el.answer.forEach((arr) => {
              const idAnswer = arr._id;
              const num = arr.num;
              const title = arr.title;
              const chesk = arr.chesk;
              const indexAnswerOld = testOld.quastionsList[
                indexQuastionOld
              ].answer.findIndex((elem) => idAnswer === elem._id);

              if (indexAnswerOld === -1) {
                addTest.push({
                  title: { num: num, title: title, chesk: chesk },
                  idArr: [idTest, idQuastion, idAnswer],
                  typeRecord: typeRecord[2],
                });
              }
            });
          }
        });

        testOld.quastionsList.forEach((el) => {
          const idQuastion = el._id;
          const indexQuastion = test.quastionsList.findIndex(
            (elem) => idQuastion === elem._id
          );
          if (indexQuastion === -1) {
            delTest.push({
              idArr: [idTest, idQuastion],
              typeRecord: typeRecord[1],
            });
          } else {
            el.answer.forEach((arr) => {
              const idAnswer = arr._id;
              const indexAnswer = test.quastionsList[
                indexQuastion
              ].answer.findIndex((elem) => idAnswer === elem._id);

              if (indexAnswer === -1) {
                delTest.push({
                  idArr: [idTest, idQuastion, idAnswer],
                  typeRecord: typeRecord[2],
                });
              }
            });
          }
        });

        // console.log(updateTest);
        await update(updateTest);
        // console.log(addTest);
        await add(addTest);
        // console.log(delTest);
        await remove(delTest);

        let response = await fetch(`/test/edit/${idTest}`);
        const buff = await response.json();
        const array = JSON.parse(localStorage.getItem("resultTesting"));
        if (array != null && array.length != 0) {
          array.forEach((el) => {
            if (Number(el.num) === Number(test.num)) {
              console.log(el.num, test.num);
              el.num = buff.num;
            }
          });
          localStorage.setItem("resultTesting", JSON.stringify(array));
        }
      }

      alert("Изменения записаны в базу.");
      break;
    }
    case "savenewtest": {
      const buff = await JSON.parse(JSON.stringify(test));
      delete buff._id;
      buff.quastionsList.forEach((el) => {
        delete el._id;
        el.answer.forEach((el) => {
          delete el._id;
        });
      });
      // console.log(buff);
      await add([
        {
          title: buff,
          idArr: [],
          typeRecord: "test",
        },
      ]);
      await fetch(`/test/edit/update`);
      window.location.reload();
      alert("Тест записан в базу с новым номером версии.");
    }
  }
  // console.log(test);
});

function add(addTest) {
  return fetch("/test/edit", {
    method: "POST",
    body: JSON.stringify(addTest),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}

function remove(delTest) {
  return fetch("/test/edit", {
    method: "DELETE",
    body: JSON.stringify(delTest),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}

function update(updateTest) {
  return fetch("/test/edit", {
    method: "PUT",
    body: JSON.stringify(updateTest),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}
