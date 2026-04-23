interface TipTapContentProps {
  content: string;
  className?: string;
}

export default function TipTapContent({ content, className = "" }: TipTapContentProps) {
  if (!content) return null;

  return (
    <div
      className={`tiptap-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
