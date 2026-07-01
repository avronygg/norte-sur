-- ============================================================================
--  Norte Sur · Seed de datos iniciales
--  Productos extraídos del sitio actual (huaipesypanos.cl).
--  Por defecto en modalidad 'quote' (cotización). Cambia sale_mode a 'direct'
--  y asigna `price` + `stock` desde el admin para venderlos online.
--  Ejecutar DESPUÉS de schema.sql.
-- ============================================================================

insert into categories (name, slug, description, sort_order) values
  ('Huaipes', 'huaipes', 'Huaipes industriales de alta absorción para limpieza de máquinas, herramientas y superficies.', 1),
  ('Paños',   'panos',   'Paños de algodón, franela y jersey para limpieza fina y pulido.', 2),
  ('Trapos',  'trapos',  'Trapos industriales de jersey para uso general en taller.', 3)
on conflict (slug) do nothing;

-- Huaipes
insert into products (name, slug, short_description, material, category_id, sale_mode, unit, is_featured, sort_order)
select v.name, v.slug, v.short_description, 'Huaipe',
       (select id from categories where slug = 'huaipes'),
       'quote', 'kg', v.featured, v.ord
from (values
  ('Hilacha Blanca Capa', 'hilacha-blanca-capa', 'Hilacha blanca de capa, alta absorción para limpieza general.', true, 1),
  ('Hilacha Fina Blanca', 'hilacha-fina-blanca', 'Hilacha fina blanca, ideal para superficies delicadas.', false, 2),
  ('Hilacha Color', 'hilacha-color', 'Hilacha de color para limpieza pesada en taller.', false, 3),
  ('Huaipe Mecánico Blanco', 'huaipe-mecanico-blanco', 'Huaipe mecánico blanco, absorción de aceites y grasas.', true, 4),
  ('Huaipe Mecánico Blanco Especial', 'huaipe-mecanico-blanco-especial', 'Versión especial de mayor rendimiento.', false, 5),
  ('Huaipe Mecánico Color', 'huaipe-mecanico-color', 'Huaipe mecánico de color, uso industrial general.', false, 6),
  ('Huaipe Seda Blanco', 'huaipe-seda-blanco', 'Huaipe seda blanco, suave y de alta absorción.', false, 7)
) as v(name, slug, short_description, featured, ord)
on conflict (slug) do nothing;

-- Paños
insert into products (name, slug, short_description, material, category_id, sale_mode, unit, is_featured, sort_order)
select v.name, v.slug, v.short_description, 'Paño',
       (select id from categories where slug = 'panos'),
       'quote', 'kg', v.featured, v.ord
from (values
  ('Paño Algodón Color', 'pano-algodon-color', 'Paño de algodón de color para limpieza y pulido.', true, 1),
  ('Paño Franela Blanca Gris', 'pano-franela-blanca-gris', 'Paño de franela blanca/gris, suave para acabados.', false, 2),
  ('Paño Jersey Color', 'pano-jersey-color', 'Paño de jersey de color, versátil y resistente.', false, 3)
) as v(name, slug, short_description, featured, ord)
on conflict (slug) do nothing;

-- Trapos
insert into products (name, slug, short_description, material, category_id, sale_mode, unit, is_featured, sort_order)
select v.name, v.slug, v.short_description, 'Trapo',
       (select id from categories where slug = 'trapos'),
       'quote', 'kg', v.featured, v.ord
from (values
  ('Jersey Blanco', 'jersey-blanco', 'Trapo de jersey blanco para uso general en taller.', false, 1)
) as v(name, slug, short_description, featured, ord)
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
--  Ejemplos: algunos como COMPRA DIRECTA (precio + stock) y fotos en blancos.
--  Editable luego desde el panel admin. Precios de ejemplo.
-- ----------------------------------------------------------------------------
update products set sale_mode = 'direct', price = 4490, stock = 80  where slug = 'hilacha-blanca-capa';
update products set sale_mode = 'direct', price = 3990, stock = 120 where slug = 'huaipe-mecanico-blanco';
update products set sale_mode = 'direct', price = 5990, stock = 60  where slug = 'pano-algodon-color';
update products set sale_mode = 'direct', price = 3490, stock = 150 where slug = 'jersey-blanco';

-- Por ahora, todos los productos usan la misma foto de ejemplo.
update products set images = array['/img/huaipe-blanco.png'] where id is not null;
