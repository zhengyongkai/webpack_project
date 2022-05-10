import "./main.css";
import "./sass.scss";
import logo from "../public/logo.png";

const a = "Hello ITEM";
console.log(a);

const img = new Image();
img.src = logo;
console.log(document.getElementById("imgBox"));
document.getElementById("imgBox").appendChild(img);
