function removeListener() {
  const customWindow = /** @type {CustomWindow} */ (window);

  if (customWindow._jumpToListener) {
    window.removeEventListener("keydown", customWindow._jumpToListener);
  }
}

removeListener();
