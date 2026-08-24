import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";


const AuthContext = createContext();


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    /*
     * Get the currently logged-in user.
     */

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      setLoading(false);
    };


    getUser();


    /*
     * Listen for login/logout/signup events.
     */

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );


    return () => {
      subscription.unsubscribe();
    };
  }, []);


  /*
   * Sign up
   */

  const signUp = async (email, password) => {
    return await supabase.auth.signUp({
      email,
      password,
    });
  };


  /*
   * Login
   */

  const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };


  /*
   * Logout
   */

  const signOut = async () => {
    return await supabase.auth.signOut();
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  return useContext(AuthContext);
}