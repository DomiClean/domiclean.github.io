// 🔹 IMPORTS FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔹 CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDYW9O1fV-yxqxENcGe0L1-0hZIQXlWV88",
  authDomain: "domiclean01.firebaseapp.com",
  projectId: "domiclean01",
  storageBucket: "domiclean01.firebasestorage.app",
  messagingSenderId: "1412105890",
  appId: "1:1412105890:web:3716be5c2af93a6eb8b9fb"
};

// 🔹 INIT
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 LOGIN
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    alert("Erreur de connexion");
    console.error(e);
  }
};

// 🔹 SESSION
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("login").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    chargerDevis();
  } else {
    document.getElementById("login").style.display = "block";
    document.getElementById("dashboard").style.display = "none";
  }
});

// 🔹 CHARGER LES DEVIS
async function chargerDevis() {
  const tbody = document.querySelector("#devisTable tbody");
  tbody.innerHTML = "";

  const snapshot = await getDocs(collection(db, "devis"));
  snapshot.forEach((d) => {
    const devis = d.data();

    tbody.innerHTML += `
      <tr>
        <td>${devis.nom || "-"}</td>
        <td>${devis.email || "-"}</td>
        <td>${devis.totalTTC || "-"} €</td>
        <td>
          <span class="status ${(devis.statut || "brouillon").toLowerCase()}">
            ${devis.statut || "Brouillon"}
          </span>
        </td>
        <td>
          <button onclick="changerStatut('${d.id}', 'Envoyé')">Envoyer</button>
          <button onclick="changerStatut('${d.id}', 'Accepté')">Accepter</button>
          <button onclick="changerStatut('${d.id}', 'Refusé')">Refuser</button>
        </td>
      </tr>
    `;
  });
}

// 🔹 CHANGER STATUT
window.changerStatut = async function (id, statut) {
  await updateDoc(doc(db, "devis", id), { statut });
  chargerDevis();
};
