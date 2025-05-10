"use client";
import React, { JSX } from "react";

/**
 * TreeSelect is a React component that renders a placeholder
 * for a tree select interface. This component currently displays
 * a header titled "Tree Select Component". Additional functionality
 * for tree selection can be implemented within this component.
 */

interface TreeNodeData {
  key: string;
  value: string;
  isChecked: boolean;
  isExpanded: boolean;
  level: number;
  children?: TreeNodeData[];
}

const DUMMY_TREE_DATA: TreeNodeData[] = [
  {
    key: "1",
    value: "Node 1",
    isChecked: false,
    isExpanded: true,
    level: 1,
    children: [
      {
        key: "1-1",
        value: "Node 1-1",
        isChecked: false,
        isExpanded: false,
        level: 2,
      },
      {
        key: "1-2",
        value: "Node 1-2",
        isChecked: false,
        isExpanded: false,
        level: 2,
        children: [
          {
            key: "1-2-1",
            value: "Node 1-2-1",
            isChecked: false,
            isExpanded: false,
            level: 3,
          },
          {
            key: "1-2-2",
            value: "Node 1-2-2",
            isChecked: false,
            isExpanded: false,
            level: 3,
          },
        ],
      },
    ],
  },
  {
    key: "2",
    value: "Node 2",
    isChecked: false,
    isExpanded: false,
    level: 1,
  },
];

const findAllChildLeafs = (node: TreeNodeData): string[] => {
  if (!node.children) {
    return [node.key];
  }
  return node.children.flatMap(findAllChildLeafs);
};

// Example usage:
// const leafKeys = findAllChildLeafs(DUMMY_TREE_DATA[0]);
// console.log(leafKeys);

function TreeSelect(): JSX.Element {
  const [state, setState] = React.useState<string[]>(["1-1"]);
  // can use this way or use the tree data structure
  const [openState, setOpenState] = React.useState<Record<string, boolean>>({
    "1": false,
  });

  const onChecked = (
    key: string,
    isChecked: boolean,
    node: TreeNodeData,
    isParent?: boolean
  ) => {
    // check if the key is leaf or not
    setState((prev) => {
      if (isParent) {
        return isChecked
          ? [...prev, ...findAllChildLeafs(node)]
          : prev.filter((item) => !findAllChildLeafs(node).includes(item));
      } else {
        return isChecked ? [...prev, key] : prev.filter((item) => item !== key);
      }
    });
  };
  const renderTree = (data: TreeNodeData[]) => {
    return data.map((node) => (
      <div key={node.key} style={{ marginLeft: `${node.level * 12}px` }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            onClick={() =>
              setOpenState({ ...openState, [node.key]: !openState[node.key] })
            }
          >
            {node.children ? (!!openState[node.key] ? "v" : ">") : ""}
          </div>
          <div>
            <input
              type="checkbox"
              checked={
                !node.children
                  ? state.includes(node.key)
                  : findAllChildLeafs(node).every((item) =>
                      state.includes(item)
                    )
              }
              onChange={(e) =>
                onChecked(
                  node.key,
                  e.target.checked,
                  node,
                  node.children && node.children.length > 0
                )
              }
            />
            <span>{node.value}</span>
          </div>
        </div>
        {!!openState[node.key] && node.children && renderTree(node.children)}
      </div>
    ));
  };
  return (
    <div>
      <h1>Tree Select Component</h1>
      {renderTree(DUMMY_TREE_DATA)}
    </div>
  );
}

export default TreeSelect;
