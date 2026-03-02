-- Performance indexes for high-cardinality filters
CREATE INDEX IF NOT EXISTS "CveEntry_cveId_idx" ON "CveEntry"("cveId");
CREATE INDEX IF NOT EXISTS "CveEntry_language_idx" ON "CveEntry"("language");
CREATE INDEX IF NOT EXISTS "AffiliateSale_affiliateRef_idx" ON "AffiliateSale"("affiliateRef");
CREATE INDEX IF NOT EXISTS "LocalizedRunbook_language_idx" ON "LocalizedRunbook"("language");
