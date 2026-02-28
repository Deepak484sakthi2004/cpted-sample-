import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLevelColor, formatCurrency } from "@/lib/utils";
import { BookOpen } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  shortDescription?: string | null;
  thumbnail?: string | null;
  level: string;
  price: number;
  slug?: string;
  // Student variant
  progress?: number;
  onAction?: () => void;
  actionLabel?: string;
  actionHref?: string;
}

export default function CourseCard({
  id,
  title,
  shortDescription,
  thumbnail,
  level,
  price,
  slug,
  progress,
  actionLabel,
  actionHref,
}: CourseCardProps) {
  const isStudentVariant = progress !== undefined;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-40 bg-gradient-to-br from-blue-100 to-blue-200 flex-shrink-0">
        {thumbnail ? (
          <Image src={thumbnail} alt={title} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="h-12 w-12 text-blue-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{title}</h3>
          <Badge className={`text-xs flex-shrink-0 ${getLevelColor(level)}`}>
            {level.charAt(0) + level.slice(1).toLowerCase()}
          </Badge>
        </div>

        {shortDescription && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{shortDescription}</p>
        )}

        {/* Progress bar (student variant) */}
        {isStudentVariant && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between">
          {!isStudentVariant && (
            <span className="text-sm font-bold text-gray-900">
              {price === 0 ? "Free" : formatCurrency(price)}
            </span>
          )}

          {actionHref ? (
            <Link href={actionHref} className={isStudentVariant ? "w-full" : ""}>
              <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-xs w-full">
                {actionLabel ?? "View Details"}
              </Button>
            </Link>
          ) : slug ? (
            <Link href={`/courses/${slug}`}>
              <Button size="sm" variant="outline" className="text-xs border-blue-700 text-blue-700 hover:bg-blue-50">
                View Details
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
