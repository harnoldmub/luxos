import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  interest: text("interest").notNull(),
  message: text("message"),
  source: text("source").notNull().default("site"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
