function displayDate(createdAt) {
  const date = new Date(Number(createdAt));
  return String(
    date.getDate() +
      "/" +
      (date.getMonth() + 1) +
      "/" +
      date.getFullYear() +
      "-" +
      date.getHours() +
      "." +
      date.getMinutes() +
      "." +
      date.getSeconds()
  );
}

window.onload = function () {
  const liById = document.getElementById("history");
  const array = JSON.parse(localStorage.getItem("resultTesting"));
  // console.log(array);
  if (array === null || array.length === 0) {
    const newTag = document.createElement("p");
    newTag.className = "text-center fs-5";
    newTag.textContent = `Ни один тест еще не пройден`;
    liById.insertAdjacentElement("beforeend", newTag);
    return;
  }

  array.sort((a, b) => -a.dateTesting + b.dateTesting);
  array.forEach((el) => {
    const newTag = document.createElement("li");
    newTag.className = "list-group-item";
    newTag.setAttribute("style", "white-space: pre;");
    newTag.innerHTML = `Дата тестирования ${displayDate(
      el.dateTesting
    )}\r\n Версия теста ${el.version} <span style="color: red">${
      Number(el.num) > el.dateTesting ? "*тест изменен после прохождения" : ""
    }</span>\r\n Всего вопросов ${el.numQuastions}\r\n Нет ответа ${
      el.numQuastions - (el.trueAnswer + el.falseAnswer)
    }\r\n Правильных ответов ${el.trueAnswer}\r\n Неверных ответов ${
      el.falseAnswer
    }`;
    liById.insertAdjacentElement("beforeend", newTag);
  });
};
