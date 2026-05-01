-- ========== ROLES ==========
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Admins read roles" ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ========== ALLOWED EMAILS WHITELIST ==========
CREATE TABLE public.allowed_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.allowed_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage whitelist" ON public.allowed_emails FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ========== AUTO-CONFIRM SIGNUP TRIGGER (bootstrap admin + whitelist enforcement) ==========
CREATE OR REPLACE FUNCTION public.handle_new_portal_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth
AS $$
DECLARE
  v_admin_count INT;
  v_is_allowed BOOLEAN;
BEGIN
  SELECT COUNT(*) INTO v_admin_count FROM public.user_roles WHERE role = 'admin';

  IF v_admin_count = 0 THEN
    -- Bootstrap: first user becomes admin and gets whitelisted
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
    INSERT INTO public.allowed_emails (email) VALUES (LOWER(NEW.email))
      ON CONFLICT (email) DO NOTHING;
  ELSE
    -- Subsequent users must be in whitelist
    SELECT EXISTS(SELECT 1 FROM public.allowed_emails WHERE email = LOWER(NEW.email))
      INTO v_is_allowed;
    IF NOT v_is_allowed THEN
      RAISE EXCEPTION 'Correo no autorizado para acceder al portal';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_portal
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_portal_user();

-- ========== FOLDERS ==========
CREATE TABLE public.folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  parent_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_path TEXT,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_folders_parent ON public.folders(parent_id);
CREATE INDEX idx_folders_owner ON public.folders(owner_id);

CREATE POLICY "Owner reads folders" ON public.folders FOR SELECT
  USING (auth.uid() = owner_id);
CREATE POLICY "Owner inserts folders" ON public.folders FOR INSERT
  WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner updates folders" ON public.folders FOR UPDATE
  USING (auth.uid() = owner_id);
CREATE POLICY "Owner deletes folders" ON public.folders FOR DELETE
  USING (auth.uid() = owner_id);

-- ========== PHOTOS ==========
CREATE TABLE public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  folder_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  title TEXT,
  caption TEXT,
  width INT,
  height INT,
  size_bytes BIGINT,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_photos_folder ON public.photos(folder_id);
CREATE INDEX idx_photos_owner ON public.photos(owner_id);

CREATE POLICY "Owner reads photos" ON public.photos FOR SELECT
  USING (auth.uid() = owner_id);
CREATE POLICY "Owner inserts photos" ON public.photos FOR INSERT
  WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner updates photos" ON public.photos FOR UPDATE
  USING (auth.uid() = owner_id);
CREATE POLICY "Owner deletes photos" ON public.photos FOR DELETE
  USING (auth.uid() = owner_id);

-- ========== UPDATED_AT TRIGGER ==========
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_folders_updated BEFORE UPDATE ON public.folders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ========== STORAGE BUCKET (PRIVATE) ==========
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', false);

CREATE POLICY "Owner reads own files" ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Owner uploads own files" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Owner updates own files" ON storage.objects FOR UPDATE
  USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Owner deletes own files" ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);