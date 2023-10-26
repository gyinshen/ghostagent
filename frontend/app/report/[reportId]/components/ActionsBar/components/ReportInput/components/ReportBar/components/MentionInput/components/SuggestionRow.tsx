import { EntryComponentProps } from "@draft-js-plugins/mention/lib/MentionSuggestions/Entry/Entry";
import { useRouter } from "next/navigation";
import { MdShare } from "react-icons/md";

import { MentionTriggerType } from "@/app/report/[reportId]/components/ActionsBar/types";
import Button from "@/lib/components/ui/Button";

export const SuggestionRow = ({
  mention,
  ...otherProps
}: EntryComponentProps): JSX.Element => {
  const router = useRouter();
  if ((mention.trigger as MentionTriggerType) === "@") {
    return (
      <div {...otherProps}>
        <div className="relative flex group px-4">
          
          <div className="absolute right-0 flex flex-row">
            <Button
              className="group-hover:visible invisible hover:text-red-500 transition-[colors,opacity] p-1"
              onClick={() =>
                router.push(``)
              }
              variant={"tertiary"}
              data-testId="share-research-button"
              type="button"
            >
              <MdShare className="text-xl" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div {...otherProps}>
    </div>
  );
};
