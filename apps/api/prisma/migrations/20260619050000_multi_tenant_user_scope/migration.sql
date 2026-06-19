-- Multi-tenant: cada usuário possui seus próprios clientes e produtos

ALTER TABLE "Client" ADD COLUMN "userId" TEXT;
ALTER TABLE "Product" ADD COLUMN "userId" TEXT;

UPDATE "Client"
SET "userId" = (SELECT "id" FROM "User" ORDER BY "createdAt" ASC LIMIT 1)
WHERE "userId" IS NULL;

UPDATE "Product"
SET "userId" = (SELECT "id" FROM "User" ORDER BY "createdAt" ASC LIMIT 1)
WHERE "userId" IS NULL;

ALTER TABLE "Client" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "Product" ALTER COLUMN "userId" SET NOT NULL;

DROP INDEX "Client_document_key";
CREATE UNIQUE INDEX "Client_userId_document_key" ON "Client"("userId", "document");
CREATE INDEX "Client_userId_idx" ON "Client"("userId");
CREATE INDEX "Product_userId_idx" ON "Product"("userId");

ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
