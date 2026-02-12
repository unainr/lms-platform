import {
	boolean,
	integer,
	json,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const courses = pgTable("courses", {
	id: uuid("id").primaryKey().defaultRandom(),

	title: varchar("title", { length: 255 }).notNull(),
	description: varchar("description", { length: 2000 }),

	bannerImage: varchar("banner_image", { length: 500 }),

	createdBy: varchar("created_by", { length: 255 }).notNull(),
	// Clerk userId

	isPublished: boolean("is_published").default(false),

	createdAt: timestamp("created_at").defaultNow(),
});

export const chapters = pgTable("chapters", {
	id: uuid("id").primaryKey().defaultRandom(),

	courseId: uuid("course_id")
		.notNull()
		.references(() => courses.id),

	title: varchar("title", { length: 255 }).notNull(),

	content: text("content"),

	order: integer("order"),

	createdAt: timestamp("created_at").defaultNow(),
});

export const exercises = pgTable("exercises", {
	id: uuid("id").primaryKey().defaultRandom(),

	chapterId: uuid("chapter_id")
		.notNull()
		.references(() => chapters.id),

	exerciseData: json("exercise_data").notNull(),
	// FULL AI structured object

	order: integer("order"),

	createdAt: timestamp("created_at").defaultNow(),
});

export const enrollments = pgTable("enrollments", {
	id: uuid("id").primaryKey().defaultRandom(),

	userId: varchar("user_id", { length: 255 }).notNull(),
	// Clerk ID

	courseId: uuid("course_id")
		.notNull()
		.references(() => courses.id),

	createdAt: timestamp("created_at").defaultNow(),
});

export const exerciseProgress = pgTable("exercise_progress", {
	id: uuid("id").primaryKey().defaultRandom(),

	userId: varchar("user_id", { length: 255 }).notNull(),

	exerciseId: uuid("exercise_id")
		.notNull()
		.references(() => exercises.id),

	completed: boolean("completed").default(false),

	completedAt: timestamp("completed_at"),
});
