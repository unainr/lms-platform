import {
	boolean,
	integer,
	json,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
	primaryKey,
} from "drizzle-orm/pg-core";

// =======================
// COURSES
// =======================
export const courses = pgTable("courses", {
	id: uuid("id").primaryKey().defaultRandom(),

	title: varchar("title", { length: 255 }).notNull(),
	description: varchar("description", { length: 2000 }),
	bannerImage: varchar("banner_image", { length: 500 }),

	createdBy: varchar("created_by", { length: 255 }).notNull(), // Clerk ID

	isPublished: boolean("is_published").default(false),
	createdAt: timestamp("created_at").defaultNow(),
});

// =======================
// CHAPTERS
// =======================
export const chapters = pgTable("chapters", {
	id: uuid("id").primaryKey().defaultRandom(),

	courseId: uuid("course_id")
		.notNull()
		.references(() => courses.id, { onDelete: "cascade" }),

	title: varchar("title", { length: 255 }).notNull(),
	content: text("content"),
	order: integer("order"),

	createdAt: timestamp("created_at").defaultNow(),
});

// =======================
// EXERCISES (AI)
// =======================
export const exercises = pgTable("exercises", {
	id: uuid("id").primaryKey().defaultRandom(),

	chapterId: uuid("chapter_id")
		.notNull()
		.references(() => chapters.id, { onDelete: "cascade" }),

	exerciseData: json("exercise_data").notNull(), // AI payload
	order: integer("order"),

	createdAt: timestamp("created_at").defaultNow(),
});

// =======================
// ENROLLMENTS
// =======================
export const enrollments = pgTable(
  "enrollments",
  {
    userId: varchar("user_id", { length: 255 }).notNull(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.courseId] }),
  ]
);


// =======================
// EXERCISE PROGRESS
// =======================
export const exerciseProgress = pgTable(
  "exercise_progress",
  {
    userId: varchar("user_id", { length: 255 }).notNull(),
    exerciseId: uuid("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    completed: boolean("completed").default(false),
    completedAt: timestamp("completed_at"),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.exerciseId] }),
  ]
);

