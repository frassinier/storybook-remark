const visit = require("unist-util-visit");

const groupByAccordion = require("./groupByAccordion");
const groupByDetails = require("./groupByDetails");
const groupByTabs = require("./groupByTabs");

function findGroups(node, index, parent) {
  const groups = [];

  let depth = null;

  let group;
  const { children } = parent;

  while (++index < children.length) {
    const child = children[index];

    if (child.type === "heading") {
      if (depth == null) {
        depth = child.depth;
      }

      if (child.depth < depth) {
        group.end = index;
        break;
      }

      if (child.depth === depth) {
        if (group) {
          group.end = index;
        }

        group = {};
        group.start = index;
        group.end = children.length;
        groups.push(group);
      }
    }

    if (child.type === "comment" && child.value.trim() === "/group") {
      if (group) {
        group.end = index;
      }
      break;
    }
  }

  return groups;
}

function plugin() {
  return (root) => {
    let foundGroups = false;
    let alreadyImported = false;
    visit(root, (node, index, parent) => {
      if (node.type === "import") {
        if (node.value.includes("@radix-ui")) {
          alreadyImported = true;
        }
      } else if (node.type === "comment") {
        const commentValue = node.value.trim();
        if (commentValue.startsWith("group") && !commentValue.startsWith("/")) {
          let renderFn = groupByTabs;
          const variantValue = commentValue.split(":").reverse()[0];
          if (variantValue === "details") {
            renderFn = groupByDetails;
          }
          if (variantValue === "accordion") {
            renderFn = groupByAccordion;
          }
          const groups = findGroups(node, index, parent);
          if (groups.length > 0) {
            foundGroups = true;
            const start = groups[0].start;
            const end = groups[groups.length - 1].end;
            const newChildren = renderFn(groups, parent.children);
            parent.children.splice(start, end - start, ...newChildren);
            return index + newChildren.length;
          }
        }
      }
    });

    if (foundGroups && !alreadyImported) {
      root.children.unshift({
        type: "import",
        value: "import * as Accordion from '@radix-ui/react-accordion';",
      });
      root.children.unshift({
        type: "import",
        value: "import * as Tabs from '@radix-ui/react-tabs';",
      });
    }
  };
}

module.exports = plugin;
