import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔹 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDYW9O1fV-yxqxENcGe0L1-0hZIQXlWV88",
  authDomain: "domiclean01.firebaseapp.com",
  projectId: "domiclean01",
  storageBucket: "domiclean01.firebasestorage.app",
  messagingSenderId: "1412105890",
  appId: "1:1412105890:web:3716be5c2af93a6eb8b9fb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {

  // 🔹 FORMULAIRE
  const form = document.getElementById("devisForm");

  // 🔹 RÉFÉRENCES DOM
  const serviceSelect = document.getElementById("service");
  const heuresInput = document.getElementById("heures");
  const surfaceInput = document.getElementById("surface");
  const prixResultat = document.getElementById("prixResultat");

  if (!form || !serviceSelect || !heuresInput || !surfaceInput || !prixResultat) {
    console.error("Formulaire ou champs introuvables");
    return;
  }

  // 🔹 TARIFS TTC
  const TARIFS_TTC = {
    nettoyage_locaux: {
      jour: 30,
      nuit: 37.5
    },
    vitres: {
      m2: 5
    },
    demenagement: {
      m2: 4
    }
  };

  // 🔹 GESTION DES CHAMPS
  function gererChamps() {
    heuresInput.style.display = "none";
    surfaceInput.style.display = "none";

    heuresInput.value = "";
    surfaceInput.value = "";
    prixResultat.textContent = "";

    if (serviceSelect.value === "locaux_jour" || serviceSelect.value === "locaux_nuit") {
      heuresInput.style.display = "block";
    }

    if (serviceSelect.value === "vitres" || serviceSelect.value === "demenagement") {
      surfaceInput.style.display = "block";
    }
  }

  // 🔹 CALCUL TOTAL
  function calculerTotal(service, heures, surface) {
    switch (service) {
      case "locaux_jour":
        return heures * TARIFS_TTC.nettoyage_locaux.jour;
      case "locaux_nuit":
        return heures * TARIFS_TTC.nettoyage_locaux.nuit;
      case "vitres":
        return surface ? surface * TARIFS_TTC.vitres.m2 : "Sur devis";
      case "demenagement":
        return surface * TARIFS_TTC.demenagement.m2;
      default:
        return 0;
    }
  }

  // 🔹 AFFICHAGE PRIX
  function afficherPrix() {
    const service = serviceSelect.value;
    const heures = Number(heuresInput.value);
    const surface = Number(surfaceInput.value);

    const total = calculerTotal(service, heures, surface);

    if (total === "Sur devis") {
      prixResultat.textContent = "Tarif sur devis";
    } else if (total > 0) {
      prixResultat.textContent = `Prix estimé : ${total.toFixed(2)} € TTC`;
    } else {
      prixResultat.textContent = "";
    }
  }

  // 🔹 LISTENERS
  serviceSelect.addEventListener("change", () => {
    gererChamps();
    afficherPrix();
  });

  heuresInput.addEventListener("input", afficherPrix);
  surfaceInput.addEventListener("input", afficherPrix);

  // 🔹 ENVOI FIRESTORE
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const service = serviceSelect.value;
    const heures = Number(heuresInput.value);
    const surface = Number(surfaceInput.value);
    const totalTTC = calculerTotal(service, heures, surface);

    try {
      await addDoc(collection(db, "devis"), {
        nom: form.nom.value,
        email: form.email.value,
        service,
        heures: heures || null,
        surface: surface || null,
        totalTTC,
        statut: "Brouillon",
        date: new Date()
      });

      alert("Votre demande de devis a bien été envoyée ✔️");
      form.reset();
      prixResultat.textContent = "";
      gererChamps();

    } catch (err) {
      console.error("Erreur Firestore :", err);
      alert("Erreur lors de l’envoi du devis");
    }
  });

});
