-- 1) Make storage bucket public for read
UPDATE storage.buckets SET public = true WHERE id = 'portfolio';

-- Public read policy on storage objects for the portfolio bucket
DROP POLICY IF EXISTS "Public read portfolio" ON storage.objects;
CREATE POLICY "Public read portfolio"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio');

-- Only admins can upload/update/delete in the portfolio bucket
DROP POLICY IF EXISTS "Admins write portfolio" ON storage.objects;
CREATE POLICY "Admins write portfolio"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update portfolio" ON storage.objects;
CREATE POLICY "Admins update portfolio"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete portfolio" ON storage.objects;
CREATE POLICY "Admins delete portfolio"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));

-- 2) Folders: public read, admin write
DROP POLICY IF EXISTS "Owner reads folders" ON public.folders;
DROP POLICY IF EXISTS "Owner inserts folders" ON public.folders;
DROP POLICY IF EXISTS "Owner updates folders" ON public.folders;
DROP POLICY IF EXISTS "Owner deletes folders" ON public.folders;

CREATE POLICY "Public reads folders"
  ON public.folders FOR SELECT
  USING (true);

CREATE POLICY "Admins insert folders"
  ON public.folders FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND auth.uid() = owner_id);

CREATE POLICY "Admins update folders"
  ON public.folders FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete folders"
  ON public.folders FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- 3) Photos: public read, admin write
DROP POLICY IF EXISTS "Owner reads photos" ON public.photos;
DROP POLICY IF EXISTS "Owner inserts photos" ON public.photos;
DROP POLICY IF EXISTS "Owner updates photos" ON public.photos;
DROP POLICY IF EXISTS "Owner deletes photos" ON public.photos;

CREATE POLICY "Public reads photos"
  ON public.photos FOR SELECT
  USING (true);

CREATE POLICY "Admins insert photos"
  ON public.photos FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND auth.uid() = owner_id);

CREATE POLICY "Admins update photos"
  ON public.photos FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete photos"
  ON public.photos FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));