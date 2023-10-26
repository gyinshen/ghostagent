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
        { text: "Carsome's business model", url: "/report/37044479-d754-4b2a-84c3-9e8d61e5b2c6" }, 
      ],
    },
    {
      content: [
        { text: "Business analysis" },
        { text: "Zalo's business model", url: "/report/e6f2a4f5-3fbb-443f-8806-764151e3c764" },
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
