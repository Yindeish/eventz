import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../config/firebase';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const sub = onAuthStateChanged(auth, setUser);
    return sub;
  }, []);

  return user;
}
