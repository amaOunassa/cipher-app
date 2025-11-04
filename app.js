function pgcd(a, b) {
  while (b !== 0) {
    let reste = a % b;
    a = b;
    b = reste;
  }
  return a;
}

function modInverse(a) {
  if (pgcd(a,26) !== 1) {
    console.log("this number deas not has an inverse");
    return null;
  }
  for (let x = 1; x < 26; x++) {
    if ((a * x) % 26 === 1) return x;
  }
  return null;
}


function letterToNum(msg) {
  let numarr = [];
  for (let i = 0; i < msg.length; i++) {
    let char = msg[i];
    if (char.match(/[A-Za-z]/)) {
      let num = char === char.toUpperCase()
        ? char.charCodeAt(0) - 65
        : char.charCodeAt(0) - 97;
      numarr.push(num);
    } else {
      console.log(`${char} (not a letter)`);
    }
  }
  return numarr; 
}

function NumToLetter(numarr) {
  let letters = numarr.map((n) => String.fromCharCode((n % 26) + 97));
  console.log("Le message chiffré est :", letters.join(""));
  return letters.join("");
}

function operation(msg, cle, mode, type) {
  console.log("Le message clair est :", msg);

  if (mode === "chiffrement" && type === "caesar") {
    let numarr = letterToNum(msg);
    for (let i = 0; i < numarr.length; i++) {
      numarr[i] = (numarr[i] + cle) % 26;
    }
    return NumToLetter(numarr);
  }

  if (mode === "Dechiffrement" && type === "caesar") {
    let numarr = letterToNum(msg);
    for (let i = 0; i < numarr.length; i++) {
      numarr[i] = (numarr[i] - cle + 26) % 26;
    }
    return NumToLetter(numarr);
  }
  if (mode === "chiffrement" && type === "affine") {
  let numarr = letterToNum(msg);
  let a = cle.a;
  let b = cle.b;
  if (pgcd(a, 26) !== 1) {
    console.log(" a doit être premier avec 26 !");
    return;
  }
  for (let i = 0; i < numarr.length; i++) {
    numarr[i] = (a * numarr[i] + b) % 26;
  }

  return NumToLetter(numarr);
}

if (mode === "Dechiffrement" && type === "affine") {
  let numarr = letterToNum(msg);
  let a = cle.a;
  let b = cle.b;
  let a_inv = modInverse(a);
  if (a_inv === null) {
    console.log(" Pas d’inverse pour a !");
    return;
  }
  for (let i = 0; i < numarr.length; i++) {
    numarr[i] = (a_inv * (numarr[i] - b + 26)) % 26;
  }
  return NumToLetter(numarr);
}

}

  function runCipher() {
      const msg = document.getElementById("message").value;
      const mode = document.getElementById("mode").value;
      const type = document.getElementById("type").value;

      let result = "";
      if (type === "caesar") {
        const cle = parseInt(document.getElementById("cleCesar").value);
        result = operation(msg, cle, mode, "caesar");
      } else {
        const a = parseInt(document.getElementById("cleA").value);
        const b = parseInt(document.getElementById("cleB").value);
        result = operation(msg, { a, b }, mode, "affine");
      }

      document.getElementById("result").textContent = "Résultat : " + result;
    }
    document.getElementById("type").addEventListener("change", function() {
      if (this.value === "caesar") {
        document.getElementById("cesarKeys").style.display = "block";
        document.getElementById("affineKeys").style.display = "none";
      } else {
        document.getElementById("cesarKeys").style.display = "none";
        document.getElementById("affineKeys").style.display = "block";
      }
    });

