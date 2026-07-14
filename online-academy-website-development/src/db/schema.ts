import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums
export const userRoleEnum = pgEnum("user_role", ["student", "teacher", "admin"]);
export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "approved",
  "rejected",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "submitted",
  "verified",
  "rejected",
]);
export const courseStatusEnum = pgEnum("course_status", ["active", "inactive", "upcoming"]);
export const classTypeEnum = pgEnum("class_type", ["discord", "google_meet", "online"]);
export const enrollmentStatusEnum = pgEnum("enrollment_status", [
  "active",
  "completed",
  "dropped",
]);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default("student"),
  phone: varchar("phone", { length: 50 }),
  avatar: text("avatar"),
  bio: text("bio"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }),
  color: varchar("color", { length: 50 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Courses table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  shortDescription: varchar("short_description", { length: 500 }),
  categoryId: integer("category_id").references(() => categories.id),
  teacherId: integer("teacher_id").references(() => users.id),
  fee: decimal("fee", { precision: 10, scale: 2 }).notNull().default("0"),
  duration: varchar("duration", { length: 100 }),
  level: varchar("level", { length: 50 }).default("Beginner"),
  thumbnail: text("thumbnail"),
  status: courseStatusEnum("status").notNull().default("active"),
  classType: classTypeEnum("class_type").notNull().default("google_meet"),
  classLink: text("class_link"),
  schedule: text("schedule"),
  maxStudents: integer("max_students").default(50),
  syllabus: text("syllabus"),
  requirements: text("requirements"),
  totalEnrolled: integer("total_enrolled").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Student applications
export const studentApplications = pgTable("student_applications", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => users.id),
  courseId: integer("course_id").references(() => courses.id),
  status: applicationStatusEnum("status").notNull().default("pending"),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default("pending"),
  paymentProof: text("payment_proof"),
  paymentMethod: varchar("payment_method", { length: 100 }),
  transactionId: varchar("transaction_id", { length: 255 }),
  notes: text("notes"),
  adminNotes: text("admin_notes"),
  appliedAt: timestamp("applied_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Teacher applications
export const teacherApplications = pgTable("teacher_applications", {
  id: serial("id").primaryKey(),
  applicantId: integer("applicant_id").references(() => users.id),
  proposedCourseTitle: varchar("proposed_course_title", { length: 255 }).notNull(),
  proposedCourseDescription: text("proposed_course_description").notNull(),
  qualifications: text("qualifications").notNull(),
  experience: text("experience"),
  classType: classTypeEnum("class_type").notNull().default("google_meet"),
  classLink: text("class_link"),
  proposedFee: decimal("proposed_fee", { precision: 10, scale: 2 }),
  status: applicationStatusEnum("status").notNull().default("pending"),
  adminNotes: text("admin_notes"),
  appliedAt: timestamp("applied_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Enrollments table
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => users.id),
  courseId: integer("course_id").references(() => courses.id),
  applicationId: integer("application_id").references(() => studentApplications.id),
  status: enrollmentStatusEnum("status").notNull().default("active"),
  enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Announcements
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").references(() => users.id),
  isPublished: boolean("is_published").notNull().default(true),
  isPinned: boolean("is_pinned").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Contact messages
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
