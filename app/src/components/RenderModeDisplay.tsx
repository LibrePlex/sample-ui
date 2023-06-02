import { Heading, Text } from "@chakra-ui/react";
import { Metadata } from "query/metadata";

export const RenderModeDisplay = ({
  renderModes,
}: {
  renderModes: Metadata["renderModeData"];
}) => {
  return (
    <>
      <Text>
        Render modes:{" "}
        {renderModes.map((item) =>
          item.program ? (
            "Program"
          ) : item.url ? (
            <Text isTruncated>{`Url ${item.url.url}`}</Text>
          ) : (
            "None"
          )
        )}
      </Text>
    </>
  );
};
