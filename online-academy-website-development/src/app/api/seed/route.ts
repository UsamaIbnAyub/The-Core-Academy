import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, categories, courses, announcements } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST() {
  try {
    // Check if already seeded
    const existing = await db.select().from(users).where(eq(users.email, "admin@tca.edu")).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ message: "Already seeded" });
    }

    const adminPass = await hashPassword("admin123");
    const teacherPass = await hashPassword("teacher123");

    // Create admin
    const [admin] = await db
      .insert(users)
      .values({
        name: "Admin TCA",
        email: "admin@tca.edu",
        password: adminPass,
        role: "admin",
        bio: "Academy Administrator",
      })
      .returning();

    // Create sample teachers
    const [teacher1] = await db
      .insert(users)
      .values({
        name: "Dr. Ahmed Khan",
        email: "ahmed@tca.edu",
        password: teacherPass,
        role: "teacher",
        bio: "PhD in Computer Science with 10+ years of teaching experience",
        phone: "+92-300-1234567",
      })
      .returning();

    const [teacher2] = await db
      .insert(users)
      .values({
        name: "Prof. Sara Ali",
        email: "sara@tca.edu",
        password: teacherPass,
        role: "teacher",
        bio: "Mathematics expert and certified educator with 8 years experience",
        phone: "+92-321-9876543",
      })
      .returning();

    // Create categories
    const [catIT] = await db
      .insert(categories)
      .values({
        name: "Information Technology",
        description: "Computer science, programming, and tech courses",
        icon: "💻",
        color: "#3B82F6",
      })
      .returning();

    const [catMath] = await db
      .insert(categories)
      .values({
        name: "Mathematics",
        description: "Pure and applied mathematics",
        icon: "📐",
        color: "#8B5CF6",
      })
      .returning();

    const [catLang] = await db
      .insert(categories)
      .values({
        name: "Languages",
        description: "English and other language courses",
        icon: "📚",
        color: "#10B981",
      })
      .returning();

    const [catScience] = await db
      .insert(categories)
      .values({
        name: "Science",
        description: "Physics, Chemistry, Biology",
        icon: "🔬",
        color: "#F59E0B",
      })
      .returning();

    // Create courses
    await db.insert(courses).values([
      {
        title: "Web Development Bootcamp",
        description:
          "Master full-stack web development from scratch. Learn HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects and become job-ready.",
        shortDescription: "Complete web dev course from beginner to professional",
        categoryId: catIT.id,
        teacherId: teacher1.id,
        fee: "15000",
        duration: "6 Months",
        level: "Beginner",
        status: "active",
        classType: "google_meet",
        classLink: "https://meet.google.com/tca-webdev",
        schedule: "Monday, Wednesday, Friday - 7:00 PM to 9:00 PM PKT",
        maxStudents: 30,
        syllabus:
          "HTML5 & CSS3, JavaScript ES6+, React.js, Node.js, Express.js, MongoDB, PostgreSQL, Deployment",
        requirements: "Basic computer knowledge, Laptop with internet connection",
        totalEnrolled: 18,
      },
      {
        title: "Python Programming",
        description:
          "Learn Python programming from basics to advanced. Cover data structures, algorithms, web scraping, automation, and introduction to machine learning.",
        shortDescription: "Python from zero to hero - complete course",
        categoryId: catIT.id,
        teacherId: teacher1.id,
        fee: "12000",
        duration: "4 Months",
        level: "Beginner",
        status: "active",
        classType: "discord",
        classLink: "https://discord.gg/tca-python",
        schedule: "Tuesday, Thursday - 6:00 PM to 8:00 PM PKT",
        maxStudents: 40,
        syllabus:
          "Python Basics, Data Structures, OOP, File Handling, Web Scraping, Automation, Libraries",
        requirements: "No prior programming experience needed",
        totalEnrolled: 25,
      },
      {
        title: "Calculus & Linear Algebra",
        description:
          "Comprehensive mathematics course covering calculus and linear algebra for engineering and science students. Problem-solving focused approach.",
        shortDescription: "Advanced math for engineering and science students",
        categoryId: catMath.id,
        teacherId: teacher2.id,
        fee: "10000",
        duration: "5 Months",
        level: "Intermediate",
        status: "active",
        classType: "google_meet",
        classLink: "https://meet.google.com/tca-math",
        schedule: "Saturday, Sunday - 10:00 AM to 12:00 PM PKT",
        maxStudents: 35,
        syllabus: "Limits, Derivatives, Integration, Matrices, Vectors, Eigenvalues",
        requirements: "O-Level Mathematics or equivalent",
        totalEnrolled: 20,
      },
      {
        title: "IELTS Preparation",
        description:
          "Complete IELTS preparation course with expert guidance. Master all four modules: Listening, Reading, Writing, and Speaking. Target band 7+.",
        shortDescription: "Achieve your target IELTS band score",
        categoryId: catLang.id,
        teacherId: teacher2.id,
        fee: "8000",
        duration: "3 Months",
        level: "Intermediate",
        status: "active",
        classType: "google_meet",
        classLink: "https://meet.google.com/tca-ielts",
        schedule: "Monday to Friday - 5:00 PM to 6:30 PM PKT",
        maxStudents: 20,
        syllabus: "Listening Strategies, Reading Comprehension, Writing Task 1 & 2, Speaking Fluency",
        requirements: "Basic English communication skills",
        totalEnrolled: 15,
      },
      {
        title: "Data Science & Analytics",
        description:
          "Learn data science using Python, Pandas, NumPy, Matplotlib, and Machine Learning basics. Work on real datasets and build data-driven solutions.",
        shortDescription: "From data to insights - complete data science course",
        categoryId: catIT.id,
        teacherId: teacher1.id,
        fee: "18000",
        duration: "6 Months",
        level: "Advanced",
        status: "upcoming",
        classType: "discord",
        classLink: "https://discord.gg/tca-datascience",
        schedule: "Wednesday, Saturday - 7:00 PM to 9:30 PM PKT",
        maxStudents: 25,
        syllabus:
          "Python for Data Science, Pandas, NumPy, Data Visualization, Statistics, ML Basics",
        requirements: "Basic Python knowledge recommended",
        totalEnrolled: 0,
      },
    ]);

    // Create announcement
    await db.insert(announcements).values([
      {
        title: "Welcome to The Core Academy!",
        content:
          "We are excited to launch our online learning platform. Explore our courses and start your learning journey today. Apply for admission and join our growing community of learners!",
        authorId: admin.id,
        isPinned: true,
      },
      {
        title: "New Courses Added for Spring 2025",
        content:
          "We have added exciting new courses for Spring 2025 semester. Check out our Data Science & Analytics course starting soon. Early bird discount available!",
        authorId: admin.id,
        isPinned: false,
      },
    ]);

    return NextResponse.json({ message: "Seeded successfully" });
  } catch (err) {
    console.error("Seed error:", err);
    return NextResponse.json({ error: "Seed failed: " + String(err) }, { status: 500 });
  }
}
