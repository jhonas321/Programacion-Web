document.addEventListener('DOMContentLoaded', () =>{
  const userName = sessionStorage.getItem("user") || "Nombre de Usuario";
  document.getElementById("nameAd").innerHTML = userName
});

