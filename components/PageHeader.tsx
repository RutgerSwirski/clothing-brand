interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showCursor?: boolean;
}

const PageHeader = ({
  title,
  subtitle,
  showCursor = true,
}: PageHeaderProps) => {
  return (
    <header className="relative z-20 text-center my-16 px-4">
      <h1 className="tracking-wide text-3xl md:text-5xl font-bold text-center mb-6 font-heading">
        {title}
        {showCursor && (
          <span className="ml-2 inline-block animate-pulse bg-green-500 w-3 h-5 md:w-4 md:h-6" />
        )}
      </h1>

      <hr className="border-t border-stone-300 w-12 mx-auto mb-6" />

      {subtitle && (
        <p className="text-base md:text-lg font-body font-light tracking-wide text-neutral-500 leading-snug max-w-2xl mx-auto">
          {subtitle.split("\n").map((line, idx) => (
            <span key={idx}>
              {line}
              <br />
            </span>
          ))}
        </p>
      )}
    </header>
  );
};

export default PageHeader;
