const users = [
    {
      username: "jigglypuff",
      password: "upAirToRest"
    }
  ];
  
  document.querySelector(".loginBox").addEventListener("submit", function(e) {
    e.preventDefault();
  
    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;
  
    const validUser = users.find(user =>
      user.username === usernameInput &&
      user.password === passwordInput
    );
  
    if (validUser) {
      window.location.href = "dashboard.html";
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  });
  