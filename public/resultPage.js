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
  const newTag = document.createElement("li");
  newTag.className = "list-group-item";
  newTag.setAttribute("style", "white-space: pre;");
  newTag.textContent = `Дата тестирования ${displayDate(
    array[0].dateTesting
  )}\r\n Всего вопросов ${array[0].numQuastions}\r\n Нет ответа ${
    array[0].numQuastions - (array[0].trueAnswer + array[0].falseAnswer)
  }\r\n Правильных ответов ${array[0].trueAnswer}\r\n Неверных ответов ${
    array[0].falseAnswer
  }`;
  liById.insertAdjacentElement("beforeend", newTag);
};
