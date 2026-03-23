# ANALYYSI

## Mitä tekoäly teki hyvin?

Se missä tekoäly tietenkin onnistui oli se, että se sai toimivan sovelluksen tehtyä todella nopeasti. Kun antoi yhden selkeän promptin ja kokeili generoitua sovellusta, niin se toimi heti. Eli tekoäly todellakin on kätevä työkalu, jos haluaa sovelluksen rungon pystyyn nopeasti, ilman että tarvitsee täysin nollasta aloittaa.

Tekoäly toimi hyvin myös silloin, kun annoin selkeitä ohjeita jatkokehityksestä. Esimerkiksi tietyn koodipätkän refaktorointi omaksi moduuliksi onnistui näppärästi. Lisäksi tekoäly kykeni löytämään ja päivittämään projektista kaikki ne kohdat, joihin jokin tietty logiikkamuutos vaikutti. Tämä säästi paljon omaa aikaa, kun ei tarvinnut itse lähteä etsimään jokaista viittausta koodin seasta.

## Mitä tekoäly teki huonosti?

Vaikka tekoäly generoikin toimivan kokonaisuuden nopeasti, niin se miten sovellus oli toteutettu, ei ollut kaikista parasta jälkeä. Perustoiminnallisuudet ja liiketoimintasäännöt oli kyllä toteutettu, mutta niitä ei oltu tehty kunnolla loppuun asti. Kaikkia poikkeustapauksia (edge caseja) ei oltu otettu huomioon, ja sovelluksen olisi saanut joko kaatumaan tai toimimaan väärin, jos olisi niin halunnut.

Koodin luettavuus ei myöskään ollut parasta mahdollista. Vaikka koodi oli varmasti tekoälylle selkeää, se ei aina ollut kaikista optimaalisinta ihmisen silmälle. Promptien kanssa sai myös välillä olla todella tarkkana. Eli vaikka antoi tarkat ohjeet, niin tekoäly ei silti aina noudattanut niitä täysin. Esimerkiksi kun kerroin tekoälylle, että kaikki aikaleimat käsitellään UTC ajassa, niin se ei silti lisännyt mitään tarkistuksia, että löytyykö aikaleimoista "Z" merkkiä.

Lisäksi huomasin haasteita tietyissä teknisissä yksityiskohdissa. Käytin projektissa ESM:ää (ECMAScript Modules) CommonJS:n sijaan, eikä tekoäly kyennyt aina auttamaan ESM spesifien haasteiden kanssa. Vaikutti siltä, että tekoäly ei ollut vielä oppinut uusinta dokumentaatiota tältä osin, joten jouduin selvittelemään pari asiaa itse perinteisen googlettamisen avulla.

## Mitkä olivat tärkeimmät parannukset, jotka teit tekoälyn tuottamaan koodiin ja miksi?

Sanoisin että tein neljä merkittävää parannusta, jotka tekivät sovelluksesta ammattimaisemman ja turvallisemman.

Ensimmäisenä parannuksena tein projektin koodista luettavamman. Jaoin reitityksen, kontrollerit, middlewaret ja tietokantalogiikan omiin kansioihinsa ja tiedostoihinsa. Tämän ansiosta projektista tuli helppolukuisempi ja sitä pystyy nyt paljon järkevämmin jatkokehittämään, kun asiat on järjestetty valmiiksi omiin lokeroihinsa. Korjasin myös tekoälyn huonoja nimeämisiä (kuten yhden kirjaimen muuttujia) ja purin liian pitkiä koodipätkiä selkeämmiksi.

Toisena parannuksena tein validoinnista merkittävästi kattavamman. Vaikka tekoäly lisäsikin perusvalidointia syötteille, se jätti silti huomioimatta pari kriittistä seikkaa. Ehkä suurin puute oli syötteiden koon rajoittaminen. Alkuperäinen koodi hyväksyi minkä tahansa kokoisen syötteen, mikä on tietenkin kriittinen haavoittuvuus, jota pahantahtoinen käyttäjä voisi esimerkiksi hyödyntää. Lisäksi korjasin aiemmin mainitsemani puutteen, eli lisäsin tarkistuksen sille, että UTC aikaleimojen perästä löytyy "Z" merkki.

Kolmantena parannuksena tein huomattavasti enemmän testejä. Alkuperäisessä commitissa oli vain 8 testiä, jotka olivat myös hieman puutteellisia. Päädyin lopulta 22 yksikkötestiin, joilla sain katettua kaikki poikkeustapaukset (edge caset) ja skenaariot, joita tekoäly ei hoksannut testata. Nyt kattavat testit varmistavat sen, että perustoiminnallisuus ei hajoa jatkokehityksen aikana.

Neljäntenä parannuksena tein rajapinnan tietokannalle. Alun perin `inMemoryDB.ts` -tiedosto oli vain suoraan exportattu taulukko, mutta muutin sen exporttaamaan `db`-objektin selkeillä metodeilla. Tämän abstraktoinnin avulla estetään taulukon suora manipulointi ja tarjotaan selkeä rajapinta. Tästä on myös se hyöty, että jos myöhemmin halutaan vaihtaa tilalle oikea tietokanta, se onnistuu paljon helpommin, koska sovelluksen logiikkaa ei tarvitse sen kummemmin muuttaa.

## Yhteenveto

Projekti oli hyvä osoitus tekoälyn vahvuuksista ja heikkouksista. Tekoäly voi tehostaa työntekoa huomattavasti. Se on erityisen hyödyllinen työkalu esimerkiksi nopeiden "proof of concept" -toteutusten luomiseen sekä rutiininomaisten ja toistuvien tehtävien tekemiseen. Se ei kuitenkaan ole itsenäinen kehittäjä eikä korvaa ihmisen asiantuntemusta. Kuten tässäkin projektissa nähtiin, kriittisiä yksityiskohtia ja poikkeustapauksia (edge caseja) jäi huomioimatta. Ehkä tärkein oppi onkin se, että tekoälyn tuottamaa koodia ei kannata aina ottaa täysin sokeasti vastaan. Kehittäjän on aina ymmärrettävä ja arvioitava kriittisesti, mitä tekoäly on tuottanut.
