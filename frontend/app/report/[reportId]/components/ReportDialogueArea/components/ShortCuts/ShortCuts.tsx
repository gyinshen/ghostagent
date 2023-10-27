import { ShortcutItem } from "./components";

export const ShortCuts = (): JSX.Element => {
  const suggestions = [
    {
      content: [
        { text: "Market trends" },
        { text: "Singapore fintech ecosystem analysis", url: "/report/e4a2bb32-8e7c-4ca4-b809-436cb87d9c37" },
      ],
    },
    {
      content: [
        { text: "Stock analysis" },
        { text: "Is Digital Ocean a good stock to invest?", url: "/report/c63e450d-c7d6-49c3-a1d1-e12123854c56" },
      ],
    },
    {
      content: [
        { text: "Business analysis" },
        { text: "OpenAI's business model", url: "/report/7993dfd3-ceb5-42f0-a8bb-ad3d0ebcf695" }, 
      ],
    },
    {
      content: [
        { text: "Business analysis" },
        { text: "Digital Ocean's business model", url: "/report/6d0d1e4f-e782-40c9-8942-dc322f7a0ebc" },
      ],
    },
  ];

  return (
    <>
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4 m-2">
          {suggestions.map((suggestion, index) => (
            <ShortcutItem key={index} content={suggestion.content} />
          ))}
        </div>
      </div>
    </>
  );
};
