const supabase = require("../config/database");
const moment = require("moment");
const hadjInfo = {
  addHadjInfo: async (
    year,
    total_places,
    la_date_de_tirage,
    heure_de_tirage,
    algorithm
  ) => {
    try {
      // Insert hadj data into the 'hadj_info' table
      const formattedDate = moment(la_date_de_tirage, "YYYY-MM-DD").format(
        "YYYY-MM-DD"
      );
      const { data, error } = await supabase.from("hadj_info").insert([
        {
          year: year,
          total_places: total_places,
          la_date_de_tirage: formattedDate,
          heure_de_tirage: heure_de_tirage,
          algorithm: algorithm,
        },
      ]);

      if (error) {
        return error;
      }
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error adding info:", error);
      return error;
    }
  },

  setHadjFormule: async (year) => {
    try {
      // Fetch the hadj_info row for the specified year
      const { data, error } = await supabase
        .from("hadj_info")
        .select("*")
        .eq("year", year);
      if (error) {
        console.error("Error fetching hadj_info:", error);
        return "Error fetching hadj_info";
      }
      if (data.length === 0) {
        console.warn("No hadj_info found for year:", year);
        return "No hadj_info found for year";
      }
      const row = data[0];
      const totalHabitants = row.nombre_des_habitants_total;
      const totalPlaces = row.total_places;
      if (totalHabitants == null) {
        return "total habitants must be initilized";
      }
      // Calculate formula based on your requirement (places per 1000 habitants)
      const formula = Math.round(totalHabitants / totalPlaces);

      // Update the formule attribute in the hadj_info table
      const { updateData, updateError } = await supabase
        .from("hadj_info")
        .update({ formule: formula.toString() })
        .eq("id", row.id);
      if (updateError) {
        console.error("Error updating formule:", updateError);
        return "Error updating formule:";
      }
      return "Formule updated successfully for year";
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  },
  // Replace with your Supabase URL

  updatePlacesDisponiblesOfCommune: async (nombre_des_habitants, places) => {
    try {
      // Retrieve formula for the specified year
      // Fetch communes data
      const { data: communesData, error: communesError } = await supabase
        .from("communes")
        .select("*")
        .order("nombre_des_habitants", { ascending: false });

      if (communesError) {
        console.error("Error fetching communes data:", communesError);
        return "Error fetching communes data:";
      }

      const { default: pLimit } = await import("p-limit");
      const limit = pLimit(80);

      // Calculate updated values
      if (communesData) {
        // Iterate over each row in the result set
        let x = 0;
        const a = [];
        communesData.map((c) => {
          var nombre_des_places_dispo = Math.floor(
            (c.nombre_des_habitants * places) / nombre_des_habitants
          );
          x += nombre_des_places_dispo;
          return a.push(nombre_des_places_dispo);
        });
        let d = places - x;
        console.log("nombre_des_habitants :", nombre_des_habitants);
        console.log("places :", places);
        console.log("d :", d);
        console.log("a :", a);
        console.log("x :", x);
        const n = [];
        for (i = 0; i < 1541; i++) {
          if (d > 0) {
            n.push(a[i] + 1);
            d--;
          } else {
            n.push(a[i]);
          }
        }
        const requests = n.map((e, i) =>
          limit(() =>
            supabase
              .from("communes")
              .update({
                nombre_des_places_dispo: e,
              })
              .eq("id", communesData[i].id)
          )
        );
        console.log("n :", n);
        const response = await Promise.all(requests);
        if (response.some((r) => r.error !== null)) {
          return "error";
        }
        return "Places disponibles updated successfully for year:";
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  },
  updatePlacesDisponiblesOfWilaya: async () => {
    try {
      const { data: communesData, error: communesError } = await supabase
        .from("communes")
        .select("*");
      if (communesError) {
        return "error fetching communes";
      }
      if (communesData) {
        const { data: wilayaData, error: wilayaError } = await supabase
          .from("wilayas")
          .select("*");
        if (wilayaError) {
          return "error fetchings wilayas data";
        }
        if (wilayaData) {
          const requests = wilayaData.map((w) => {
            let places = communesData.reduce((t, c) => {
              return c.wilaya_code === w.wilaya_code
                ? (t += c.nombre_des_places_dispo)
                : t;
            }, 0);
            return supabase
              .from("wilayas")
              .update({ nombre_des_places_dispo: places })
              .eq("wilaya_code", w.wilaya_code);
          });

          const response = await Promise.all(requests);
          return "wilayas places updated";
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      return "Unexpected error";
    }
  },
  getCommunes: async (wilaya_code) => {
    try {
      const { data, error } = await supabase
        .from("communes")
        .select("id,commune_name,nombre_des_places_dispo")
        .eq("wilaya_code", wilaya_code);
      if (error) {
        return "error fetching communes";
      }
      return data;
    } catch (error) {
      return "error";
    }
  },
  getHadjInfo: async (year) => {
    try {
      const { data, error } = await supabase
        .from("hadj_info")
        .select("*")
        .eq("year", year);

      if (error) {
        return "error";
      }

      if (!data || data.length == 0) {
        return "hadj info not found";
      }

      return data;
    } catch (error) {
      return "error";
    }
  },

  getTotalHabitants: async () => {
    const { data, error } = await supabase
      .from("wilayas")
      .select("nombre_des_habitants");

    if (error) {
      console.log(error);
      return "Error fetching total habitants:";
    }

    if (data.length === 0) {
      return "No data found in wilayas table.";
    }
    console.log(data);
    if (data) {
      let totalHabitants = 0;
      // Iterate over each row in the result set
      data.forEach((row) => {
        // Assuming nombre_des_habitants is a numeric value in each row
        totalHabitants += row.nombre_des_habitants;
      });
      return totalHabitants;
    }
  },
};

module.exports = hadjInfo;
