DROP FUNCTION IF EXISTS public.get_all_venues();

CREATE OR REPLACE FUNCTION public.get_all_venues()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT 
      jsonb_agg(
        jsonb_build_object(
          'venue_id', v.venue_id,
          'name', v.name,
          'coordinates', CASE 
            WHEN v.location IS NOT NULL THEN 
              ARRAY[ST_X(v.location), ST_Y(v.location)]
            ELSE 
              ARRAY[57.5522, -20.3484]
          END,
          'phone_number', v.phone_number,
          'email_address', v.email_address,
          'admins', v.admins,
          'courts', v.courts,
          'photo_gallery', v.photo_gallery,
          'website_url', v.website_url,
          'opening_hours', v.opening_hours
        )
      )
    FROM 
      public.venues v
    ORDER BY 
      v.name ASC
  );
END;
$$;