// Very small placeholder renderer. In a later pass we can expand block types.
export type SimplifiedBlock = {
  type: string;
  text?: string;
  children?: SimplifiedBlock[];
};

export default function NotionRenderer({ blocks }: { blocks: SimplifiedBlock[] }) {
  return (
    <div className="prose prose-gray max-w-none">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading_1":
            return <h1 key={i}>{block.text}</h1>;
          case "heading_2":
            return <h2 key={i}>{block.text}</h2>;
          case "heading_3":
            return <h3 key={i}>{block.text}</h3>;
          case "paragraph":
          default:
            return <p key={i}>{block.text}</p>;
        }
      })}
    </div>
  );
}


