const element = document.getElementById("vid");

setInterval(() => {
  const computedStyle = window.getComputedStyle(element);
  console.log(computedStyle.transform);
}, 1000);  // 每隔 1 秒列印一次 transform
