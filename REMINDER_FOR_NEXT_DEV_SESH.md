Yo Dan,

You are in the middle of dealing with an edge case.

When adding a new node to a tree - you set the target node to be node that
mounted - so we don't  recurse through the whole tree to figure out updates.

The edge case is where nodes are added simultaneously in different parts of
the tree.  By the time the root node checks state - the target node has been
set to the last mounted new node.  So it won't check the nodes of the tree where
other nodes mounted this render.

You are in the middle of trying to use an array of target node ids - which
sorta works - but it needs to reset to an empty array when the mounting of new
nodes has finished.  If it doesn't, then it will check more nodes than it needs to,
because it relies on the array length being zero to tell it to go back to using
recurseNodeTarget.

Tried using componentDidUpdate of the root node to reset then but the
root node doesn't always update after adding new nodes.

Also - did a cheap and nasty hack to nestedCollapserItemsExpandedRootEvery - to
try and handle having multiple target nodes.  It probably screws with the correct
caching of root node values.  The handling of targetNodeArrays will probably
have to be done inside of recurseToNode - where the caching is done.
