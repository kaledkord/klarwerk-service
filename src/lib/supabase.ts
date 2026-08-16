import { createClient } from '@supabase/supabase-js';

// Fallback-Werte, damit die App auch OHNE gesetzte Umgebungsvariablen rendert
// (z. B. in Cloud-Vorschauen wie StackBlitz/Bolt oder vor dem Setzen der Netlify-Env-Vars).
// In Produktion überschreiben die echten VITE_SUPABASE_* Variablen diese Platzhalter –
// erst dann funktioniert das Kontaktformular tatsächlich.
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://placeholder.supabase.co';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'public-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
