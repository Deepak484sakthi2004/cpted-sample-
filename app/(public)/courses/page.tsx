"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";
import EmptyState from "@/components/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getPublishedCourses } from "@/lib/actions/courses";
import { Search, BookOpen } from "lucide-react";
import PageBanner from "@/components/public/PageBanner";

type Course = {
  id: string;
  title: string;
  shortDescription: string | null;
  thumbnail: string | null;
  level: string;
  price: number;
  slug: string;
};

const LEVELS = ["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"];

export default function CoursesPage() {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("ALL");

  useEffect(() => {
    getPublishedCourses().then((courses) =>
      setAllCourses(
        courses.map((c) => ({
          id: c.id,
          title: c.title,
          shortDescription: c.shortDescription,
          thumbnail: c.thumbnail,
          level: c.level,
          price: c.price,
          slug: c.slug,
        }))
      )
    );
  }, []);

  const filtered = allCourses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = level === "ALL" || c.level === level;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageBanner
        src="/images/iStock-5.jpg" // placeholder: /images/courses-hero.jpg
        className="py-12 px-4"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            Explore Our <span className="text-amber-400">Courses</span>
          </h1>
          <p className="text-white/80">Find the perfect CPTED certification to advance your career.</p>
        </div>
      </PageBanner>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {LEVELS.map((l) => (
              <Button
                key={l}
                size="sm"
                variant={level === l ? "default" : "outline"}
                onClick={() => setLevel(l)}
                className={level === l ? "bg-amber-500 hover:bg-amber-400 text-white font-semibold border-amber-500" : ""}
              >
                {l === "ALL" ? "All Levels" : l.charAt(0) + l.slice(1).toLowerCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No courses found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{filtered.length} course{filtered.length !== 1 ? "s" : ""} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  shortDescription={course.shortDescription}
                  thumbnail={course.thumbnail}
                  level={course.level}
                  price={course.price}
                  slug={course.slug}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
