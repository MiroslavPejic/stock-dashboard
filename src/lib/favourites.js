import { supabase } from "./supabase";


/*
 * Get all favourites for the currently
 * logged-in user.
 */
export async function getFavourites() {

  const {
    data,
    error,
  } = await supabase
    .from("favourites")
    .select("*")
    .order("created_at", {
      ascending: false,
    });


  if (error) {

    console.error(
      "Error fetching favourites:",
      error
    );

    return {
      data: [],
      error,
    };
  }


  return {
    data,
    error: null,
  };
}


/*
 * Add a stock to the current user's
 * favourites.
 */
export async function addFavourite(symbol) {

  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser();


  if (!user) {

    return {
      data: null,
      error: new Error(
        "You must be logged in to add favourites."
      ),
    };
  }


  const {
    data,
    error,
  } = await supabase
    .from("favourites")
    .insert({
      user_id: user.id,
      symbol: symbol.toUpperCase(),
    })
    .select()
    .single();


  if (error) {

    console.error(
      "Error adding favourite:",
      error
    );

    return {
      data: null,
      error,
    };
  }


  return {
    data,
    error: null,
  };
}


/*
 * Remove a stock from the current user's
 * favourites.
 */
export async function removeFavourite(symbol) {

  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser();


  if (!user) {

    return {
      error: new Error(
        "You must be logged in to remove favourites."
      ),
    };
  }


  const {
    error,
  } = await supabase
    .from("favourites")
    .delete()
    .eq("user_id", user.id)
    .eq("symbol", symbol.toUpperCase());


  if (error) {

    console.error(
      "Error removing favourite:",
      error
    );

    return {
      error,
    };
  }


  return {
    error: null,
  };
}


/*
 * Check whether a particular stock is
 * already a favourite.
 */
export async function isFavourite(symbol) {

  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser();


  if (!user) {
    return false;
  }


  const {
    data,
    error,
  } = await supabase
    .from("favourites")
    .select("id")
    .eq("user_id", user.id)
    .eq("symbol", symbol.toUpperCase())
    .maybeSingle();


  if (error) {

    console.error(
      "Error checking favourite:",
      error
    );

    return false;
  }


  return Boolean(data);
}