import { supabase } from '../lib/supabase';

// Elimina campos de solo lectura generados por Supabase antes de insert/update
const READONLY = ['id', 'created_at', 'updated_at'];
function strip(obj) {
  const clean = { ...obj };
  READONLY.forEach(k => delete clean[k]);
  return clean;
}

// ── TESTIMONIALS ──────────────────────────────────────────────────────────────

export async function getAllTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createTestimonial(payload) {
  const { data, error } = await supabase
    .from('testimonials')
    .insert([strip(payload)])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateTestimonial(id, updates) {
  const { data, error } = await supabase
    .from('testimonials')
    .update(strip(updates))
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteTestimonial(id) {
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ── SITE SETTINGS ─────────────────────────────────────────────────────────────

export async function getSiteSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .order('key');
  if (error) throw new Error(error.message);
  // Convertir array [{key,value}] a objeto {key: value}
  return Object.fromEntries((data ?? []).map(r => [r.key, r.value]));
}

export async function upsertSiteSetting(key, value) {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) throw new Error(error.message);
}

// ── SOCIAL LINKS ──────────────────────────────────────────────────────────────

export async function getAllSocialLinks() {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('id');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateSocialLink(id, updates) {
  const { data, error } = await supabase
    .from('social_links')
    .update(strip(updates))
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createSocialLink(payload) {
  const { data, error } = await supabase
    .from('social_links')
    .insert([strip(payload)])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSocialLink(id) {
  const { error } = await supabase.from('social_links').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
