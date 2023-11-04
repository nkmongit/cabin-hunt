import supabase from './supabase';

export async function addguest({
  fullName,
  email,
  nationalID,
  nationality,
  countryFlag,
  phone,
}) {
  const { data, error } = await supabase
    .from('guests')
    .insert([
      {
        fullName: fullName,
        email: email,
        nationalID: nationalID,
        nationality: nationality,
        countryFlag: countryFlag,
        phone: phone,
      },
    ])
    .select();

  if (error) throw new Error(error.message);

  return data;
}
