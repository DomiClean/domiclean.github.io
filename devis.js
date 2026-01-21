document.addEventListener("DOMContentLoaded", () => {

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

  // 🔹 RÉFÉRENCES DOM
  const serviceSelect = document.getElementById("service");
  const heuresInput = document.getElementById("heures");
  const surfaceInput = document.getElementById("surface");
  const prixResultat = document.getElementById("prixResultat");

  // 🔹 SÉCURITÉ
  if (!serviceSelect || !heuresInput || !surfaceInput || !prixResultat) {
    console.error("Éléments du formulaire manquants");
    return;
  }

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

  // 🔹 AFFICHAGE PRIX EN DIRECT
  function afficherPrix() {
    const service = serviceSelect.value;
    const heures = Number(heuresInput.value);
    const surface = Number(surfaceInput.value);

    if (!service) {
      prixResultat.textContent = "";
      return;
    }

    const total = calculerTotal(service, heures, surface);

    if (total === "Sur devis") {
      prixResultat.textContent = "Tarif sur devis";
    } else if (total > 0) {
      prixResultat.textContent = `Prix estimé : ${total.toFixed(2)} € TTC`;
    } else {
      prixResultat.textContent = "";
    }
  }

  // 🔹 ÉCOUTEURS
  serviceSelect.addEventListener("change", () => {
    gererChamps();
    afficherPrix();
  });

  heuresInput.addEventListener("input", afficherPrix);
  surfaceInput.addEventListener("input", afficherPrix);

});
