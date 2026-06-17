/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,userId]` on the table `WorkspaceMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Widget" (
    "id" SERIAL NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "layout" JSONB NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceMember_workspaceId_userId_key" ON "WorkspaceMember"("workspaceId", "userId");

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
