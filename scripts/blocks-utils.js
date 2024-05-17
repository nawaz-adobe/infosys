function createAemElement(tagName, attributes, properties, ...children) {
  const el = document.createElement(tagName);
  if (attributes) {
    Object.keys(attributes).forEach((name) => {
      el.setAttribute(name, attributes[name]);
    });
  }
  if (properties) {
    Object.keys(properties).forEach((name) => {
      el[name] = properties[name];
    });
  }
  children.forEach((child) => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (Array.isArray(child)) {
      child.forEach((c) => el.appendChild(c));
    } else if (child) {
      el.appendChild(child);
    }
  });
  return el;
}

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
  createAemElement,
  createCustomElement,
  fetchData,
};
