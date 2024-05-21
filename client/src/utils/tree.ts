interface TreeNode {
  children?: TreeNode[];
}

// 查找树节点
export const findNodes = <T extends TreeNode>(
  tree: T,
  condition: (node: T) => boolean,
  searchMore: boolean,
): T | T[] | undefined => {
  const queue: T[] = [tree];
  const result: T[] = [];

  while (queue.length > 0) {
    const currentNode = queue.shift()!;

    // 检查当前节点是否满足条件
    if (condition(currentNode)) {
      if (!searchMore) {
        return currentNode; // 如果searchMore为true，返回找到的第一个匹配节点
      }
      result.push(currentNode); // 否则将节点添加到结果数组中
    }

    // 将当前节点的子节点添加到队列中，以便后续处理
    if (currentNode.children) {
      queue.push(...(currentNode.children as T[]));
    }
  }

  // searchMore为false时返回所有匹配的节点
  return searchMore ? undefined : result;
};
