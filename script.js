var varukorg = [];

// Hämta sparad varukorg från localStorage
var sparad = localStorage.getItem("varukorg");
if (sparad != null) {
    varukorg = JSON.parse(sparad);
}

// Uppdatera antal-bubblan i sidhuvudet
function uppdateraAntal() {
    var antalEl = document.getElementById("varukorg-antal");
    if (antalEl == null) return;

    var totalt = 0;
    for (var i = 0; i < varukorg.length; i++) {
        totalt = totalt + varukorg[i].antal;
    }
    antalEl.textContent = totalt;
}

// Lägg till vara i varukorgen
function laggTill(namn, pris) {
    var hittad = false;

    for (var i = 0; i < varukorg.length; i++) {
        if (varukorg[i].namn == namn) {
            varukorg[i].antal = varukorg[i].antal + 1;
            hittad = true;
            break;
        }
    }

    if (hittad == false) {
        var nyVara = { namn: namn, pris: pris, antal: 1 };
        varukorg.push(nyVara);
    }

    localStorage.setItem("varukorg", JSON.stringify(varukorg));
    uppdateraAntal();
}

// Ändra antal på en vara
function andraAntal(namn, andring) {
    for (var i = 0; i < varukorg.length; i++) {
        if (varukorg[i].namn == namn) {
            varukorg[i].antal = varukorg[i].antal + andring;
            if (varukorg[i].antal <= 0) {
                taBort(namn);
                return;
            }
            break;
        }
    }
    localStorage.setItem("varukorg", JSON.stringify(varukorg));
    visaVarukorg();
}

// Ta bort en vara
function taBort(namn) {
    var nyArray = [];
    for (var i = 0; i < varukorg.length; i++) {
        if (varukorg[i].namn != namn) {
            nyArray.push(varukorg[i]);
        }
    }
    varukorg = nyArray;
    localStorage.setItem("varukorg", JSON.stringify(varukorg));
    visaVarukorg();
}

// Töm hela varukorgen
function tomVarukorg() {
    varukorg = [];
    localStorage.setItem("varukorg", JSON.stringify(varukorg));
    visaVarukorg();
}

// Visa varorna på varukorg.html
function visaVarukorg() {
    var varorEl = document.getElementById("varukorg-varor");
    if (varorEl == null) return;

    uppdateraAntal();

    var totalPris = 0;
    for (var i = 0; i < varukorg.length; i++) {
        totalPris = totalPris + (varukorg[i].pris * varukorg[i].antal);
    }
    document.getElementById("total-pris").textContent = totalPris.toLocaleString("sv-SE") + " kr";

    varorEl.innerHTML = "";

    if (varukorg.length == 0) {
        var tom = document.createElement("p");
        tom.textContent = "Din varukorg är tom.";
        tom.style.color = "#8890A4";
        varorEl.appendChild(tom);
        return;
    }

    for (var i = 0; i < varukorg.length; i++) {
        var vara = varukorg[i];

        var rad = document.createElement("div");
        rad.className = "varukorg-rad";

        rad.innerHTML =
            "<p>" + vara.namn + "</p>" +
            "<span>" + (vara.pris * vara.antal).toLocaleString("sv-SE") + " kr</span>" +
            "<div class='antal-kontroll'>" +
                "<button onclick=\"andraAntal('" + vara.namn + "', -1)\">−</button>" +
                "<span>" + vara.antal + "</span>" +
                "<button onclick=\"andraAntal('" + vara.namn + "', 1)\">+</button>" +
            "</div>" +
            "<button class='ta-bort' onclick=\"taBort('" + vara.namn + "')\">✕</button>";

        varorEl.appendChild(rad);
    }
}

// Kassa
function kassa() {
    if (varukorg.length == 0) return;

    var total = 0;
    for (var i = 0; i < varukorg.length; i++) {
        total = total + (varukorg[i].pris * varukorg[i].antal);
    }
    alert("Beställning på " + total.toLocaleString("sv-SE") + " kr genomförd!");
    tomVarukorg();
}

// Kör när sidan laddas
uppdateraAntal();
visaVarukorg();