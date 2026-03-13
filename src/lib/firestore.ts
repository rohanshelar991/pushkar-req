import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { CandidateForm } from "./types";

const COLLECTION_NAME = "submissions";
const DEFAULT_TIMEOUT_MS = 15000;

export async function saveCandidate(
  form: CandidateForm,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
) {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("timeout")), timeoutMs);
  });

  await Promise.race([
    addDoc(collection(db, COLLECTION_NAME), {
      ...form,
      createdAt: serverTimestamp(),
    }),
    timeoutPromise,
  ]);
}

export type StoredCandidate = CandidateForm & { createdAt?: Timestamp };

export async function fetchCandidates(): Promise<StoredCandidate[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as StoredCandidate);
}
