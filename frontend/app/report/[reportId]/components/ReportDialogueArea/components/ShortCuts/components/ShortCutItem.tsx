//ShortCutItem.tsx
import clsx from 'clsx';
import Link from 'next/link';


type ShortcutItemProps = {
  content: { text: string; url?: string }[];
};

export const ShortcutItem = ({ content }: ShortcutItemProps): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const firstLink = content.find(item => item.url != null)?.url ?? "#";

  return (
    <Link href={firstLink}>
      <div className="block bg-gray-100 rounded-lg p-4 flex-grow w-64">
        {content.map((item, index) => (
          <p className={clsx("text-gray-500", { "font-bold": index === 0 })} key={index}>
            {item.text}
          </p>
        ))}
      </div>
    </Link>
  );
};
