export const ALLOWED_LANGUAGES = new Set(["en", "de", "hr"]);

const TRANSLATIONS = {
  "Personalizacija izgleda": { en: "Appearance customization", de: "Darstellung anpassen" },
  "Podesi target po svom ukusu. Promjene odmah vidiš u pregledu.": { en: "Customize the target to your taste. Changes appear instantly in the preview.", de: "Passe das Target nach deinem Geschmack an. Änderungen erscheinen sofort in der Vorschau." },
  "Jezik sučelja": { en: "Interface language", de: "Sprache der Oberfläche" },
  "Zatvori postavke": { en: "Close settings", de: "Einstellungen schließen" },
  "PREGLED UŽIVO": { en: "LIVE PREVIEW", de: "LIVE-VORSCHAU" },
  "Tvoj target": { en: "Your target", de: "Dein Target" },
  "Aktivno": { en: "Active", de: "Aktiv" },
  "Broj testnih tabli": { en: "Preview option count", de: "Anzahl der Testoptionen" },
  "Broj testnih opcija": { en: "Number of preview options", de: "Anzahl der Vorschauoptionen" },
  "Reset": { en: "Reset", de: "Zurücksetzen" },
  "Vrati": { en: "Reset", de: "Zurücksetzen" },
  "Set testnih tabli": { en: "Preview option set", de: "Testoptionssatz" },
  "Interakcije": { en: "Interactions", de: "Interaktionen" },
  "Posao": { en: "Job", de: "Beruf" },
  "Vozilo": { en: "Vehicle", de: "Fahrzeug" },
  "Skladište": { en: "Storage", de: "Lager" },
  "Custom nazivi": { en: "Custom labels", de: "Eigene Beschriftungen" },
  "Vlastiti nazivi": { en: "Custom labels", de: "Eigene Beschriftungen" },
  "Meni, Skladište, Smjena...": { en: "Menu, Storage, Shift...", de: "Menü, Lager, Schicht..." },
  "Povuci table u previewu gdje ih želiš postaviti.": { en: "Drag the options in the preview to place them where you want.", de: "Ziehe die Optionen in der Vorschau an die gewünschte Position." },
  "Sve postavke su samo tvoje i spremaju se lokalno.": { en: "All settings are personal and saved locally.", de: "Alle Einstellungen sind persönlich und werden lokal gespeichert." },
  "IKONICA": { en: "ICON", de: "SYMBOL" },
  "Odaberi target znak": { en: "Choose the target symbol", de: "Target-Symbol auswählen" },
  "Izvor target znaka": { en: "Target symbol source", de: "Quelle des Target-Symbols" },
  "Ponuđene": { en: "Presets", de: "Vorlagen" },
  "FA klasa": { en: "FA class", de: "FA-Klasse" },
  "PNG link": { en: "PNG link", de: "PNG-Link" },
  "Target ikonica": { en: "Target icon", de: "Target-Symbol" },
  "Oko": { en: "Eye", de: "Auge" },
  "Nišan": { en: "Crosshair", de: "Fadenkreuz" },
  "Meta": { en: "Bullseye", de: "Zielscheibe" },
  "Pokazivač": { en: "Pointer", de: "Zeiger" },
  "Lokacija": { en: "Location", de: "Position" },
  "Kompas": { en: "Compass", de: "Kompass" },
  "Kaubojski šešir": { en: "Cowboy hat", de: "Cowboyhut" },
  "Zvijezda": { en: "Star", de: "Stern" },
  "Lubanja": { en: "Skull", de: "Totenkopf" },
  "Font Awesome klasa": { en: "Font Awesome class", de: "Font-Awesome-Klasse" },
  "Primjer:": { en: "Example:", de: "Beispiel:" },
  "ili": { en: "or", de: "oder" },
  "HTTPS link do PNG/WebP/GIF slike": { en: "HTTPS link to a PNG/WebP/GIF image", de: "HTTPS-Link zu einem PNG-/WebP-/GIF-Bild" },
  "Veličina slike": { en: "Image size", de: "Bildgröße" },
  "Zaobljena slika": { en: "Rounded image", de: "Abgerundetes Bild" },
  "Koristi direktan HTTPS link. Ako se slika ne može učitati, prikazat će se zadana ikonica.": { en: "Use a direct HTTPS link. If the image cannot load, the default icon will be shown.", de: "Verwende einen direkten HTTPS-Link. Falls das Bild nicht geladen werden kann, wird das Standardsymbol angezeigt." },
  "OBLIK TABLE": { en: "OPTION SHAPE", de: "OPTIONSFORM" },
  "Forma svake opcije": { en: "Shape of each option", de: "Form jeder Option" },
  "Oblik target tabli": { en: "Target option shape", de: "Form der Target-Optionen" },
  "Standard": { en: "Standard", de: "Standard" },
  "Kapsula": { en: "Pill", de: "Kapsel" },
  "Compact": { en: "Compact", de: "Kompakt" },
  "Kompaktna": { en: "Compact", de: "Kompakt" },
  "Oštra": { en: "Sharp", de: "Scharf" },
  "Split icon": { en: "Split icon", de: "Geteiltes Symbol" },
  "Floating": { en: "Floating", de: "Schwebend" },
  "Odvojena ikona": { en: "Split icon", de: "Geteiltes Symbol" },
  "Lebdeća": { en: "Floating", de: "Schwebend" },
  "Ulaznica": { en: "Ticket", de: "Ticket" },
  "Rezani kutovi": { en: "Cut corners", de: "Geschnittene Ecken" },
  "Dupli okvir": { en: "Double frame", de: "Doppelrahmen" },
  "Soft panel": { en: "Soft panel", de: "Weiches Panel" },
  "Mekana": { en: "Soft panel", de: "Weiches Panel" },
  "Bočna traka": { en: "Side stripe", de: "Seitenstreifen" },
  "Značka": { en: "Badge", de: "Abzeichen" },
  "STIL TABA": { en: "OPTION STYLE", de: "OPTIONSSTIL" },
  "Izgled opcija": { en: "Option appearance", de: "Darstellung der Optionen" },
  "Stil target opcija": { en: "Target option style", de: "Stil der Target-Optionen" },
  "Transparentan": { en: "Transparent", de: "Transparent" },
  "Čist i jasan": { en: "Clean and clear", de: "Klar und deutlich" },
  "Bez viška": { en: "No clutter", de: "Ohne Ballast" },
  "Svjetleći rub": { en: "Glowing edge", de: "Leuchtender Rand" },
  "Skoro proziran": { en: "Almost transparent", de: "Fast transparent" },
  "RedM stil": { en: "RedM style", de: "RedM-Stil" },
  "Hladni stakleni ton": { en: "Cool glass tone", de: "Kühler Glaston" },
  "Tamna tekstura": { en: "Dark texture", de: "Dunkle Textur" },
  "Luksuzni zlatni rub": { en: "Luxury gold edge", de: "Luxuriöser Goldrand" },
  "Crveni naglasak": { en: "Crimson accent", de: "Karmesinroter Akzent" },
  "Vrlo lagana pozadina": { en: "Very light background", de: "Sehr leichter Hintergrund" },
  "Zeleni digitalni stil": { en: "Green digital style", de: "Grüner Digitalstil" },
  "RASPORED": { en: "LAYOUT", de: "ANORDNUNG" },
  "Pozicije opcija oko targeta": { en: "Option positions around the target", de: "Positionen der Optionen um das Target" },
  "Raspored opcija": { en: "Option arrangement", de: "Anordnung der Optionen" },
  "Lista": { en: "List", de: "Liste" },
  "Klasični tab": { en: "Classic option list", de: "Klassische Optionsliste" },
  "Križ": { en: "Cross", de: "Kreuz" },
  "Gore, dolje, lijevo, desno": { en: "Up, down, left, right", de: "Oben, unten, links, rechts" },
  "Krug": { en: "Circle", de: "Kreis" },
  "Ravnomjerno oko targeta": { en: "Evenly around the target", de: "Gleichmäßig um das Target" },
  "Luk": { en: "Arc", de: "Bogen" },
  "Sredina gore, rubovi dolje": { en: "Center high, edges low", de: "Mitte oben, Ränder unten" },
  "Lepeza": { en: "Fan", de: "Fächer" },
  "Polukrug s desne strane": { en: "Semicircle on the right", de: "Halbkreis auf der rechten Seite" },
  "Naizmjenično lijevo i desno": { en: "Alternating left and right", de: "Abwechselnd links und rechts" },
  "Custom": { en: "Custom", de: "Benutzerdefiniert" },
  "Ručno": { en: "Custom", de: "Benutzerdefiniert" },
  "Povuci svaku tablu ručno": { en: "Drag each option manually", de: "Jede Option manuell ziehen" },
  "Udaljenost od targeta": { en: "Distance from target", de: "Abstand zum Target" },
  "Boja naglaska": { en: "Accent color", de: "Akzentfarbe" },
  "Druga boja": { en: "Second color", de: "Zweite Farbe" },
  "Boja teksta": { en: "Text color", de: "Textfarbe" },
  "Pozadina": { en: "Background", de: "Hintergrund" },
  "Pozicija linearnog taba": { en: "Linear option position", de: "Position der linearen Optionen" },
  "Desno": { en: "Right", de: "Rechts" },
  "Lijevo": { en: "Left", de: "Links" },
  "Ispod": { en: "Below", de: "Unten" },
  "Pregled prijelaza boja": { en: "Color transition preview", de: "Vorschau des Farbübergangs" },
  "Debljina ruba": { en: "Border thickness", de: "Randstärke" },
  "Zaobljenje": { en: "Corner radius", de: "Abrundung" },
  "Širina taba": { en: "Option width", de: "Optionsbreite" },
  "Veličina UI-a": { en: "UI size", de: "UI-Größe" },
  "Visina opcije": { en: "Option height", de: "Optionshöhe" },
  "Prozirnost": { en: "Opacity", de: "Deckkraft" },
  "ANIMACIJE": { en: "ANIMATIONS", de: "ANIMATIONEN" },
  "Pokret i izmjena boja": { en: "Motion and color transitions", de: "Bewegung und Farbwechsel" },
  "Vrsta animacije": { en: "Animation type", de: "Animationstyp" },
  "Pulse krug": { en: "Pulse ring", de: "Pulsierender Ring" },
  "Disanje": { en: "Breathing", de: "Atmen" },
  "Rotacija": { en: "Rotation", de: "Drehung" },
  "Poskakivanje": { en: "Bounce", de: "Hüpfen" },
  "Pomicanje lijevo-desno": { en: "Wiggle left and right", de: "Links-rechts-Wackeln" },
  "Okretanje 3D": { en: "3D flip", de: "3D-Drehung" },
  "Orbita": { en: "Orbit", de: "Umlaufbahn" },
  "Bez pokreta": { en: "No motion", de: "Keine Bewegung" },
  "Izmjena dvije boje": { en: "Two-color transition", de: "Zweifarbiger Wechsel" },
  "Glatki prijelaz": { en: "Smooth transition", de: "Weicher Übergang" },
  "Brza izmjena": { en: "Quick switch", de: "Schneller Wechsel" },
  "Tekući gradijent": { en: "Flowing gradient", de: "Fließender Verlauf" },
  "Val kroz table": { en: "Wave through options", de: "Welle durch Optionen" },
  "Dvobojni sjaj": { en: "Two-color glow", de: "Zweifarbiger Schein" },
  "Rubni puls": { en: "Border pulse", de: "Randpuls" },
  "Brzina animacije": { en: "Animation speed", de: "Animationsgeschwindigkeit" },
  "DIJELJENJE": { en: "SHARING", de: "TEILEN" },
  "Kopiraj ili uvezi izgled": { en: "Copy or import an appearance", de: "Darstellung kopieren oder importieren" },
  "Kod postavki": { en: "Settings code", de: "Einstellungscode" },
  "OX1: zalijepi kod ovdje...": { en: "OX1: paste the code here...", de: "OX1: Code hier einfügen..." },
  "Kopiraj kod": { en: "Copy code", de: "Code kopieren" },
  "Uvezi kod": { en: "Import code", de: "Code importieren" },
  "Pošalji kopirani kod drugom igraču. Uvezeni izgled postaje trajan tek kada klikneš Spremi promjene.": { en: "Send the copied code to another player. An imported appearance becomes permanent only after clicking Save Changes.", de: "Sende den kopierten Code an einen anderen Spieler. Eine importierte Darstellung wird erst dauerhaft, nachdem du auf Änderungen speichern geklickt hast." },
  "Glow efekt": { en: "Glow effect", de: "Leuchteffekt" },
  "Svjetlosni efekt": { en: "Glow effect", de: "Leuchteffekt" },
  "Svjetlo oko target ikonice": { en: "Light around the target icon", de: "Licht um das Target-Symbol" },
  "Animacije": { en: "Animations", de: "Animationen" },
  "Glatki ulaz i hover efekti": { en: "Smooth entrance and hover effects", de: "Weiche Einblend- und Hover-Effekte" },
  "Glatki ulaz i efekti prelaska": { en: "Smooth entrance and hover effects", de: "Weiche Einblend- und Hover-Effekte" },
  "Dvije boje": { en: "Two colors", de: "Zwei Farben" },
  "Izmjenjuje naglasak i drugu boju": { en: "Alternates the accent and second color", de: "Wechselt zwischen Akzent- und Zweitfarbe" },
  "Brojevi opcija": { en: "Option numbers", de: "Optionsnummern" },
  "Prikaži redni broj desno": { en: "Show the sequence number on the right", de: "Reihenfolge rechts anzeigen" },
  "Postavke možeš otvoriti bilo kada": { en: "Open settings at any time", de: "Einstellungen jederzeit öffnen" },
  "Vrati zadano": { en: "Restore defaults", de: "Standard wiederherstellen" },
  "Postavi kao server zadano": { en: "Set as server default", de: "Als Serverstandard festlegen" },
  "Spremi promjene": { en: "Save changes", de: "Änderungen speichern" },
  "Postavke spremljene": { en: "Settings saved", de: "Einstellungen gespeichert" },
  "Interakcija": { en: "Interaction", de: "Interaktion" },
  "Otvori vrata": { en: "Open door", de: "Tür öffnen" },
  "Pregledaj": { en: "Inspect", de: "Untersuchen" },
  "Spremi predmet": { en: "Store item", de: "Gegenstand einlagern" },
  "Razgovaraj": { en: "Talk", de: "Sprechen" },
  "Posebna radnja": { en: "Special action", de: "Spezialaktion" },
  "Završi smjenu": { en: "End shift", de: "Schicht beenden" },
  "Otvori skladište posla": { en: "Open job storage", de: "Berufslager öffnen" },
  "Otvori poslovni meni": { en: "Open job menu", de: "Berufsmenü öffnen" },
  "Pregledaj zadatke": { en: "View tasks", de: "Aufgaben ansehen" },
  "Preuzmi plaću": { en: "Collect salary", de: "Gehalt abholen" },
  "Upravljanje radnicima": { en: "Manage workers", de: "Mitarbeiter verwalten" },
  "Pregledaj vozilo": { en: "Inspect vehicle", de: "Fahrzeug untersuchen" },
  "Otvori prtljažnik": { en: "Open trunk", de: "Kofferraum öffnen" },
  "Zaključaj vozilo": { en: "Lock vehicle", de: "Fahrzeug abschließen" },
  "Popravi vozilo": { en: "Repair vehicle", de: "Fahrzeug reparieren" },
  "Očisti vozilo": { en: "Clean vehicle", de: "Fahrzeug reinigen" },
  "Smjesti osobu": { en: "Seat person", de: "Person hineinsetzen" },
  "Otvori skladište": { en: "Open storage", de: "Lager öffnen" },
  "Uzmi predmet": { en: "Take item", de: "Gegenstand nehmen" },
  "Pregledaj sadržaj": { en: "Inspect contents", de: "Inhalt ansehen" },
  "Zaključaj sanduk": { en: "Lock container", de: "Behälter abschließen" },
  "Podijeli pristup": { en: "Share access", de: "Zugriff teilen" },
  "Custom raspored za {count} tabli je vraćen": { en: "Custom layout for {count} options has been reset", de: "Benutzerdefinierte Anordnung für {count} Optionen wurde zurückgesetzt" },
  "Vraćene su zadane vrijednosti — klikni Spremi": { en: "Defaults restored — click Save", de: "Standardwerte wiederhergestellt — klicke auf Speichern" },
  "Postavke su spremljene": { en: "Settings have been saved", de: "Einstellungen wurden gespeichert" },
  "Postavke nije moguće spremiti": { en: "Settings could not be saved", de: "Einstellungen konnten nicht gespeichert werden" },
  "Kod postavki je kopiran": { en: "Settings code copied", de: "Einstellungscode kopiert" },
  "Kod je spreman — pritisni Ctrl+C": { en: "Code is ready — press Ctrl+C", de: "Code ist bereit — drücke Strg+C" },
  "Kod je uvezen — klikni Spremi promjene": { en: "Code imported — click Save Changes", de: "Code importiert — klicke auf Änderungen speichern" },
  "Neispravan kod postavki": { en: "Invalid settings code", de: "Ungültiger Einstellungscode" },
  "Server zadani izgled je spremljen": { en: "Server default appearance saved", de: "Serverstandard-Darstellung gespeichert" },
  "Nemaš ovlasti za server zadani izgled": { en: "You do not have permission to change the server default", de: "Du hast keine Berechtigung, den Serverstandard zu ändern" },
  "Server zadani izgled nije moguće spremiti": { en: "Server default appearance could not be saved", de: "Serverstandard-Darstellung konnte nicht gespeichert werden" },
};

const originalTextNodes = new WeakMap();
const originalAttributes = new WeakMap();

export function translate(key, language = "en", replacements = {}) {
  const safeLanguage = ALLOWED_LANGUAGES.has(language) ? language : "en";
  let value = safeLanguage === "hr" ? key : TRANSLATIONS[key]?.[safeLanguage] || key;

  Object.entries(replacements).forEach(([name, replacement]) => {
    value = value.replaceAll(`{${name}}`, String(replacement));
  });

  return value;
}

export function translateInterface(root, language) {
  if (!root) return;
  document.documentElement.lang = ALLOWED_LANGUAGES.has(language) ? language : "en";
  const walker = document.createTreeWalker(root, window.NodeFilter.SHOW_TEXT);
  const nodes = [];

  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    if (node.parentElement?.closest("#preview-options")) return;
    const raw = node.nodeValue || "";
    const match = raw.match(/^(\s*)(.*?)(\s*)$/s);
    const visible = match?.[2] || "";
    if (!originalTextNodes.has(node)) originalTextNodes.set(node, visible);
    const original = originalTextNodes.get(node);
    node.nodeValue = `${match?.[1] || ""}${translate(original, language)}${match?.[3] || ""}`;
  });

  root.querySelectorAll("[aria-label], [placeholder], [title]").forEach((element) => {
    let values = originalAttributes.get(element);
    if (!values) {
      values = {};
      originalAttributes.set(element, values);
    }

    ["aria-label", "placeholder", "title"].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      if (!(attribute in values)) values[attribute] = element.getAttribute(attribute);
      element.setAttribute(attribute, translate(values[attribute], language));
    });
  });
}
