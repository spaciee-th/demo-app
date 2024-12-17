import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants';


console.log('Supabase URL:', process.env.EXPO_PUBLIC_REACT_NATIVE_SUPABASE_URL);
if (!process.env.EXPO_PUBLIC_REACT_NATIVE_SUPABASE_ANON_KEY || !process.env.EXPO_PUBLIC_REACT_NATIVE_SUPABASE_URL) {
    throw new Error('Missing Supabase credentials');
}




export const supabase = createClient(process.env.EXPO_PUBLIC_REACT_NATIVE_SUPABASE_URL, process.env.EXPO_PUBLIC_REACT_NATIVE_SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})