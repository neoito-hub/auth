const generateRandomString = (length = 6) => {
  // const length = 6;
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return Array.from(
    { length },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
};

export default generateRandomString;
