import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const channels = pgTable("channels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  description: text("description"),
  specs: json("specs").notNull().$type<{
    fileSize: { max: number; unit: string };
    dimensions: { width: number; height: number; aspectRatio?: string }[];
    format: string[];
    requirements: string[];
  }>(),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  channelId: varchar("channel_id").notNull().references(() => channels.id),
  config: json("config").notNull().$type<{
    requiredAssets: string[];
    defaultSettings: Record<string, any>;
    features: string[];
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  channelId: varchar("channel_id").notNull().references(() => channels.id),
  templateId: varchar("template_id").references(() => templates.id),
  config: json("config").notNull().$type<{
    headline: string;
    subheadline: string;
    ctaText: string;
    colors: { text: string; primary: string };
    gameSettings: Record<string, any>;
    dimensions: { width: number; height: number };
  }>(),
  assets: json("assets").notNull().$type<{
    logo?: string;
    background?: string;
    customSymbols?: string[];
    jackpots?: any[];
    endCardImage?: string;
  }>(),
  status: varchar("status", { length: 20 }).default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertChannelSchema = createInsertSchema(channels);
export const insertTemplateSchema = createInsertSchema(templates);
export const insertProjectSchema = createInsertSchema(projects);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Channel = typeof channels.$inferSelect;
export type Template = typeof templates.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type InsertChannel = z.infer<typeof insertChannelSchema>;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
