const toString = require("mdast-util-to-string");

function renderTabs(groups, nodes) {
  let groupNodes = [];
  groupNodes.push({
    type: "jsx",
    value: `<Tabs.Root defaultValue="tabs-0">`,
  });
  groupNodes.push({
    type: "jsx",
    value: `<Tabs.List>`,
  });
  groups.forEach((group, id) => {
    const node = nodes[group.start];
    const label = toString(node);
    groupNodes.push({
      type: "jsx",
      value: `<Tabs.Trigger value="tabs-${id}">${label}</Tabs.Trigger>`,
    });
  });
  groupNodes.push({
    type: "jsx",
    value: `</Tabs.List>`,
  });
  groups.forEach((group, id) => {
    groupNodes.push({
      type: "jsx",
      value: `<Tabs.Content value="tabs-${id}">`,
    });
    groupNodes.push(...nodes.slice(group.start + 1, group.end));
    groupNodes.push({
      type: "jsx",
      value: `</Tabs.Content>`,
    });
  });
  groupNodes.push({
    type: "jsx",
    value: `</Tabs.Root>`,
  });
  return groupNodes;
}

module.exports = renderTabs;
