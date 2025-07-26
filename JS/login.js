document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault(); // علشان المفيش reload

  const email = document.querySelector("input[type='email']").value;
  const password = document.querySelector("input[type='password']").value;

  // هنا ممكن تضيف تحقق حقيقي من بيانات مسجلة
  if (email === "admin@gaming.com" && password === "123456") {
    alert("Login successful!");
    
    window.location.href = "index.html";
  } else {
    alert("Invalid credentials!");
  }
});
