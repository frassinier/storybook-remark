const toString = require("mdast-util-to-string");

function renderAccordion(groups, nodes) {
  let groupNodes = [];
  groupNodes.push({
    type: "jsx",
    value: '<Accordion.Root type="single" defaultValue="value-0">',
  });
  groups.forEach((group, id) => {
    const node = nodes[group.start];
    const label = toString(node);
    groupNodes.push({
      type: "jsx",
      value: `<Accordion.Item value="value-${id}">`,
    });
    groupNodes.push({
      type: "jsx",
      value: `<Accordion.Header>`,
    });
    groupNodes.push({
      type: "jsx",
      value: `<Accordion.Trigger>${label}</Accordion.Trigger>`,
    });
    groupNodes.push({
      type: "jsx",
      value: `</Accordion.Header>`,
    });
    groupNodes.push({
      type: "jsx",
      value: `<Accordion.Content>`,
    });
    groupNodes.push(...nodes.slice(group.start + 1, group.end));
    groupNodes.push({
      type: "jsx",
      value: `</Accordion.Content>`,
    });
    groupNodes.push({
      type: "jsx",
      value: `</Accordion.Item>`,
    });
  });
  groupNodes.push({
    type: "jsx",
    value: "</Accordion.Root>",
  });
  return groupNodes;
}

module.exports = renderAccordion;
