-- CreateTable
CREATE TABLE "budgets" (
    "id" SERIAL NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "type" VARCHAR(7) NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budgets_pkey" PRIMARY KEY ("id")
);
