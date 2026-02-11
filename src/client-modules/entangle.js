import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
if (ExecutionEnvironment.canUseDOM) {
  // Load Vue component
  const appCode = document.createElement("entangle-app");
  document.body.appendChild(appCode);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "http://localhost:6969/assets/index-CGJhef7l.css";
  document.head.appendChild(link);
  const script = document.createElement("script");
  script.src = "http://localhost:6969/assets/index-CEo8Ge-z.js";
  document.body.appendChild(script);

  // Dispatch event on document instead of window
  window.triggerVueAction = () => {
    document.dispatchEvent(
      new CustomEvent("toggle-entangle-model", {
        detail: { source: "navbar" },
      }),
    );
  };
}
