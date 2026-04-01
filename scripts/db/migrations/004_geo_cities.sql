CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS geo_cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_de TEXT NOT NULL,
  name_en TEXT NOT NULL,
  country_code TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 50 CHECK (priority >= 1 AND priority <= 100),
  population INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_geo_cities_active_priority ON geo_cities (is_active, priority DESC);
CREATE INDEX IF NOT EXISTS idx_geo_cities_country ON geo_cities (country_code);

CREATE OR REPLACE FUNCTION set_geo_cities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_geo_cities_updated_at ON geo_cities;
CREATE TRIGGER trg_geo_cities_updated_at
BEFORE UPDATE ON geo_cities
FOR EACH ROW
EXECUTE FUNCTION set_geo_cities_updated_at();

INSERT INTO geo_cities (slug, name_de, name_en, country_code, priority, population, is_active) VALUES
  ('berlin', 'Berlin', 'Berlin', 'DE', 100, 3769000, TRUE),
  ('munich', 'Muenchen', 'Munich', 'DE', 95, 1565000, TRUE),
  ('hamburg', 'Hamburg', 'Hamburg', 'DE', 93, 1910000, TRUE),
  ('frankfurt', 'Frankfurt am Main', 'Frankfurt', 'DE', 92, 776000, TRUE),
  ('cologne', 'Koeln', 'Cologne', 'DE', 88, 1087000, TRUE),
  ('stuttgart', 'Stuttgart', 'Stuttgart', 'DE', 84, 632000, TRUE),
  ('dusseldorf', 'Duesseldorf', 'Dusseldorf', 'DE', 82, 629000, TRUE),
  ('dortmund', 'Dortmund', 'Dortmund', 'DE', 75, 595000, TRUE),
  ('essen', 'Essen', 'Essen', 'DE', 72, 584000, TRUE),
  ('leipzig', 'Leipzig', 'Leipzig', 'DE', 73, 624000, TRUE),
  ('bremen', 'Bremen', 'Bremen', 'DE', 69, 569000, TRUE),
  ('dresden', 'Dresden', 'Dresden', 'DE', 70, 566000, TRUE),
  ('hanover', 'Hannover', 'Hanover', 'DE', 67, 548000, TRUE),
  ('nuremberg', 'Nuernberg', 'Nuremberg', 'DE', 66, 525000, TRUE),
  ('duisburg', 'Duisburg', 'Duisburg', 'DE', 64, 503000, TRUE),
  ('bochum', 'Bochum', 'Bochum', 'DE', 58, 365000, TRUE),
  ('wuppertal', 'Wuppertal', 'Wuppertal', 'DE', 56, 354000, TRUE),
  ('bonn', 'Bonn', 'Bonn', 'DE', 61, 333000, TRUE),
  ('mannheim', 'Mannheim', 'Mannheim', 'DE', 57, 318000, TRUE),
  ('karlsruhe', 'Karlsruhe', 'Karlsruhe', 'DE', 55, 313000, TRUE),
  ('vienna', 'Wien', 'Vienna', 'AT', 90, 2000000, TRUE),
  ('zurich', 'Zuerich', 'Zurich', 'CH', 87, 443000, TRUE),
  ('geneva', 'Genf', 'Geneva', 'CH', 76, 203000, TRUE),
  ('basel', 'Basel', 'Basel', 'CH', 68, 177000, TRUE),
  ('paris', 'Paris', 'Paris', 'FR', 94, 2161000, TRUE),
  ('lyon', 'Lyon', 'Lyon', 'FR', 74, 522000, TRUE),
  ('marseille', 'Marseille', 'Marseille', 'FR', 71, 877000, TRUE),
  ('london', 'London', 'London', 'GB', 96, 8980000, TRUE),
  ('amsterdam', 'Amsterdam', 'Amsterdam', 'NL', 79, 918000, TRUE),
  ('brussels', 'Bruessel', 'Brussels', 'BE', 77, 186000, TRUE),
  ('madrid', 'Madrid', 'Madrid', 'ES', 83, 3223000, TRUE),
  ('barcelona', 'Barcelona', 'Barcelona', 'ES', 81, 1620000, TRUE),
  ('milan', 'Mailand', 'Milan', 'IT', 78, 1366000, TRUE),
  ('rome', 'Rom', 'Rome', 'IT', 80, 2748000, TRUE),
  ('warsaw', 'Warschau', 'Warsaw', 'PL', 65, 1794000, TRUE),
  ('prague', 'Prag', 'Prague', 'CZ', 63, 1310000, TRUE),
  ('newyork', 'New York', 'New York', 'US', 89, 8337000, TRUE)
ON CONFLICT (slug) DO UPDATE SET
  name_de = EXCLUDED.name_de,
  name_en = EXCLUDED.name_en,
  country_code = EXCLUDED.country_code,
  priority = EXCLUDED.priority,
  population = EXCLUDED.population,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
