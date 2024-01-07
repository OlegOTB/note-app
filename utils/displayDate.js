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

module.exports = displayDate;
