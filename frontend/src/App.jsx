import { useEffect, useState } from "react";
import { auth, provider, db } from "./firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  onSnapshot,
  doc,
  setDoc
} from "firebase/firestore";

export default function App() {
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [ownership, setOwnership] = useState({});

  // Watch auth state
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  // Load all cards
  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, "cards"));
      setCards(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    })();
  }, []);

  // Load ownership for logged-in user
  useEffect(() => {
    if (!user) return;

    return onSnapshot(
      collection(db, "users", user.uid, "ownership"),
      (snap) => {
        const map = {};
        snap.forEach((d) => (map[d.id] = d.data().hasCard));
        setOwnership(map);
      }
    );
  }, [user]);

  const toggleCard = async (cardId, current) => {
    await setDoc(
      doc(db, "users", user.uid, "ownership", cardId),
      { hasCard: !current },
      { merge: true }
    );
  };

  if (!user) {
    return (
      <div className="center">
        <button onClick={() => signInWithPopup(auth, provider)}>
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>{user.displayName}’s Pokémon Collection</h1>

      <div className="grid">
        {cards.map((c) => {
          const has = ownership[c.id] || false;

          return (
            <div className="card" key={c.id}>
              {c.imageUrl && <img src={c.imageUrl} alt={c.name} />}
              <h2>{c.name}</h2>
              <p>
                {c.set} — #{c.cardNumber}
              </p>

              <label className="owned">
                <input
                  type="checkbox"
                  checked={has}
                  onChange={() => toggleCard(c.id, has)}
                />
                Owned
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
