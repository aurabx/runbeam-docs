/**
 * This module will add the external javascript and css file to add the search
 * widget to the documentation website
 * Also this adds the google recaptcha code to avoid bot submissions
 */

import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
if (ExecutionEnvironment.canUseDOM) {
  // Load Vue component
  const appCode = document.createElement("entangle-app");
  document.body.appendChild(appCode);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "https://hicafe.co/style/00fe12f9-513c-45f5-b357-c32f4e7b7ae1.css";
  document.head.appendChild(link);
  const script = document.createElement("script");
  script.src = "https://hicafe.co/script/fa0f80c0-6d03-432f-ba09-33e250e1b539.js";
  document.body.appendChild(script);
  const recaptcha = document.createElement("script")
  recaptcha.src = "https://www.google.com/recaptcha/api.js?render=6LdBIyEsAAAAAP7K7mufri9od9pJNNtwlppAGLxb"
  document.head.appendChild(recaptcha)
  window.siteKey = "6LdBIyEsAAAAAP7K7mufri9od9pJNNtwlppAGLxb"
}
