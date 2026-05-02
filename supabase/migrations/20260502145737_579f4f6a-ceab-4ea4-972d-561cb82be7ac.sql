REVOKE EXECUTE ON FUNCTION public.handle_new_portal_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
-- has_role still needs to be callable by authenticated for RLS contexts via SQL — but RLS evaluates as function owner so revoking from authenticated is safe
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;