process.removeAllListeners("warning");
process.on("warning", (warning) => {
  const { name, message } = warning;
  if (
    name === "ExprrimentalWarning" &&
    message.includes("--experimental-loader")
  ) {
    return;
  }
  if (
    name === "DeprecationWarning" &&
    message.includes("Obsolete loader hook")
  ) {
    return;
  }
});
