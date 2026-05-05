var varukorg = [];

var sparad = localStorage.getItem("varukorg");
if (sparad != null) {
    varukorg = JSON.parse(sparad);
}

function uppdateraAntal() {
    var antalEl = document.getElementById("varukorg-antal");
    if (antalEl == null) return;
    var totalt = 0;
    for (var i = 0; i < varukorg.length; i++) {
        totalt = totalt + varukorg[i].antal;
    }
    antalEl.textContent = totalt;
}

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
        varukorg.push({ namn: namn, pris: pris, antal: 1 });
    }
    localStorage.setItem("varukorg", JSON.stringify(varukorg));
    uppdateraAntal();
}

function visaVarukorg() {
    var varorEl = document.getElementById("varukorg-varor");
    if (varorEl == null) return;

    uppdateraAntal();
    varorEl.innerHTML = "";

    if (varukorg.length == 0) {
        varorEl.innerHTML = "<li>Din varukorg är tom.</li>";
        return;
    }

    for (var i = 0; i < varukorg.length; i++) {
        var li = document.createElement("li");
        li.textContent = varukorg[i].namn + " x" + varukorg[i].antal;
        varorEl.appendChild(li);
    }
}

function kassa() {
    if (varukorg.length == 0) return;
    varukorg = [];
    localStorage.setItem("varukorg", JSON.stringify(varukorg));
    visaVarukorg();
    alert("Tack för din beställning!");
}

uppdateraAntal();
visaVarukorg();