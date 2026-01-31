# ANALYYSI

## Mitä tekoäly teki hyvin?

Se missä tekoäly tietenkin onnistui oli se, että se sai toimivan sovelluksen tehtyä todella nopeasti. Kun antoi yhden selkeän promptin ja kokeili generoitua sovellusta, niin se toimi heti. Eli tekoäly todellakin on kätevä työkalu, jos haluaa sovelluksen rungon pystyyn nopeasti, ilman että tarvitsee täysin nollasta aloittaa.

Tekoäly toimi hyvin myös silloin, kun annoin sille selkeitä ohjeita jatkokehityksestä. Esimerkiksi tietyn koodin refaktorointi omaksi moduuliksi onnistui nopeasti ja vaivattomasti. Lisäksi tekoäly kykeni löytämään projektista kaikki ne kohdat, joihin jokin tietty muutos vaikutti. Tämä säästi paljon omaa aikaa, kun ei tarvinnut itse lähteä muistelemaan ja etsimään jokaista viittausta koodin seasta.

## Mitä tekoäly teki huonosti?

Vaikka tekoäly antoikin nopeasti toimivan kokonaisuuden, niin se miten sovellus oli toteutettu, ei ollut kaikista parasta jälkeä. Perustoiminnallisuudet ja säännöt oli kyllä lisätty, mutta niitä ei oltu tehty täysin loppuun asti. Kaikkia poikkeustapauksia (edge caseja) ei oltu otettu huomioon, ja sovelluksen olisi kyllä saanut joko kaatumaan tai toimimaan väärin, jos sitä olisi yrittänyt testata hieman syvemmin.

Koodin luettavuus ei myöskään ollut parasta mahdollista. Vaikka logiikka oli varmaan tekoälylle itselleen todella selkeä, se ei ollut ihmisen silmille kaikista optimaalisin. Promptien kanssa sai myös välillä olla todella tarkkana. Eli vaikka annoin tarkat ohjeet, niin tekoäly ei silti aina noudattanut niitä täysin. Esimerkiksi vaikka kerroin tekoälylle, että kaikki aikaleimat käsitellään UTC-ajassa, niin se ei lisännyt mitään tarkistuksia, että löytyykö "Z"-merkkiä aikaleimoista.

Lisäksi huomasin haasteita teknisissä yksityiskohdissa. Käytin projektissa ESM:ää (ECMAScript Modules) yleisemmän CommonJS:n sijaan, eikä tekoäly kyennyt aina auttamaan suoraan ESM-spesifien haasteiden kanssa. Vaikutti siltä, ettei se ollut vielä oppinut aivan uusinta dokumentaatiota tältä osin, joten jouduin selvittämään pari asiaa itse perinteisen googlettamisen avulla.

## Mitkä olivat tärkeimmät parannukset, jotka teit tekoälyn tuottamaan koodiin ja miksi?

Sanoisin, että tein neljä merkittävää parannusta, jotka tekivät sovelluksesta ammattimaisemman ja turvallisemman.

Ensimmäinen parannus oli se, että projektin ja koodin luettavuus parani huomattavasti. Jaoin reitityksen, kontrollerit, middlewaret ja tietokantalogiikan omiin kansioihinsa ja tiedostoihinsa. Tämän ansiosta projektia on nyt paljon helpompi navigoida ja sitä pystyy jatkokehittämään helpommin sekä järkevämmin, kun asiat on järjestetty valmiiksi omiin lokeroihinsa eikä tarvitse jatkaa jotain satojen rivien koodia täynnä olevaa tiedostoa. Korjasin myös itse koodista tekoälyn huonoja nimeämisiä (kuten yhden kirjaimen muuttujia) ja purin liian pitkiä koodipätkiä selkeämmiksi.

Toisena paransin validointia merkittävästi. Vaikka tekoäly oli lisännyt tarkistuksia, niin se kumminkin jätti huomioimatta pari kriittistä asiaa. Ehkä isoin asia oli syötteiden koon tarkistaminen. Alkuperäinen koodi antoi minkä tahansa kokoisen syötteen tulla läpi. Eli alkuperäisessä koodissa oli haavoittuvuus, jota pahantahtoinen käyttäjä olisi voinut hyödyntää. Lisäksi korjasin aiemmin mainitsemani puutteen, eli lisäsin tarkistuksen sille, että UTC-aikaleiman perässä on oikeasti se "Z"-merkki.

Kolmas parannus oli se, että kirjoitin huomattavasti enemmän testejä. Alkuperäisessä commitissa oli vain 8 testiä, jotka olivat hieman puutteellisia. Päädyin lopulta 22 yksikkötestiin, joilla sain katettua kaikki ne poikkeustapaukset (edge caset) ja skenaariot, joita tekoäly ei hoksannut testata. Nyt kattavat testit varmistavat, ettei perustoiminnallisuus hajoa jatkokehityksen aikana.

Neljäs parannus oli `inMemoryDB.ts` -tiedoston abstraktointi. Alun perin se oli vain exportattu taulukko, mutta muutin sen exporttaamaan `db`-objektin selkeillä metodeilla. Tämä estää taulukon suoran manipuloinnin ja antaa selkeän rajapinnan. Tästä on myös se hyöty, että jos myöhemmin halutaan vaihtaa tilalle oikea tietokanta, se onnistuu paljon helpommin ilman, että sovelluksen logiikkaa täytyy sen kummemmin muuttaa.

## Yhteenveto

Projekti oli hyvä osoitus tekoälyn vahvuuksista ja heikkouksista. Tekoäly voi tehostaa työntekoa huomattavasti, ja se on parhaimmillaan juuri nopeiden "proof of concept" -kokonaisuuksien luomisessa sekä rutiininomaisissa tehtävissä. Se ei kuitenkaan ole itsenäinen kehittäjä eikä korvaa ihmisen asiantuntemusta. Kuten tässäkin huomasi, kriittisiä yksityiskohtia ja poikkeustapauksia (edge caseja) jäi huomioimatta. Ehkä tärkein oppi onkin se, ettei tekoälyn tuottamaa koodia kannata aina ottaa täysin sokeana vastaan. Kehittäjän on aina ymmärrettävä ja arvioitava kriittisesti, mitä tekoäly on tuottanut.
