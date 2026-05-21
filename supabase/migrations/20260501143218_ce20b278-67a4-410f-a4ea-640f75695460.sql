DROP POLICY IF EXISTS "Owner reads folders" ON public.folders;
DROP POLICY IF EXISTS "Owner inserts folders" ON public.folders;
DROP POLICY IF EXISTS "Owner updates folders" ON public.folders;
DROP POLICY IF EXISTS "Owner deletes folders" ON public.folders;

CREATE POLICY "Admins manage folders"
ON public.folders
FOR ALL
TO authenticated
USING (
    auth.uid() = owner_id
    OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
    auth.uid() = owner_id
    OR public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Owner reads photos" ON public.photos;
DROP POLICY IF EXISTS "Owner inserts photos" ON public.photos;
DROP POLICY IF EXISTS "Owner updates photos" ON public.photos;
DROP POLICY IF EXISTS "Owner deletes photos" ON public.photos;

CREATE POLICY "Admins manage photos"
ON public.photos
FOR ALL
TO authenticated
USING (
    auth.uid() = owner_id
    OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
    auth.uid() = owner_id
    OR public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Owner reads own files" ON storage.objects;
DROP POLICY IF EXISTS "Owner uploads own files" ON storage.objects;
DROP POLICY IF EXISTS "Owner updates own files" ON storage.objects;
DROP POLICY IF EXISTS "Owner deletes own files" ON storage.objects;

CREATE POLICY "Admins manage storage"
ON storage.objects
FOR ALL
TO authenticated
USING (
    bucket_id = 'portfolio'
    AND (
        auth.uid()::text = (storage.foldername(name))[1]
        OR public.has_role(auth.uid(), 'admin')
    )
)
WITH CHECK (
    bucket_id = 'portfolio'
    AND (
        auth.uid()::text = (storage.foldername(name))[1]
        OR public.has_role(auth.uid(), 'admin')
    )
);

INSERT INTO public.user_roles (user_id, role)
SELECT
    id,
    'admin'::app_role
FROM auth.users
WHERE LOWER(email) IN (
    'hosmirydiaz1@gmail.com',
    'hosmmerdiaz22@gmail.com'
)
ON CONFLICT DO NOTHING;
