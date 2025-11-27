import admin from "firebase-admin";
import xlsx from "xlsx";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Load Excel
const workbook = xlsx.readFile("Abra Evolution Line Collection.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

(async () => {
  for (let i = 4; i < rows.length; i++) {
    const [hasCard, title, number, set, variant, date] = rows[i];

    if (!title || title === "Card Title") continue;

    const id = `${title}-${set}-${number}`
      .toLowerCase()
      .replace(/\s+/g, "-");

    await db.collection("cards").doc(id).set({
      name: title,
      cardNumber: number,
      set,
      variant,
      releaseDate: date || null,
      imageUrl: null
    });

    console.log(`Uploaded card: ${title}`);
  }

  console.log("Done!");
})();
