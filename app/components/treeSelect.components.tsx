"use client";
import React, { JSX, useEffect } from "react";

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
      {
        key: "1-3",
        value: "Node 1-3",
        isChecked: false,
        isExpanded: false,
        level: 2,
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

function filterTree(
  nodes: TreeNodeData[],
  searchValue: string
): TreeNodeData[] {
  return nodes
    .map((node) => {
      // Recursively filter children
      const filteredChildren = node.children
        ? filterTree(node.children, searchValue)
        : undefined;

      // Keep the node if its value includes the search string OR if any of its children match
      if (
        node.value.toLowerCase().includes(searchValue.toLowerCase()) ||
        (filteredChildren && filteredChildren.length > 0)
      ) {
        return {
          ...node,
          children: filteredChildren?.length ? filteredChildren : undefined,
        };
      }

      return null;
    })
    .filter((node) => node !== null); // Remove null entries
}

function TreeSelect(): JSX.Element {
  const [search, setSearch] = React.useState<string>("");
  const [state, setState] = React.useState<string[]>([]);
  // can use this way or use the tree data structure
  const [openState, setOpenState] = React.useState<Record<string, boolean>>({
    "1": false,
  });
  const [searchResult, setSearchResult] = React.useState<TreeNodeData[]>([]);

  useEffect(() => {
    const result = filterTree(DUMMY_TREE_DATA, search);
    setSearchResult(result);
  }, [search]);

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
                !node.children || node.children.length === 0
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
      <div>
        <p>Search by key:</p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {renderTree(search ? searchResult : DUMMY_TREE_DATA)}
    </div>
  );
}

export default TreeSelect;
