-- AlterTable
CREATE SEQUENCE activity_priority_seq;
ALTER TABLE "Activity" ALTER COLUMN "priority" SET DEFAULT nextval('activity_priority_seq');
ALTER SEQUENCE activity_priority_seq OWNED BY "Activity"."priority";
