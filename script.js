/** * 1. EXTENSIVE CHAI DATABASE
 * Format: [Category, CSS Property 1, CSS Property 2...]
 */
const CHAI_DB = {
  // Spacing
  p: ["spacing", "padding"],
  pt: ["spacing", "paddingTop"],
  pb: ["spacing", "paddingBottom"],
  pl: ["spacing", "paddingLeft"],
  pr: ["spacing", "paddingRight"],
  m: ["spacing", "margin"],
  mt: ["spacing", "marginTop"],
  mb: ["spacing", "marginBottom"],
  // Layout
  w: ["layout", "width"],
  h: ["layout", "height"],
  rounded: ["layout", "borderRadius"],
  opacity: ["layout", "opacity"],
  // Colors
  bg: ["color", "backgroundColor"],
  text: ["color", "color"],
  border: ["color", "borderColor"],
  // Typography
  font: ["typography", "fontSize"],
  weight: ["typography", "fontWeight"],
  align: ["typography", "textAlign"],
  // Flexbox
  flex: ["flex", "display"],
  direction: ["flex", "flexDirection"],
  gap: ["spacing", "gap"],
};

/** 2. REPORTER (from reporter.js) **/
function showError(msg) {
  const display = document.getElementById("error-display");
  display.innerText = msg;
  setTimeout(() => (display.innerText = ""), 5000);
}

/** 3. VALIDATOR (from validator.js) **/
function validHTML(htmlContent) {
  if (!htmlContent) {
    showError("BUFFER EMPTY: Please enter HTML content.");
    return false;
  }
  const htmlPattern = /<\/?[a-z][\s\S]*>/i;
  if (!htmlPattern.test(htmlContent)) {
    showError("SYNTAX ERROR: No valid HTML tags detected.");
    return false;
  }
  if (
    htmlContent.toLowerCase().includes("<script") ||
    htmlContent.toLowerCase().includes("onclick")
  ) {
    showError("SECURITY BREACH: Scripts are forbidden.");
    return false;
  }
  return true;
}

/** 4. CORE ENGINE (from core.js) **/
function applyCSS(element, key, propertyValue) {
  const keyProperties = CHAI_DB[key];
  if (!keyProperties) {
    return { isApplied: false, reason: "Unknown utility" };
  }

  const category = keyProperties[0];
  let finalValue = propertyValue;

  // Unit Conversion for Spacing/Layout
  if (
    category === "spacing" ||
    category === "layout" ||
    category === "typography"
  ) {
    if (!isNaN(propertyValue)) {
      finalValue = propertyValue + "px";
    }
  }

  // Special Case: Display Flex
  if (key === "flex" && propertyValue === "true") finalValue = "flex";

  const cleanProps = keyProperties.slice(1);
  let isApplied = false;

  cleanProps.forEach((property) => {
    element.style[property] = finalValue;
    if (element.style[property]) isApplied = true;
  });

  return { isApplied, finalValue, cleanProps };
}

function extractDetails(container) {
  const bodyElements = container.querySelectorAll("*");
  const pattern = "chai-";

  bodyElements.forEach((e) => {
    const classes = Array.from(e.classList);
    const validClasses = classes.filter((c) => c.startsWith(pattern));

    validClasses.forEach((className) => {
      const parts = className.split("-");
      const key = parts[1];
      const value = parts[2];

      const result = applyCSS(e, key, value);
      // Optional: Remove the chai class after applying to clean the DOM
      if (result.isApplied) e.classList.remove(className);
    });
  });
}

/** 5. INPUT CONTROLLER (from input.js) **/
document.getElementById("run-btn").addEventListener("click", () => {
  const htmlInput = document.getElementById("html-input").value.trim();
  const renderArea = document.getElementById("render-area");

  if (validHTML(htmlInput)) {
    renderArea.innerHTML = htmlInput;
    extractDetails(renderArea);
  }
});

// Default Example
document.getElementById("html-input").value =
  `<div class="chai-bg-black chai-text-white chai-p-30 chai-rounded-15">
  <h2 class="chai-text-orange chai-mb-10">Chai Parser Active</h2>
  <p class="chai-font-14">Try changing classes like chai-bg-blue or chai-p-50!</p>
</div>`;
