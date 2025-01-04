import { supabase } from "@/integrations/supabase/client";
import { TestUserFormValues } from "./types";

export const useLocalUser = () => {
  const createLocalUser = async (values: TestUserFormValues, wpUserId: number) => {
    console.log('Creando usuario local...');
    const { error } = await supabase
      .from('users')
      .insert({
        wordpress_user_id: wpUserId,
        username: values.username,
        email: values.email,
        account_status: 'active',
        email_verified: false,
      });

    if (error) {
      console.error('Error Supabase:', error);
      throw error;
    }
  };

  return { createLocalUser };
};