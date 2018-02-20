/// <reference path="../jQuery/jquery-3.1.1.js"/>

/// <reference path="../jQuery/jquery-3.1.1.intellisense.js"/>





onload = initieer;


var gerechten;// variabele uitlezen JSON
var selektie;//Keuzelijst gerechten
var keuzeSelektie;//keuzelijst subgerechten
var keuze;// keuzengerecht bij bestellingen
var totaal = 0; // variabele voor totaalprijsberekening
var aantal = 0; // variabele aantal ingevoerde gerechten


var naam = ""; // variabelen voor ophalen geselecteerd gerecht
var beschrijving = "";
var prijs = "";
var foto = "";

var clicks = 0;


function initieer() {
    var xmlhttp = new XMLHttpRequest();
    var locatie = "JSON/gerechten.json";

    xmlhttp.onreadystatechange = function() {
        if (this
            .readyState ==
            4 &&
            this.status == 200) { //.readystate: status request = 4 aanvr.verwerkt en respons klaar; 200 = OK
            gerechten = JSON.parse(this.responseText);
            // Pas wanneer object gerechten geladen is kan de funtie VulData gebruikt worden
            VulData();
            Vuldetail();
        }
    };
    xmlhttp.open("GET", locatie, true);
    xmlhttp.send();

    //P 85 = We voorzien een eventListener op de selectie, zodat bij aanpassen van de geselecteerde locatie de inhoud wordt aangepast 
    //en voorzien een Start- functie zodat bij opstart de lessen van de selectie worden getoond. In dit geval 2x.

    function VulData() {
        // keuzelijst 3 gangen
        selektie = document.querySelector("#selecteerGang"); // Werkwijze querySelector () geeft het eerste element,
        //dat overeenkomt met een opgegeven CSS selector (s) in het document.
        for (soort in gerechten) {
            selektie.options[selektie.options.length] = new Option(soort, soort);
            //2.10.3.2.Opties bijmaken en verwijderen
            //Keuzelijsten en opties kan jet bijmaken met de methode CreateElement() of door de eigenschap innerHTML
            //(van de select lijst of een overkoepelend element aan te passen.
            ////Een alternatieve manier is door de optie toe te voegen door aan keuzelijst door een object new Option() te voorzien.
            //lijst.options[lijst.length] = new Option("tekstwaarde", "valuewaarde");
            //of lijst.options[lijst.length] = new Option("tekstwaarde");
            //Een element uit een keuzelijst verwijderen kan door de optie van het geselecteerde item op null te plaatsen.lijst.options[index] = null;


        }

        selektie.addEventListener("change", Vuldetail, false);


    }

    function Vuldetail() {
        keuzeSelektie = document.querySelector("#selecteerKeuze");
        var seldet = selektie[selektie.selectedIndex].text; //geselekteerd item keuze gangen
        keuzeSelektie.length = 0; //leegmaken van de lijst
        //for (var i = 0; i < gerechten[geselecteerditem].length; i++)
        for (var i = 0; i < gerechten[seldet].length; i++) {
            keuzeSelektie.options[keuzeSelektie.length] = new Option(gerechten[seldet][i].Naam);

        }
        keuzeSelektie.options[0].selected = true;
        keuzeSelektie.addEventListener("change", ToonInhoud, false);
        //Zorg na vullen van select items ingelezen
        Start();
    }


    function Start() {
        ToonInhoud();

    }

    function ToonInhoud() {
        inhoud = document.getElementById("inhouden");
        keuze = selektie[selektie.selectedIndex].text;
        var selitem = keuzeSelektie.selectedIndex;

        inhoud.innerHTML = "";


        if (Array.isArray(gerechten[keuze])) {


            for (gekozenitem in gerechten[keuze][selitem]) {
                if (gekozenitem === "Naam") {
                    naam = gerechten[keuze][selitem][gekozenitem]
                };
                if (gekozenitem === "Beschrijving") {
                    beschrijving = gerechten[keuze][selitem][gekozenitem]
                };
                if (gekozenitem === "Prijs") {
                    prijs = gerechten[keuze][selitem][gekozenitem]
                };
                if (gekozenitem === "Foto") {
                    foto = gerechten[keuze][selitem][gekozenitem]
                };
            }


            var toevoegingFoto = document.createElement('IMG');
            toevoegingFoto.className = "foto";
            toevoegingFoto.setAttribute("src", "afbeeldingen/" + foto);
            toevoegingFoto.setAttribute("alt", "fotogerecht");


            var toevoegingNaam = document.createElement('h4');
            toevoegingNaam.className = "naam";
            toevoegingNaam.innerHTML = naam;

            var toevoegingBeschrijving = document.createElement('h4');
            toevoegingBeschrijving.className = "beschrijving";
            toevoegingBeschrijving.innerHTML = beschrijving;

            var toevoegingPrijs = document.createElement('h4');
            toevoegingPrijs.className = "prijs";
            toevoegingPrijs.innerHTML = "Prijs : <span style=\"color:red;\">€ " + prijs + "</span>";


            inhoud.appendChild(toevoegingFoto);
            inhoud.appendChild(toevoegingNaam);
            inhoud.appendChild(toevoegingPrijs);
            inhoud.appendChild(toevoegingBeschrijving);


        }

    }


    function KnopVoorbestelling() {
        document.getElementById("bestelknop").className = "knopVoorbestelling";
    }

    function KnopNabestelling() {
        document.getElementById("bestelknop").className = "knopNabestelling";
    }

    function ResetIngave() {

        document.getElementById("ingaveAantal").value = "0";


    }

    function Totaalprijs() {
        var gerechtprijs = parseFloat(prijs.replace(",", "."));
        var product = (aantal * gerechtprijs);

        totaal = Math.round((totaal + product) * 100) / 100;
        ResetIngave();


        ttl = document.getElementById("tot");

        var tih = " ";
        tih = "Totaalprijs: € " + totaal;

        ttl.innerHTML = tih.replace(".", ",");

    }

    function Reset() {
        if (clicks > 3) {
            alert("Alle gerechten werden besteld! \n De applicatie zal herstarten.");
            window.location.reload();
        }
    }

    function Show() {

        if (aantal > 0 && aantal < 40) {
            $('.kaderBestellingen').show(4000);
        }
        
    }
   


    function Bestellingen() {

        KnopNabestelling();


        var inputAantal;
        inputAantal = document.getElementById("ingaveAantal").value;

        aantal = parseInt(inputAantal);


        if (isNaN(inputAantal) || inputAantal === " ") {

            alert(" Om een bestelling te kunnen doorvoeren is een getal vereist groter dan 0! ");
            ResetIngave();
            KnopVoorbestelling();
            return false;


        }
        if (aantal <= 0 || aantal > 40) {
            alert(" Bestellingen tussen 1 en 40! ");
            ResetIngave();
            KnopVoorbestelling();
            return false;
        }

        Prijsberekening();

    }


    function Prijsberekening() {

        clicks = clicks + 1;
        Reset();

        kadbes = document.getElementById("kabestel");
        //kadbes.setAttribute("style", "display: inline-block;");
        //kadbes.className = "kaderBestellingen";


        if (keuze == "Voorgerechten") {
            vrb = document.getElementById("voor");
            vrb.setAttribute("style", "display: inline-block;");

            var vih = " ";
            vih = "Voorgerechten: <br/> " +
                naam +
                " Prijs:  " +
                parseFloat(prijs.replace(",", ".")) +
                " Aantal besteld: " +
                aantal;
            vrb.innerHTML = vih;

        }

        if (keuze == "Hoofdgerechten") {
            hgb = document.getElementById("hoofd");
            hgb.setAttribute("style", "display: inline-block;");

            var hih = " ";
            hih = "Hoofdgerechten: <br/> " +
                naam +
                " Prijs:  " +
                parseFloat(prijs.replace(",", ".")) +
                " Aantal besteld: " +
                aantal;
            hgb.innerHTML = hih;


        }

        if (keuze == "Desserts") {
            dsb = document.getElementById("dess");
            dsb.setAttribute("style", "display: inline-block;");
            var dih = " ";
            dih = "Desserts: <br/> " +
                naam +
                " Prijs:  " +
                parseFloat(prijs.replace(",", ".")) +
                " Aantal besteld: " +
                aantal;
            dsb.innerHTML = dih;


        }
        Totaalprijs();


    }

    var bestellen = document.getElementById("bestelknop");
    if (bestellen) {
        bestellen.addEventListener("click",
            function() {
                Bestellingen(),
                    Show();
            },
            false);
    }

    
}




 























