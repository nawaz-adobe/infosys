function createCustomElement(tagname, className) {
  const element = document.createElement(tagname);
  if (className) {
    element.classList.add(className);
  }
  return element;
}

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonData = await response.json(); // Wait for JSON parsing
    return jsonData.data.map((country) => ({
      name: country.name,
      url: country.url,
    }));
  } catch (error) {
    return null;
  }
}

export {
  createCustomElement,
  fetchData,
};
