import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export type tCollection = 'user' | 'event' | 'post' | 'trending' | 'feeds' | 'ticket' | 'message' | 'community' | 'comment' | 'like' | 'share' | 'save' | 'going' | 'commentlike';

export const Db = <T>(path: tCollection) => {
  const ref = () => collection(db, path);

  return {
    create: (data: T) => addDoc(ref(), data as any),

    getAll: async () => {
      const snapshot = await getDocs(ref());
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as (T & { id: string })[];
    },
    // getAll: async () => {
    //   const q = query(ref(), orderBy('createdAt', 'desc'));
    //   const snapshot = await getDocs(q);
    //   return snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as (T & { id: string })[];
    // },

    getSome: async (count: number) => {
      const q = query(
        ref(),
        orderBy('createdAt', 'desc'),
        limit(count)
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as (T & { id: string })[];
    },



    getById: async (id: string) => {
      const snapshot = await getDoc(doc(db, path, id));
      return { id: snapshot.id, ...snapshot.data() } as T & { id: string };
    },

    // findByField: async <K extends keyof T>(
    //   field: K,
    //   value: T[K]
    // ) => {
    //   const q = query(
    //     ref(),
    //     where(field as string, '==', value)
    //   );

    //   const snapshot = await getDocs(q);

    //   return snapshot.docs.map(d => ({
    //     id: d.id,
    //     ...d.data(),
    //   })) as (T & { id: string })[];
    // },
    findByField: async <K extends keyof T>(
      field: K,
      value: T[K]
    ) => {
      const q = query(
        ref(),
        where(field as string, '==', value),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as (T & { id: string })[];
    },


    findOneByField: async <K extends keyof T>(
      field: K,
      value: T[K]
    ) => {
      const q = query(
        ref(),
        where(field as string, '==', value)
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;

      const docSnap = snapshot.docs[0];
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as T & { id: string };
    },

    update: (id: string, data: Partial<T>) =>
      updateDoc(doc(db, path, id), data as any),

    delete: (id: string) =>
      deleteDoc(doc(db, path, id)),
  };
};


// export class Db<T> {
//   constructor(private path: string) {}

//   private ref() {
//     return collection(db, this.path);
//   }

//   async create(data: T) {
//     return await addDoc(this.ref(), data as any);
//   }

//   async getAll() {
//     const snapshot = await getDocs(this.ref());
//     return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
//   }

//   async getById(id: string) {
//     const snapshot = await getDoc(doc(db, this.path, id));
//     return { id: snapshot.id, ...snapshot.data() };
//   }

//   async update(id: string, data: Partial<T>) {
//     return updateDoc(doc(db, this.path, id), data as any);
//   }

//   async delete(id: string) {
//     return deleteDoc(doc(db, this.path, id));
//   }
// }
