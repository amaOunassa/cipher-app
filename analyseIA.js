const GEMINI_API_KEY = "AIzaSyAz0EyA-R5ClzGWqfiBwLjwUCkx8KJxaLI";

function looksLikeFrench(text) {
  const words = ["le","la","de","et","un","en","dans","il","elle","est","des","les","pour","avec","que","du","se","pas","sur"];
  const count = words.filter(w => text.includes(w)).length;
  return count >= 2;
}

async function checkIfClearTextGemini(text) {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [
            { text: `Réponds UNIQUEMENT par "clair" si ce texte est une phrase française lisible, sinon "non clair".\nTexte:\n${text}` }
          ]
        }]
      })
    }
  );
  const data = await response.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase() || "";
  return reply.includes("clair");
}

async function autoAnalyseAI() {
  const msg = document.getElementById("message").value.toLowerCase().replace(/[^a-z]/g, "");
  const resultDiv = document.getElementById("result");

  if (!msg) return resultDiv.textContent = " Entrez un message d'abord.";
  
  resultDiv.textContent = " Analyse de fréquences + IA en cours...";

  let freq = {};
  for (let c of msg) freq[c] = (freq[c] || 0) + 1;

  const sorted = Object.entries(freq).sort((a,b)=>b[1]-a[1]);
  const topLetters = sorted.map(x => x[0]);
  const frenchCommon = ["e","a","s","t","n","i","r","o","l"];

  for (let letter of topLetters) {
    for (let ref of frenchCommon) {
      const key = (letter.charCodeAt(0) - ref.charCodeAt(0) + 26) % 26;
      const decrypted = operation(msg, key, "Dechiffrement", "caesar");
      if (looksLikeFrench(decrypted)) {
        resultDiv.textContent = ` Texte clair détecté (local)
🔑 Clé : ${key}
💬 Message : ${decrypted.toUpperCase()}`;
        return;
      }
      const isClear = await checkIfClearTextGemini(decrypted);
      if (isClear) {
        resultDiv.textContent = ` Texte clair détecté par IA
🔑 Clé : ${key}
💬 Message : ${decrypted.toUpperCase()}`;
        return;
      }
    }
  }

  resultDiv.textContent = " Aucun texte clair trouvé après toutes les tentatives.";
}
async function autoAnalyseAffineAI() {
  const msg = document.getElementById("message").value.toLowerCase().replace(/[^a-z]/g, "");
  const resultDiv = document.getElementById("result");

  if (!msg) return (resultDiv.textContent = "⚠️ Entrez un message d'abord.");
  resultDiv.textContent = "🔍 Analyse Affine + IA en cours...";
  const validA = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

  for (let a of validA) {
    for (let b = 0; b < 26; b++) {
      const decrypted = operation(msg, { a, b }, "Dechiffrement", "affine");
      if (looksLikeFrench(decrypted)) {
        resultDiv.innerHTML = `
          <p style="color:#00ffae;font-weight:600;">✔ Texte clair détecté (local)</p>
          <p style="color:#4cb9ff;"><b>🔑 a = ${a}, b = ${b}</b></p>
          <p style="color:#a0b3ff;"><b>💬 Message :</b> ${decrypted.toUpperCase()}</p>
        `;
        return;
      }

      const isClear = await checkIfClearTextGemini(decrypted);
      if (isClear) {
        resultDiv.innerHTML = `
          <p style="color:#00ffae;font-weight:600;">✔ Texte clair détecté par IA</p>
          <p style="color:#4cb9ff;"><b>🔑 a = ${a}, b = ${b}</b></p>
          <p style="color:#a0b3ff;"><b>💬 Message :</b> ${decrypted.toUpperCase()}</p>
        `;
        return;
      }
    }
  }

  resultDiv.innerHTML = `
    <p style="color:#ff4c4c;font-weight:600;">❌ Aucun texte clair trouvé après toutes les combinaisons (Affine)</p>
  `;
}
