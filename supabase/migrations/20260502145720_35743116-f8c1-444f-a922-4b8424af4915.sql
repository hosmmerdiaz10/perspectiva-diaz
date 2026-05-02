-- Remove the auto-bootstrap trigger; only pre-authorized emails can register
DROP TRIGGER IF EXISTS on_auth_user_created_portal ON auth.users;

-- Replace the function with a strict whitelist gate (no bootstrap).
CREATE OR REPLACE FUNCTION public.handle_new_portal_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $function$
DECLARE
  v_is_allowed BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.allowed_emails WHERE email = LOWER(NEW.email)
  ) INTO v_is_allowed;

  IF NOT v_is_allowed THEN
    RAISE EXCEPTION 'Correo no autorizado para acceder al portal';
  END IF;

  -- Auto-grant admin role if email is whitelisted as admin
  IF EXISTS(
    SELECT 1 FROM public.allowed_emails
    WHERE email = LOWER(NEW.email) AND COALESCE(is_admin, false) = true
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;

-- Add admin flag to whitelist
ALTER TABLE public.allowed_emails
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created_portal
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_portal_user();

-- Clear old whitelist and seed only the two authorized emails as admins
DELETE FROM public.allowed_emails;
INSERT INTO public.allowed_emails (email, is_admin) VALUES
  ('hosmirydiaz1@gmail.com', true),
  ('hosmmerdiaz22@gmail.com', true);

-- Promote any existing auth users matching these emails to admin
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role
FROM auth.users u
WHERE LOWER(u.email) IN ('hosmirydiaz1@gmail.com', 'hosmmerdiaz22@gmail.com')
ON CONFLICT DO NOTHING;