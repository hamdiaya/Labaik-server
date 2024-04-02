const supabase = require('../config/database');
const moment = require('moment');
const hadjInfo={
   addHadjInfo:async(year,total_places,la_date_de_tirage,heure_de_tirage,algorithm)=>{
    try {
        // Execute the query to retrieve the sum
        const { data, error } = await supabase
          .from('wilayas')
          .select('nombre_des_habitants');
        if (error) {
          return "Error fetching total habitants:";
        }
    
        if (data.length === 0) {
          return 'No data found in wilayas table.';
        }
        if (data) {
            let totalHabitants = 0;
            // Iterate over each row in the result set
            data.forEach(row => {
              // Assuming `nombre_des_habitants` is a numeric value in each row
              totalHabitants += row.nombre_des_habitants;
            });
          
            try {
                // Insert hadj data into the 'hadj_info' table
                const formattedDate = moment(la_date_de_tirage, 'YYYY-MM-DD').format('YYYY-MM-DD');
                const { data, error } = await supabase.from('hadj_info').insert([{year: year,total_places:total_places, la_date_de_tirage: formattedDate,heure_de_tirage:heure_de_tirage,nombre_des_habitants_total:totalHabitants.toString(),algorithm:algorithm}]);
        
                if (error) {
                    return error;
                }
                console.log(data);
                return data;
               
            } catch (error) {
                console.error('Error adding info:', error);
                return error;
            }
          }
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    
   },

  setHadjFormule:async(year)=>{
  try {
    // Fetch the hadj_info row for the specified year
    const { data, error } = await supabase
      .from('hadj_info')
      .select('*')
      .eq('year', year);
    if (error) {
      console.error('Error fetching hadj_info:', error);
      return 'Error fetching hadj_info';
    }
    if (data.length === 0) {
      console.warn('No hadj_info found for year:', year);
      return "No hadj_info found for year";
    }
    const row = data[0];
    const totalHabitants = row.nombre_des_habitants_total;
    const totalPlaces = row.total_places;
 if (totalHabitants==null){
    return 'total habitants must be initilized';
 }
    // Calculate formula based on your requirement (places per 1000 habitants)
    const formula = Math.round(totalHabitants/totalPlaces );

    // Update the formule attribute in the hadj_info table
    const { updateData, updateError } = await supabase
      .from('hadj_info')
      .update({ formule:formula.toString()})
      .eq('id', row.id);
    if (updateError) {
      console.error('Error updating formule:', updateError);
      return 'Error updating formule:';
    }
    return 'Formule updated successfully for year';
  } catch (error) {
    console.error('Unexpected error:', error);
  }
},
// Replace with your Supabase URL

 updatePlacesDisponiblesOfCommune:async(year)=> {
    try {
      // Retrieve formula for the specified year
      const { data: formulaData, error: formulaError } = await supabase
        .from('hadj_info')
        .select('formule')
        .eq('year', year);
  
      if (formulaError) {
        console.error('Error fetching formula:', formulaError);
        return 'Error fetching formula:';
      }
  
      if (formulaData.length === 0) {
        console.warn('No formula found for year:', year);
        return 'No formula found for year:';
      }
  
      const formula = formulaData[0].formule;
  
      // Fetch communes data
      const { data: communesData, error: communesError } = await supabase
        .from('communes')
        .select('*');
  
      if (communesError) {
        console.error('Error fetching communes data:', communesError);
        return;
      }
  
      // Calculate updated values
      if (communesData) {
        // Iterate over each row in the result set
        communesData.forEach( async row => {
          const {data2, error}=await supabase
          .from('communes')
          .update({nombre_des_places_dispo:Math.floor(row.nombre_des_habitants/formula)})
          .eq('id',row.id);
       if(error){
        return 'error';
       }
        });
      return 'Places disponibles updated successfully for year:';
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  },
  updatePlacesDisponiblesOfWilaya:async()=>{
   
    try {
const { data:communesData,error:communesError}=await supabase
.from('communes')
.select('*');
if(communesError){
  return 'error fetching communes';
}
if(communesData){
  const { data: wilayaData, error:wilayaError } = await supabase
  .from('wilayas')
  .select('*');
  if(wilayaError){
    return 'error fetchings wilayas data';
  }
  if(wilayaData){
    wilayaData.forEach(async row => {
     let places=0;
         communesData.forEach(async c=>{
          if (c.wilaya_code==row.wilaya_code){
            places=places+c.nombre_des_places_dispo;
          }
         });
         const {data:updatedWilayasData,error:updatedWilayasError}=await supabase
         .from('wilayas')
         .update({nombre_des_places_dispo:places})
         .eq('wilaya_code',row.wilaya_code);
         if(updatedWilayasError){
          return 'error updating places in wilaya';
         }
    });
     return 'wilayas places updated';
  }
}
      
    } catch (error) {
        console.error('Unexpected error:', error.message);
        return 'Unexpected error';
    }
},
getCommunes:async(wilaya_code)=>{
try {
  const {data,error}=await supabase
  .from('communes')
  .select('id,commune_name,nombre_des_places_dispo')
  .eq('wilaya_code',wilaya_code);
  if(error){
    return "error fetching communes";
  }
  return data;
} catch (error) {
  return "error";
}
},
getHadjInfo:async(year)=>{
  try {
    const {data,error}=await supabase
    .from('hadj_info')
    .select('*')
    .eq('year',year);

    if(error){
      return "error";
    }
    console.log(data)
    if(!data||data.length==0){
      return 'hadj info not found';
    }
    
    return data;
  } catch (error) {
    return 'error';
  }
}



  }

  

  


module.exports=hadjInfo