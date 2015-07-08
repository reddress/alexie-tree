"use strict";

// a node is a portion of a tree, that stores its place in the tree by
// referring to its parent and previous sibling

function Node(id) {
  this.id = id;

  // 
  this.children = Object.create(null);
}
