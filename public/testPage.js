let test;
let currentQuastion = 0;
let allNumQuastion = 0;

const previousquastion = document.querySelector("#previousquastion");
const nextquastion = document.querySelector("#nextquastion");
const finishTest = document.querySelector("#finishTest");

window.onload = async function () {
  const idTest = document.querySelector("idtest").innerText;
  let response = await fetch(`test/${idTest}`);
  if (response.ok) {
    test = await response.json();
    // console.log(test);
    allNumQuastion = test.quastionsList.length;

    test.quastionsList.forEach((el) => {
      el.answer.forEach((el) => {
        el.cheskAnswer = 0;
      });
    });
    test.quastionsList.forEach((el) => {
      el.answer.sort((a, b) => a.num - b.num);
    });
    test.quastionsList.sort((a, b) => a.num - b.num);
    viewNumQuastion();
    viewQuastionAnswer();
  }
};

document.addEventListener("click", (event) => {
  const id = event.target.id;
  switch (event.target.dataset.type) {
    case "checkbox": {
      test.quastionsList[currentQuastion].answer[id].cheskAnswer = Number(
        event.target.checked
      );
      break;
    }
    case "nextquastion": {
      currentQuastion = currentQuastion + 1;
      viewNumQuastion();
      viewQuastionAnswer();
      break;
    }
    case "previousquastion": {
      currentQuastion = currentQuastion - 1;
      viewNumQuastion();
      viewQuastionAnswer();
      break;
    }
    case "finishtest": {
      let arrayTesting = JSON.parse(localStorage.getItem("resultTesting"));
      let trueAnswer = 0;
      let falseAnswer = 0;
      test.quastionsList.forEach((el) => {
        let ans = true;
        let zero = false;
        el.answer.forEach((el) => {
          if (el.cheskAnswer != el.chesk) ans = false;
          if (el.cheskAnswer != 0) zero = true;
        });
        if (zero)
          ans ? (trueAnswer = trueAnswer + 1) : (falseAnswer = falseAnswer + 1);
      });

      const resultTesting = {
        dateTesting: Date.now(),
        num: test.num,
        version: test.version,
        numQuastions: allNumQuastion,
        trueAnswer: trueAnswer,
        falseAnswer: falseAnswer,
      };
      if (arrayTesting === null || arrayTesting === undefined) {
        arrayTesting = [resultTesting];
      } else {
        arrayTesting.push(resultTesting);
      }
      localStorage.setItem("resultTesting", JSON.stringify(arrayTesting));
      break;
    }
  }
});

function viewQuastionAnswer() {
  document.querySelector("#quastion").innerText =
    test.quastionsList[currentQuastion].title + "?";

  const answer = document.querySelector("#answer");
  answer.innerHTML = "";
  test.quastionsList[currentQuastion].answer.forEach((el, index) => {
    const newTagInput = document.createElement("input");
    newTagInput.className = "form-check-input";
    newTagInput.type = "checkbox";
    newTagInput.id = index;
    newTagInput.setAttribute(`data-type`, "checkbox");
    if (el.cheskAnswer === 1) newTagInput.setAttribute(`checked`, "checked");

    const newTagLabel = document.createElement("label");
    newTagLabel.className = "form-check-label";
    newTagLabel.htmlFor = index;
    newTagLabel.textContent = el.num + ". " + el.title;
    newTagLabel.style.marginLeft = "10px";

    const newTagLi = document.createElement("li");
    newTagLi.className = "list-group-item";

    newTagLi.insertAdjacentElement("beforeend", newTagInput);
    newTagLi.insertAdjacentElement("beforeend", newTagLabel);

    answer.insertAdjacentElement("beforeend", newTagLi);
  });
}

function viewNumQuastion() {
  currentQuastion === 0
    ? previousquastion.setAttribute("disabled", true)
    : previousquastion.removeAttribute("disabled");
  if (currentQuastion === allNumQuastion - 1) {
    nextquastion.style.display = "none";
    finishTest.style.display = "inline-block";
  } else {
    nextquastion.style.display = "inline-block";
    finishTest.style.display = "none";
  }

  document.querySelector("#numquastion").innerText =
    String(Number(test.quastionsList[currentQuastion].num)) +
    "/" +
    String(allNumQuastion);
}
